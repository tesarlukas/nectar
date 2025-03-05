import eventEmitter, { type ActionId } from "../../eventEmitter";

export const useEventEmitter = () => (actionId: ActionId, value?: unknown) =>
  eventEmitter.emit(actionId, value);
