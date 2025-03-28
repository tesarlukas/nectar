import eventEmitter, { type EventId, type ActionId } from "../../eventEmitter";

export const useEventEmitter =
  () => (actionId: ActionId | EventId, value?: unknown) =>
    eventEmitter.emit(actionId, value);
