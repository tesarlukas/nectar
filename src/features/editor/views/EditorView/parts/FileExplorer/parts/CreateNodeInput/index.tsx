import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import type { FileTreeNode } from "../../hooks/useFileExplorer";
import { cn } from "@/lib/utils";

interface CreateNodeInputProps {
  type: "file" | "directory";
  parentNode: FileTreeNode;
  depth: number;
  onClose: () => void;
  onCreateFile?: (parentNode: FileTreeNode, name: string) => void;
  onCreateDir?: (parentNode: FileTreeNode, name: string) => void;
}

export const CreateNodeInput = ({
  type,
  parentNode,
  depth,
  onClose,
  onCreateFile,
  onCreateDir,
}: CreateNodeInputProps) => {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 1);

    // Handle clicks outside
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    <div
      className={cn(
        "relative z-50 mt-1 shadow-lg bg-background border rounded-md w-full",
        depth > 0 && "ml-4",
      )}
    >
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`New ${type}...`}
          className="h-8 text-sm w-full"
        />
      </form>
    </div>
  );
};
