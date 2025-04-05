import { useRef, useState } from "react";
import { FloatingMenu as TiptapFloatingMenu } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  FileVideo,
  Link2,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Table,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { ActionId, NonAlphas } from "@/features/events/eventEmitter";

interface FloatingMenuProps {
  editor: Editor | null;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ editor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const isExpandableRef = useRef(false);

  if (!editor) {
    return null;
  }

  useShortcuts(NonAlphas.Escape, () => {
    setIsExpanded(() => false);
  });

  useShortcuts(
    ActionId.ToggleFloatingMenuExpansion,
    () => {
      if (isExpandableRef.current) setIsExpanded((prev) => !prev);
    },
    { enableOnContentEditable: true },
  );

  const handleButtonClick = (callback: () => void) => {
    callback();
    setIsExpanded(false);
    setShowMediaOptions(false);
  };

  return (
    <TiptapFloatingMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { selection } = state;
        const { $anchor, empty } = selection;

        // Only show menu on empty lines or at start of empty nodes
        const isEmptyTextBlock =
          $anchor.parent.type.name === "paragraph" &&
          $anchor.parent.content.size === 0;

        isExpandableRef.current = isEmptyTextBlock;

        return empty && isEmptyTextBlock;
      }}
      tippyOptions={{
        placement: "bottom",
        arrow: true,
        duration: 100,
      }}
    >
      <div className="bg-card text-card-foreground shadow border border-border rounded-lg overflow-hidden">
        {!isExpanded ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 rounded-full"
            onClick={() => setIsExpanded(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex flex-col p-1">
            {/* Main menu buttons - always visible when expanded */}
            <div className="flex space-x-1 mb-1">
              {/* Text formatting options */}
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Paragraph"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().setParagraph().run(),
                  )
                }
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Heading 1"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run(),
                  )
                }
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Heading 2"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run(),
                  )
                }
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Heading 3"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run(),
                  )
                }
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Blockquote"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().toggleBlockquote().run(),
                  )
                }
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>

            {/* List options row */}
            <div className="flex space-x-1 mb-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Bullet List"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().toggleBulletList().run(),
                  )
                }
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Numbered List"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().toggleOrderedList().run(),
                  )
                }
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Task List"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().toggleTaskList().run(),
                  )
                }
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Code Block"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().toggleCodeBlock().run(),
                  )
                }
              >
                <Code className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Horizontal Rule"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().setHorizontalRule().run(),
                  )
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            {/* Special block options */}
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Table (3×3)"
                onClick={() =>
                  handleButtonClick(() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run(),
                  )
                }
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>

            {/* Media options - conditionally visible */}
            {showMediaOptions && (
              <div className="mt-2 pt-2 border-t border-border">
                <div className="flex space-x-1 mb-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                        title="Insert Image"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-2">
                      <div className="flex flex-col space-y-2">
                        <p className="text-xs font-medium">Insert image</p>
                        <input
                          type="text"
                          placeholder="Image URL"
                          className="border border-input bg-background rounded-md px-2 py-1 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const target = e.target as HTMLInputElement;
                              editor
                                .chain()
                                .focus()
                                .setImage({ src: target.value })
                                .run();
                              target.value = "";
                              setShowMediaOptions(false);
                              setIsExpanded(false);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Handle file upload logic here
                            alert("File upload would be implemented here");
                            setShowMediaOptions(false);
                            setIsExpanded(false);
                          }}
                        >
                          <span className="text-xs">Upload</span>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                        title="Insert Video"
                      >
                        <FileVideo className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-2">
                      <div className="flex flex-col space-y-2">
                        <p className="text-xs font-medium">Insert video</p>
                        <input
                          type="text"
                          placeholder="Video URL (YouTube, Vimeo, etc.)"
                          className="border border-input bg-background rounded-md px-2 py-1 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              // This requires a video extension
                              const target = e.target as HTMLInputElement;
                              alert(
                                `Video embed would be implemented here for: ${target.value}`,
                              );
                              target.value = "";
                              setShowMediaOptions(false);
                              setIsExpanded(false);
                            }
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                        title="Insert Embed"
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-2">
                      <div className="flex flex-col space-y-2">
                        <p className="text-xs font-medium">Insert embed</p>
                        <input
                          type="text"
                          placeholder="Embed URL or HTML"
                          className="border border-input bg-background rounded-md px-2 py-1 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const target = e.target as HTMLInputElement;
                              alert(
                                `Embed would be implemented here for: ${target.value}`,
                              );
                              target.value = "";
                              setShowMediaOptions(false);
                              setIsExpanded(false);
                            }
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        )}
        {isExpanded && (
          <Button
            variant="ghost"
            className="absolute right-1 bottom-1 w-8 h-8 rounded-lg m-0 p-0"
            onClick={() => setIsExpanded(false)}
          >
            <X />
          </Button>
        )}
      </div>
    </TiptapFloatingMenu>
  );
};
