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
import { filterFileTree, sortFileTreeRecursive } from "@/utils/nodeHelpers";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { ActionId, NonAlphas } from "@/features/events/eventEmitter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEventEmitter } from "@/features/events/hooks/useEventEmitter";
import { normalizeText } from "@/utils/normalizeText";

interface FileExplorerProps
  extends Pick<
      FileExplorerNodeProps,
      | "onDelete"
      | "onNodeClick"
      | "onCreateFile"
      | "onCreateDir"
      | "onRename"
      | "onMove"
      | "onPaste"
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
      onPaste,
    }: FileExplorerProps,
    ref,
  ) => {
    const emitter = useEventEmitter();
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filterQuery, setFilterQuery] = useState<string>("");
    const focusableElementsRef = useRef<HTMLElement[]>([]);
    const focusIndex = useRef<number>(1);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [clipboardNode, setClipboardNode] = useState<FileTreeNode>();

    const isFilterQuery = filterQuery.length > 0;

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

      const nextIndex =
        // this check is to prevent the focus to move from the last item the
        // user has selected when he jumped to the toolbar
        document.activeElement === toolbarRef.current
          ? focusIndex.current
          : focusIndex.current >= focusableElementsRef.current.length - 1
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
        // same check as above
        document.activeElement === toolbarRef.current
          ? focusIndex.current
          : focusIndex.current <= 0
            ? focusableElementsRef.current.length - 1
            : focusIndex.current - 1;

      focusableElementsRef.current[prevIndex]?.focus();
      focusIndex.current = prevIndex;
    }, []);

    const handleTopNav = useCallback((e: KeyboardEvent) => {
      e.preventDefault();

      updateFocusableElements();
      if (focusableElementsRef.current.length === 0) return;

      focusableElementsRef.current[0]?.focus();
      focusIndex.current = 0;
    }, []);

    const handleBottomNav = useCallback((e: KeyboardEvent) => {
      e.preventDefault();

      updateFocusableElements();
      if (focusableElementsRef.current.length === 0) return;

      focusableElementsRef.current[
        focusableElementsRef.current.length - 1
      ]?.focus();
      focusIndex.current = focusableElementsRef.current.length - 1;
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

    const handleOnCopy = useCallback((node: FileTreeNode) => {
      setClipboardNode(node);
    }, []);

    // Collect all focusable elements on mount and updates
    useEffect(() => {
      updateFocusableElements();
    }, [notesNode]);

    // Focus user onto the focused element when he focuses on the explorer
    useEffect(() => {
      if (!ref || typeof ref === "function") return;

      const container = ref.current;

      const focusElement = () => {
        if (focusIndex.current === -1) {
          focusIndex.current = 0;
        }
        focusableElementsRef.current[focusIndex.current]?.focus();
      };

      container?.addEventListener("focus", focusElement);

      return () => {
        container?.removeEventListener("focus", focusElement);
      };
    }, []);

    const handleFocusToolbar = () => {
      toolbarRef.current?.focus();
    };

    const handleOnFilter = useCallback((query: string) => {
      setFilterQuery(query);
    }, []);

    useShortcuts(ActionId.FocusExplorerToolbar, handleFocusToolbar);

    // Register custom keyboard shortcuts
    useShortcuts(ActionId.MoveExplorerCursorDown, handleForwardNav);
    useShortcuts(ActionId.MoveExplorerCursorUp, handleBackwardNav);
    useShortcuts(ActionId.MoveExplorerCursorTop, handleTopNav);
    useShortcuts(ActionId.MoveExplorerCursorBottom, handleBottomNav);

    useShortcuts(ActionId.MoveExplorerCursorBottom, handleBottomNav);
    useShortcuts(ActionId.ExpandAll, () => emitter(ActionId.ExpandAll));
    useShortcuts(ActionId.FilterNodes, () => {
      if (isFilterQuery) {
        setFilterQuery("");
        return;
      }

      emitter(ActionId.FilterNodes);
    });

    useShortcuts(NonAlphas.Escape, () => setClipboardNode(undefined));
    // turn off the tab and shift tab for this component
    useShortcuts(NonAlphas.Tab, () => {});
    useShortcuts(NonAlphas.ShiftTab, () => {});

    const renderNodes = useCallback(() => {
      return sortFileTreeRecursive(
        filterFileTree(notesNode?.children ?? [], (node) =>
          normalizeText(node.value.name).includes(normalizeText(filterQuery)),
        ),
        sortOrder,
      ).map((node) => (
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
          onCopy={handleOnCopy}
          onPaste={onPaste}
          clipboardNode={clipboardNode}
          setClipboardNode={setClipboardNode}
        />
      ));
    }, [notesNode, sortOrder, selectedNode, clipboardNode, filterQuery]);

    return (
      <div className="h-full sticky top-0" ref={ref} tabIndex={-1}>
        <FileExplorerToolbar
          ref={toolbarRef}
          notesNode={notesNode}
          onRefresh={onRefresh}
          onCreateFile={onCreateFileToolbar}
          onCreateDir={onCreateDirToolbar}
          sortOrder={sortOrder}
          onToggleSortOrder={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          isFilterQuery={isFilterQuery}
          setFilterQuery={setFilterQuery}
          onFilter={handleOnFilter}
        />
        <ScrollArea className="h-full pb-10" thumbClassName="w-1">
          {renderNodes()}
        </ScrollArea>
      </div>
    );
  },
);
