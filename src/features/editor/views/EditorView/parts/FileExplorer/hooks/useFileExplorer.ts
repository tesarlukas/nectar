import { copyFile, mkdir, remove, rename } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { ROOT_DIR } from "@/constants/rootDir";
import { useCallback, useState } from "react";
import { readJson, writeJson } from "@/utils/jsonHelpers";
import { useHiveStore } from "@/stores/useHiveStore";
import {
  type TreeNode,
  addNode,
  removeNode,
  //findNode,
  //traverseDFS,
  filterNodes,
  changeNodeValues,
} from "@/utils/treeHelpers";
import { EMPTY_NOTE } from "../index.preset";
import { appendJson } from "@/utils/nodeHelpers";
import { buildDirectoryTree, createFileNode } from "../utils";
import type { Note } from "../../../types";
import { nanoid } from "nanoid";
import type { JSONContent } from "@tiptap/react";

export interface FileInfo {
  name: string;
  path: string;
  dirPath: string;
  isDirectory: boolean;
  isSymLink: boolean;
  isFile: boolean;
}

// FileTreeNode now implements the generic TreeNode interface
export type FileTreeNode = TreeNode<FileInfo>;

export const useFileExplorer = () => {
  const [nodes, setNodes] = useState<FileTreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FileTreeNode>();
  const [selectedNoteNode, setSelectedNoteNode] = useState<FileTreeNode>();
  const hiveName = useHiveStore((state) => state.hiveName);

  const initializeFileTree = useCallback(async (hiveName: string) => {
    if (hiveName === "") return;

    const initPath = await join(hiveName);
    const builtNodes = await buildDirectoryTree(initPath, ROOT_DIR);

    setNodes(builtNodes);
  }, []);

  const addNewNode = useCallback(
    async (
      location: string,
      nodeName: string,
      opts?: Partial<{ isDirectory: boolean; content: JSONContent }>,
    ): Promise<void> => {
      try {
        const defaultOpts = {
          isDirectory: false,
          content: EMPTY_NOTE as JSONContent,
        };
        const finalOpts = { ...defaultOpts, ...opts };

        const fullPath = await join(location, nodeName);

        const newFileInfo: FileInfo = {
          name: finalOpts.isDirectory ? nodeName : appendJson(nodeName),
          path: finalOpts.isDirectory ? fullPath : appendJson(fullPath),
          dirPath: location,
          isDirectory: finalOpts.isDirectory,
          isFile: !finalOpts.isDirectory,
          isSymLink: false,
        };

        await createNewNoteOrDir(location, nodeName, {
          isDirectory: finalOpts.isDirectory,
          content: finalOpts.content,
        });

        const newNode = createFileNode(newFileInfo);
        setNodes((currentNodes) =>
          addNode(
            currentNodes,
            (info) => info.path === newNode.value.dirPath,
            newNode,
          ),
        );
      } catch (error) {
        console.error("Error adding node:", error);
      }
    },
    [],
  );

  const removeNodeByPath = useCallback(async (path: string): Promise<void> => {
    try {
      await remove(path, { baseDir: ROOT_DIR, recursive: true });

      setNodes((currentNodes) =>
        removeNode(currentNodes, (info) => info.path === path),
      );
    } catch (error) {
      console.error(`Error removing node at path ${path}:`, error);
    }
  }, []);

  const saveNote = async (node: FileTreeNode, note: Note) => {
    await writeJson<Note>(node.value.dirPath, node.value.name, note, ROOT_DIR);
  };

  const readNote = async (path: string) => {
    const noteContent = await readJson<Note>(path, ROOT_DIR);

    return noteContent;
  };

  const createNewNoteOrDir = async (
    location: string,
    name: string,
    opts?: Partial<{ isDirectory: boolean; content: JSONContent }>,
  ) => {
    const defaultOpts = {
      isDirectory: false,
      content: EMPTY_NOTE as JSONContent,
    };
    const finalOpts = { ...defaultOpts, ...opts };

    if (finalOpts?.isDirectory) {
      await mkdir(await join(location, name), {
        baseDir: ROOT_DIR,
        recursive: true,
      });
      return;
    }

    const noteContent: Note = {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      editorContent: finalOpts.content,
      referenceIds: [],
    };

    await writeJson<Note>(location, name, noteContent, ROOT_DIR);
  };

  const renameNodeAndNoteOrDir = useCallback(
    async (node: FileTreeNode, name: string) => {
      const oldPath = node.value.path;
      const newName = node.value.isDirectory ? name : appendJson(name);
      const newPath = await join(node.value.dirPath, newName);

      try {
        await rename(oldPath, newPath, {
          oldPathBaseDir: ROOT_DIR,
          newPathBaseDir: ROOT_DIR,
        });
      } catch (errors) {
        console.error("Error renaming the node: ", errors);
        throw errors;
      }

      setNodes((currentNodes) =>
        changeNodeValues(
          currentNodes,
          (info) => info.name === node.value.name,
          {
            ...node.value,
            name: newName,
            path: newPath,
          },
        ),
      );
    },
    [],
  );

  const updateNoteMetadata = useCallback(
    async (noteLocation: string, noteName: string) => {
      const noteContent = await readNote(await join(noteLocation, noteName));
      if (!noteContent) return;

      await writeJson<Note>(
        noteLocation,
        noteName,
        {
          ...noteContent,
          id: nanoid(),
          createdAt: new Date().toISOString(),
          lastModifiedAt: new Date().toISOString(),
        },
        ROOT_DIR,
      );
    },
    [],
  );

  /** The function does not modify the tree because it is used with move as well */
  const copyNote = async (
    node: FileTreeNode,
    targetNode: FileTreeNode,
    options?: { isNewFile: boolean },
  ) => {
    try {
      const targetNodePath = await join(
        targetNode.value.isFile
          ? targetNode.value.dirPath
          : targetNode.value.path,
        node.value.name,
      );
      await copyFile(node.value.path, targetNodePath, {
        fromPathBaseDir: ROOT_DIR,
        toPathBaseDir: ROOT_DIR,
      });

      if (options?.isNewFile) {
        await updateNoteMetadata(targetNode.value.dirPath, node.value.name);
      }
    } catch (errors) {
      console.error("Error copying the node: ", errors);
      throw errors;
    }
  };

  const moveNote = async (node: FileTreeNode, targetNode: FileTreeNode) => {
    if (
      node.value.path === (await join(targetNode.value.path, node.value.name))
    ) {
      return;
    }

    try {
      await copyNote(node, targetNode);
      await removeNodeByPath(node.value.path);
      const newTreeNodes = await buildDirectoryTree(
        await join(hiveName),
        ROOT_DIR,
      );
      setNodes(() => newTreeNodes);
    } catch (errors) {
      console.error("Error moving the note: ", errors);
      throw errors;
    }
  };

  const pasteNote = async (node: FileTreeNode, targetNode: FileTreeNode) => {
    if (
      node.value.path === (await join(targetNode.value.path, node.value.name))
    ) {
      return;
    }

    try {
      await copyNote(node, targetNode, { isNewFile: true });
      const newTreeNodes = await buildDirectoryTree(
        await join(hiveName),
        ROOT_DIR,
      );
      setNodes(() => newTreeNodes);
    } catch (errors) {
      console.error("Error moving the note: ", errors);
      throw errors;
    }
  };

  // unused for now
  const searchFileTree = useCallback(
    (
      nodes: FileTreeNode[],
      searchTerm: string,
      options: { matchCase?: boolean } = {},
    ) => {
      return filterNodes(nodes, (info) => {
        const nodeName = options.matchCase
          ? info.name
          : info.name.toLowerCase();
        const term = options.matchCase ? searchTerm : searchTerm.toLowerCase();
        return nodeName.includes(term);
      });
    },
    [],
  );

  // unused for now
  const getJsonFiles = useCallback(() => {
    return filterNodes(
      nodes,
      (info) => info.isFile && info.name.endsWith(".json"),
    );
  }, [nodes]);

  // unused for now
  const getTreeStatistics = useCallback(() => {
    const stats = {
      totalFiles: 0,
      totalDirectories: 0,
      maxDepth: 0,
    };

    const calculateDepth = (node: FileTreeNode, currentDepth: number) => {
      stats.maxDepth = Math.max(stats.maxDepth, currentDepth);

      if (node.value.isFile) {
        stats.totalFiles++;
      } else if (node.value.isDirectory) {
        stats.totalDirectories++;
      }

      node.children?.forEach((child) =>
        calculateDepth(child, currentDepth + 1),
      );
    };

    nodes.forEach((node) => calculateDepth(node, 0));

    return stats;
  }, [nodes]);

  return {
    nodes,
    setNodes,
    selectedNode,
    setSelectedNode,
    selectedNoteNode,
    setSelectedNoteNode,
    buildDirectoryTree,
    removeNodeByPath,
    addNewNode,
    searchFileTree,
    getJsonFiles,
    getTreeStatistics,
    initializeFileTree,
    saveNote,
    readNote,
    createNewNoteOrDir,
    renameNodeAndNoteOrDir,
    moveNote,
    pasteNote,
  };
};
