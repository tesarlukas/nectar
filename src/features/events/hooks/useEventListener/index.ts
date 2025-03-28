import { useEffect } from "react";
import eventEmitter, {
  type EventId,
  type ActionCallback,
  type ActionId,
} from "../../eventEmitter";

export const useEventListener = (
  actionId: ActionId | EventId,
  callback: ActionCallback,
) => {
  useEffect(() => {
    eventEmitter.on(actionId, callback);

    return () => {
      eventEmitter.off(actionId, callback);
    };
  }, [actionId, callback]);
};
