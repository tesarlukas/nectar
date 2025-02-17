import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import type { FileTreeNode } from "../../hooks/useFileExplorer";
import { cn } from "@/lib/utils";

interface NodeInputProps {
  type: "file" | "directory";
  depth: number;
  onClose: () => void;
  onSubmit: (name: string) => void;
  defaultValue?: string;
}

export const NodeInput = ({
  type,
  depth,
  onClose,
  onSubmit,
  defaultValue,
}: NodeInputProps) => {
  const [name, setName] = useState(defaultValue);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && name.trim().length > 0) {
      onSubmit(name.trim());
    }

    onClose();
  };

  return (
    <div
      className={cn(
        "relative z-50 mt-1 shadow-lg bg-background border rounded-md w-full",
        depth > 0 && "ml-4",
      )}
    >
      <form onSubmit={handleOnSubmit}>
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

interface CreateNodeInputProps extends Omit<NodeInputProps, "onSubmit"> {
  parentNode: FileTreeNode;
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
  const handleOnSubmit = (name: string) => {
    if (name) {
      if (type === "file") {
        onCreateFile?.(parentNode, name);
      } else {
        onCreateDir?.(parentNode, name);
      }
    }
  };

  return (
    <NodeInput
      type={type}
      depth={depth}
      onClose={onClose}
      onSubmit={handleOnSubmit}
    />
  );
};

interface RenameNodeInputProps extends Omit<NodeInputProps, "onSubmit"> {
  node: FileTreeNode;
  onRename?: (node: FileTreeNode, name: string) => void;
}

export const RenameNodeInput = ({
  type,
  node,
  depth,
  onClose,
  onRename,
}: RenameNodeInputProps) => {
  const handleOnSubmit = (name: string) => {
    if (name.trim()) {
      onRename?.(node, name);
    }
  };

  return (
    <NodeInput
      type={type}
      depth={depth}
      onClose={onClose}
      onSubmit={handleOnSubmit}
      defaultValue={node.value.name}
    />
  );
};
