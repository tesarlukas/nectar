import mitt from "mitt";

export enum ActionId {
  SaveNote = "save_note",
  CreateNewNote = "create_new_note",
  SearchReplace = "search_replace",
}

export type ActionCallback = (...args: unknown[]) => void;

const eventEmitter = mitt();

export default eventEmitter;
