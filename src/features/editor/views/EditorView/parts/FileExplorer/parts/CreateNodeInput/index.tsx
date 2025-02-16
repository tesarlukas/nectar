import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import type { FileTreeNode } from "../../hooks/useFileExplorer";

interface CreateNodeInputProps {
  type: "file" | "directory";
  parentNode: FileTreeNode;
  onClose: () => void;
  onCreateFile?: (parentNode: FileTreeNode, name: string) => void;
  onCreateDir?: (parentNode: FileTreeNode, name: string) => void;
}

export const CreateNodeInput = ({
  type,
  parentNode,
  onClose,
  onCreateFile,
  onCreateDir,
}: CreateNodeInputProps) => {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();

    // Handle clicks outside
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim()) {
      if (type === "file") {
        onCreateFile?.(parentNode, name.trim());
      } else {
        onCreateDir?.(parentNode, name.trim());
      }
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="absolute top-full left-0 mt-px z-50 shadow-lg bg-background border rounded-md w-full">
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`New ${type}...`}
          className="h-8 w-full text-sm"
        />
      </form>
    </div>
  );
};
