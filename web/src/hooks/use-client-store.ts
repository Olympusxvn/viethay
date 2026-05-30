"use client";

import { useSyncExternalStore } from "react";

export function useClientReady(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function useExternalStore<T>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot: () => T
): T {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
