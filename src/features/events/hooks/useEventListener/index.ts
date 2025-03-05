import { useEffect } from "react";
import eventEmitter, {
  type ActionCallback,
  type ActionId,
} from "../../eventEmitter";

export const useEventListener = (
  actionId: ActionId,
  callback: ActionCallback,
) => {
  useEffect(() => {
    eventEmitter.on(actionId, callback);

    return () => {
      eventEmitter.off(actionId, callback);
    };
  }, [actionId, callback]);
};
