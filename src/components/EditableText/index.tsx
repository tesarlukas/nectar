import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface EditableTextProps {
  /** Initial text to display */
  initialText?: string;
  /** Callback fired when text changes and is saved */
  onTextChange?: (newText: string) => void;
  /** Controls whether the component is in edit mode */
  isEditing?: boolean;
  /** Callback fired when editing is completed
   * @param saved - Whether the changes were saved (true) or cancelled (false)
   */
  onEditComplete?: (saved: boolean) => void;
  /** Additional className for the container */
  className?: string;
  /** Additional className for the text display */
  textClassName?: string;
  /** Additional className for the input field */
  inputClassName?: string;
  /** Whether to enable click-to-edit */
  clickToEdit?: boolean;
  /** Whether to show the context menu */
  showContextMenu?: boolean;
  /** Custom context menu items to add before the rename option */
  contextMenuItemsBefore?: React.ReactNode;
  /** Custom context menu items to add after the rename option */
  contextMenuItemsAfter?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
  initialText = "",
  onTextChange,
  isEditing = false,
  onEditComplete,
  className = "",
  textClassName = "",
  inputClassName = "",
  clickToEdit = true,
  showContextMenu = false,
  contextMenuItemsBefore,
  contextMenuItemsAfter,
}) => {
  const [text, setText] = useState<string>(initialText);
  const [isEditMode, setIsEditMode] = useState<boolean>(isEditing);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsEditMode(isEditing);
  }, [isEditing]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(text.length, text.length);
    }
  }, [isEditMode, text.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditComplete();
    }
    if (e.key === "Escape") {
      setText(initialText);
      setIsEditMode(false);
      onEditComplete?.(false);
    }
  };

  const handleEditComplete = () => {
    setIsEditMode(false);
    onTextChange?.(text);
    onEditComplete?.(true);
  };

  const handleBlur = () => {
    handleEditComplete();
  };

  const handleClick = () => {
    if (clickToEdit && !isEditMode) {
      setIsEditMode(true);
    }
  };

  const content = isEditMode ? (
    <Input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setText(e.target.value)
      }
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={`w-full ${inputClassName}`}
    />
  ) : (
    <span
      className={`inline-block ${textClassName} ${clickToEdit ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      {text || initialText}
    </span>
  );

  if (!showContextMenu) {
    return content;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>{content}</ContextMenuTrigger>
      <ContextMenuContent>
        {contextMenuItemsBefore}
        <ContextMenuItem onSelect={() => setIsEditMode(true)}>
          Rename
        </ContextMenuItem>
        {contextMenuItemsAfter}
      </ContextMenuContent>
    </ContextMenu>
  );
};
