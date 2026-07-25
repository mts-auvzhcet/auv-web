import { useSyncExternalStore } from "react";
import { subscribe, getDB } from "./store";

/**
 * Re-renders the component whenever the store changes.
 * Returns the whole DB snapshot; selectors can derive from it.
 */
export function useStore() {
  return useSyncExternalStore(subscribe, getDB, getDB);
}
