import {
  FileExplorerNode,
  type FileExplorerNodeProps,
} from "./parts/FileExplorerNode";
import { FileExplorerToolbar } from "./parts/FileExplorerToolbar";
import type { FileTreeNode } from "./hooks/useFileExplorer";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NOTES_PATH } from "@/constants/notesPath";
import { sortNodes } from "@/utils/nodeHelpers";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { ActionId, NonAlphas } from "@/features/events/eventEmitter";

interface FileExplorerProps
  extends Pick<
      FileExplorerNodeProps,
      | "onDelete"
      | "onNodeClick"
      | "onCreateFile"
      | "onCreateDir"
      | "onRename"
      | "onMove"
    >,
    Pick<FileExplorerToolbar, "onRefresh"> {
  nodes: FileTreeNode[];
  selectedNode?: FileTreeNode;
}

export const FileExplorer = forwardRef<HTMLDivElement, FileExplorerProps>(
  (
    {
      nodes,
      selectedNode,
      onNodeClick,
      onRename,
      onDelete,
      onRefresh,
      onCreateFile,
      onCreateDir,
      onMove,
    }: FileExplorerProps,
    ref,
  ) => {
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const focusableElementsRef = useRef<HTMLElement[]>([]);
    const focusIndex = useRef<number>(0);

    const notesNode = useMemo(
      () => nodes.filter((node) => node.value.name === NOTES_PATH)[0],
      [nodes],
    );

    const onCreateFileToolbar = (_: FileTreeNode, name: string) => {
      onCreateFile?.(notesNode, name);
    };

    const onCreateDirToolbar = (_: FileTreeNode, name: string) => {
      onCreateDir?.(notesNode, name);
    };

    // Custom keyboard navigation handlers
    const handleForwardNav = useCallback((e: KeyboardEvent) => {
      e.preventDefault();

      updateFocusableElements();

      if (focusableElementsRef.current.length === 0) return;

      // cursor index flip
      const nextIndex =
        focusIndex.current >= focusableElementsRef.current.length - 1
          ? 0
          : focusIndex.current + 1;

      focusableElementsRef.current[nextIndex]?.focus();
      focusIndex.current = nextIndex;
    }, []);

    const handleBackwardNav = useCallback((e: KeyboardEvent) => {
      e.preventDefault();

      updateFocusableElements();
      if (focusableElementsRef.current.length === 0) return;

      const prevIndex =
        focusIndex.current <= 0
          ? focusableElementsRef.current.length - 1
          : focusIndex.current - 1;

      focusableElementsRef.current[prevIndex]?.focus();
      focusIndex.current = prevIndex;
    }, []);

    const updateFocusableElements = useCallback(() => {
      if (!ref || typeof ref === "function" || !ref.current) return;

      const container = ref.current;
      const focusables = container.querySelectorAll<HTMLElement>(
        'button:not([tabindex="-1"])',
      );

      focusableElementsRef.current = Array.from(focusables);

      // If current index is beyond array bounds, reset it
      if (focusIndex.current >= focusableElementsRef.current.length) {
        focusIndex.current += -1;
      }
    }, [ref]);

    // Collect all focusable elements on mount and updates
    useEffect(() => {
      updateFocusableElements();
    }, [notesNode]);

    // Focus user onto the focused element when he focuses on the explorer
    useEffect(() => {
      if (!ref || typeof ref === "function") return;

      const container = ref.current;

      const focusElement = () => {
        focusableElementsRef.current[focusIndex.current]?.focus();
      };

      container?.addEventListener("focus", focusElement);

      return () => {
        container?.removeEventListener("focus", focusElement);
      };
    }, []);

    // Register custom keyboard shortcuts
    useShortcuts(ActionId.MoveExplorerCursorDown, handleForwardNav);
    useShortcuts(ActionId.MoveExplorerCursorUp, handleBackwardNav);

    // turn off the tab and shift tab for this component
    useShortcuts(NonAlphas.Tab, () => {});
    useShortcuts(NonAlphas.ShiftTab, () => {});

    const renderNodes = useCallback(() => {
      return (notesNode?.children ?? [])
        .sort(sortNodes(sortOrder))
        .map((node) => (
          <FileExplorerNode
            key={node.value.path}
            node={node}
            selectedPath={selectedNode?.value.path}
            onNodeClick={onNodeClick}
            onRename={onRename}
            onDelete={onDelete}
            onCreateFile={onCreateFile}
            onCreateDir={onCreateDir}
            onMove={onMove}
          />
        ));
    }, [notesNode, sortOrder, selectedNode]);

    return (
      <div className="h-full p-2" ref={ref} tabIndex={-1}>
        <FileExplorerToolbar
          notesNode={notesNode}
          onRefresh={onRefresh}
          onCreateFile={onCreateFileToolbar}
          onCreateDir={onCreateDirToolbar}
          sortOrder={sortOrder}
          onToggleSortOrder={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        />
        {renderNodes()}
      </div>
    );
  },
);
