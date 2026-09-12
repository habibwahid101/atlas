export const COMPARE_CAP_MESSAGE = "Compare is full (3). Remove one to add another.";

type Listener = (message: string) => void;

const listeners = new Set<Listener>();

/** Fire from addCompare when tray is already full — UI subscribers must show the toast. */
export function emitCompareCapToast(message: string = COMPARE_CAP_MESSAGE) {
  listeners.forEach((listener) => {
    try {
      listener(message);
    } catch {
      /* ignore subscriber errors */
    }
  });
}

export function subscribeCompareCapToast(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
