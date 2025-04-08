import { useRef } from "react";
import type { FileTreeNode } from "../../parts/FileExplorer/hooks/useFileExplorer";
import { nanoid } from "nanoid";

export interface JumplistItem {
  id: string;
  node: FileTreeNode;
}

export const useJumplist = () => {
  const jumplistRef = useRef<JumplistItem[]>([]);
  const jumplistIndexRef = useRef<number>(0);

  const createNewItem = (node?: FileTreeNode): JumplistItem | undefined => {
    if (!node) return;

    return { id: nanoid(), node: node };
  };

  const addItemToJumplist = (item: JumplistItem) => {
    if (jumplistIndexRef.current < jumplistRef.current.length - 1) {
      jumplistRef.current = jumplistRef.current.slice(
        0,
        // plus 1 because the end is exclusive
        jumplistIndexRef.current + 1,
      );
      jumplistIndexRef.current = jumplistRef.current.length - 1;
    }

    jumplistRef.current.push(item);
  };

  const setIndexByItem = (item: JumplistItem) => {
    const itemIndex = jumplistRef.current.findIndex(
      (jumplistItem) => jumplistItem.id === item.id,
    );

    jumplistIndexRef.current = itemIndex;
  };

  const moveJumplistOut = () => {
    if (jumplistIndexRef.current === 0) return 0;

    return --jumplistIndexRef.current;
  };

  const moveJumplistIn = () => {
    if (jumplistIndexRef.current === jumplistRef.current.length - 1)
      return jumplistRef.current.length - 1;

    return ++jumplistIndexRef.current;
  };

  const isNodeCurrentJumplistItem = (node: FileTreeNode) => {
    return (
      jumplistRef.current[jumplistIndexRef.current]?.node.nodeId === node.nodeId
    );
  };

  const clearJumplist = (baseNode?: FileTreeNode) => {
    const baseItem = createNewItem(baseNode);

    jumplistRef.current = baseItem ? [baseItem] : [];
    jumplistIndexRef.current = 0;
  };

  return {
    jumplistRef,
    jumplistIndexRef,
    addItemToJumplist,
    setIndexByItem,
    createNewItem,
    moveJumplistOut,
    moveJumplistIn,
    clearJumplist,
    isNodeCurrentJumplistItem,
  };
};
