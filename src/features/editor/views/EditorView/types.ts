import type { JSONContent } from "@tiptap/react";

export interface Note {
  /** unique identifier */
  id: string;
  /** ISO format */
  createdAt: string;
  /** ISO format */
  lastModifiedAt: string;
  /** other possible relations with the note itself - unused for now */
  referenceIds: string[];
  /** the content given obtained through the editor object */
  editorContent: JSONContent;
}
