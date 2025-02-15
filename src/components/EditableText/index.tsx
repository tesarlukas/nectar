import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

interface EditableTextProps {
  /** Initial text to display */
  initialText: string;
  /** Callback fired when text changes and is saved */
  onTextChange?: (newText: string) => void;
  /** Additional className for the text display */
  textClassName?: string;
  /** Additional className for the input field */
  inputClassName?: string;
}

export const EditableText = ({
  initialText,
  onTextChange,
  textClassName = "",
  inputClassName = "",
}: EditableTextProps) => {
  const [text, setText] = useState<string>(initialText);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(text.length, text.length);
    }
  }, [isEditMode, text.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleEditComplete(true);
    }
    if (e.key === "Escape") {
      setText(initialText);
      handleEditComplete(false);
    }
  };

  const handleEditComplete = (shouldSave: boolean) => {
    setIsEditMode(false);
    if (shouldSave) {
      onTextChange?.(text);
    } else {
      setText(initialText);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditMode(true);
  };

  if (isEditMode) {
    return (
      <Input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        }
        onKeyDown={handleKeyDown}
        onBlur={() => handleEditComplete(true)}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${inputClassName}`}
      />
    );
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <span
      className={`inline-block cursor-pointer ${textClassName}`}
      onClick={handleClick}
    >
      {text}
    </span>
  );
};
