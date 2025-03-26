import { useState } from "react";
import {
  BubbleMenu as TiptapBubbleMenu,
  type BubbleMenuProps as TiptapBubleMenuProps,
} from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Delete,
  Plus,
  Trash2,
  MoveHorizontal,
  MoveVertical,
  GripHorizontal,
  GripVertical,
  AlignJustify,
  TableProperties,
  Merge,
  Split,
} from "lucide-react";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { NonAlphas } from "@/features/events/eventEmitter";

interface TableBubbleMenuProps extends Omit<TiptapBubleMenuProps, "children"> {}

export const TableBubbleMenu = ({ editor, ...rest }: TableBubbleMenuProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);

  if (!editor) {
    return null;
  }

  useShortcuts(NonAlphas.Escape, () => {
    setIsExpanded(false);
    setShowLayoutOptions(false);
  });

  const handleButtonClick = (callback: () => void) => {
    callback();
  };

  return (
    <TiptapBubbleMenu
      editor={editor}
      shouldShow={({ editor, state }) => {
        const isEmptyCursorInTable =
          state.selection.empty &&
          (editor.isActive("table") ||
            editor.isActive("tableCell") ||
            editor.isActive("tableHeader") ||
            editor.isActive("tableRow"));

        const isCellSelection =
          // @ts-expect-error Library doesn't have type definition for this
          state.selection.$headCell && state.selection.$anchorCell;

        return isCellSelection || isEmptyCursorInTable;
      }}
      tippyOptions={{
        placement: "top",
        arrow: true,
        duration: 100,
      }}
      {...rest}
    >
      <div className="bg-card text-card-foreground shadow border border-border rounded-lg overflow-hidden">
        {!isExpanded ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 rounded-full"
            onClick={() => setIsExpanded(true)}
          >
            <TableProperties className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex flex-col p-1">
            {/* Table deletion row */}
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-destructive"
                title="Delete Table"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().deleteTable().run(),
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Cell operations and alignment */}
            <div className="flex space-x-1 mb-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Merge Cells"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().mergeCells().run(),
                  )
                }
              >
                <Merge className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Split Cell"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().splitCell().run(),
                  )
                }
              >
                <Split className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Toggle Header Cell"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().toggleHeaderCell().run(),
                  )
                }
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Layout Options"
                onClick={() => setShowLayoutOptions(!showLayoutOptions)}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>

            {/* Column operations */}
            <div className="flex space-x-1 mb-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Add Column Before"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().addColumnBefore().run(),
                  )
                }
              >
                <GripVertical className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Add Column After"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().addColumnAfter().run(),
                  )
                }
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Delete Column"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().deleteColumn().run(),
                  )
                }
              >
                <MoveVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* Row operations */}
            <div className="flex space-x-1 mb-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Add Row Before"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().addRowBefore().run(),
                  )
                }
              >
                <GripHorizontal className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Add Row After"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().addRowAfter().run(),
                  )
                }
              >
                <GripHorizontal className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Delete Row"
                onClick={() =>
                  handleButtonClick(() =>
                    editor.chain().focus().deleteRow().run(),
                  )
                }
              >
                <MoveHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Layout options - conditionally visible */}
            {showLayoutOptions && (
              <div className="mt-2 pt-2 border-t border-border">
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    title="Align Left"
                    onClick={() =>
                      handleButtonClick(() => {
                        // Implementation for cell alignment would go here
                        // This depends on the specific table extension capabilities
                        alert("Cell align left would be implemented here");
                      })
                    }
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    title="Align Center"
                    onClick={() =>
                      handleButtonClick(() => {
                        alert("Cell align center would be implemented here");
                      })
                    }
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    title="Align Right"
                    onClick={() =>
                      handleButtonClick(() => {
                        alert("Cell align right would be implemented here");
                      })
                    }
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </TiptapBubbleMenu>
  );
};
