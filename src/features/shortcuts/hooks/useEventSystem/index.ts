export enum ActionId {
  SaveNote = "save_note",
  CreateNewNote = "create_new_note",
}

type ActionCallback = (...args: unknown[]) => void;

export const useEventSystem = () => {
  const listeners = new Map<ActionId, ActionCallback[]>();

  const addListener = (
    actionId: ActionId,
    callback: ActionCallback,
  ): (() => void) => {
    if (!listeners.has(actionId)) {
      listeners.set(actionId, []);
    }

    const actionListeners = listeners.get(actionId) ?? [];
    actionListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = actionListeners.indexOf(callback);
      if (index !== -1) {
        actionListeners?.splice(index, 1);
      }
    };
  };

  const triggerAction = (actionId: ActionId, ...args: unknown[]): boolean => {
    if (!listeners.has(actionId)) return false;

    try {
      const actionListeners = listeners.get(actionId);
      actionListeners?.forEach((callback) => callback(...args));
      return true;
    } catch (error) {
      console.error(`Error executing listeners for ${actionId}:`, error);
      return false;
    }
  };

  const getAllActionIds = (): string[] => Array.from(listeners.keys());

  return {
    addListener,
    triggerAction,
    getAllActionIds,
  };
};
