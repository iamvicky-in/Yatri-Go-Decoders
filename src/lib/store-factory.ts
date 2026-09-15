import { useSyncExternalStore } from "react";

export function createLocalStorageStore<T>(key: string, defaultValue: T) {
  let state: T = defaultValue;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());

  const hydrate = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      state = defaultValue;
    }
  };

  const persist = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  };

  return {
    get: () => {
      hydrate();
      return state;
    },
    set: (next: T) => {
      state = next;
      persist();
      emit();
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    useStore: () => {
      return useSyncExternalStore(
        (l) => {
          listeners.add(l);
          return () => listeners.delete(l);
        },
        () => {
          hydrate();
          return state;
        },
        () => defaultValue,
      );
    },
  };
}
