import { NOTES_PATH } from "@/constants/notesPath";
import { ROOT_DIR } from "@/constants/rootDir";
import {
  type FileTreeNode,
  useFileExplorer,
} from "@/features/editor/views/EditorView/parts/FileExplorer/hooks/useFileExplorer";
import type { Note } from "@/features/editor/views/EditorView/types";
import { useHiveStore } from "@/stores/useHiveStore";
import { readJson } from "@/utils/jsonHelpers";
import { useEffect, useMemo, useState } from "react";
//
//interface GraphData {
//  nodes: GraphFileNode[];
//  links: GraphFileLink[];
//}

interface NoteReference {
  noteId: string;
  referenceIds: string[];
}

const obtainReferencesWithNoteIds = async (
  nodes?: FileTreeNode[],
): Promise<NoteReference[]> => {
  if (!nodes) return [];

  try {
    const getNodeReferences = async (
      node: FileTreeNode,
    ): Promise<NoteReference[]> => {
      let results: NoteReference[] = [];

      // Only process file nodes, skip directories
      if (node.value.isFile) {
        try {
          const noteContent = await readJson<Note>(node.value.path, ROOT_DIR);
          if (noteContent) {
            results.push({
              noteId: noteContent.id,
              referenceIds: noteContent.referenceIds || [],
            });
          }
        } catch (error) {
          console.error(`Error reading node ${node.value.path}: ${error}`);
        }
      }

      // Still process children of all nodes (including directories)
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const childReferences = await getNodeReferences(child);
          results = [...results, ...childReferences];
        }
      }

      return results;
    };

    // Process all root nodes
    let allNoteReferences: NoteReference[] = [];
    for (const node of nodes) {
      const nodeReferences = await getNodeReferences(node);
      allNoteReferences = [...allNoteReferences, ...nodeReferences];
    }

    return allNoteReferences;
  } catch (errors) {
    console.error(`Error while obtaining references: ${errors}`);
    return [];
  }
};

export const useGraphView = () => {
  const hiveName = useHiveStore((state) => state.hiveName);
  const { nodes, initializeFileTree } = useFileExplorer();
  const [references, setReferences] = useState();

  const notesNode = useMemo(
    () => nodes.filter((node) => node.value.name === NOTES_PATH),
    [nodes],
  );

  useEffect(() => {
    initializeFileTree(hiveName);
  }, []);

  useEffect(() => {
    const initReferences = async () => {
      await obtainReferencesWithNoteIds(notesNode);
    };

    initReferences();
  }, [nodes]);

  return { notesNode };
};
