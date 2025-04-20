import { StateCreator, StoreApi, UseBoundStore } from "zustand";

// Type-safe selector hook for zustand stores
export function createSelectors<T extends object>(
  store: UseBoundStore<StoreApi<T>>
) {
  return Object.keys(store.getState()).reduce((selectors, key) => {
    const selector = (state: T) => state[key as keyof T];
    return {
      ...selectors,
      [key]: () => store(selector),
    };
  }, {} as Record<keyof T, () => T[keyof T]>);
}

// Middleware to persist state to localStorage
export const persist =
  <T extends object>(
    key: string,
    options: {
      version?: number;
      blacklist?: (keyof T)[];
      whitelist?: (keyof T)[];
    } = {}
  ) =>
  (config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) => {
    const version = options.version || 0;

    // Load persisted state from localStorage
    const loadPersistedState = (): Partial<T> => {
      try {
        const storedStateJSON = localStorage.getItem(key);
        if (!storedStateJSON) return {};

        const storedState = JSON.parse(storedStateJSON);

        // Check version and return empty state if versions don't match
        if (storedState._version !== version) return {};

        // Remove version from state without assigning to variable
        const restoredState = { ...storedState };
        delete restoredState._version;

        return restoredState as Partial<T>;
      } catch (error) {
        console.error("Error loading persisted state:", error);
        return {};
      }
    };

    // Filter state based on blacklist/whitelist
    const filterState = (state: T): Partial<T> => {
      if (options.whitelist && options.whitelist.length > 0) {
        return options.whitelist.reduce((obj, key) => {
          obj[key] = state[key];
          return obj;
        }, {} as Partial<T>);
      }

      if (options.blacklist && options.blacklist.length > 0) {
        const result = { ...state };
        options.blacklist.forEach((key) => {
          delete result[key];
        });
        return result;
      }

      return state;
    };

    // Initialize with persisted state
    const initialState = {
      ...config(
        (stateOrUpdater) => {
          // For function updaters, we need to call it with current state
          if (typeof stateOrUpdater === "function") {
            const updater = stateOrUpdater as (state: T) => T;
            const currentState = get();
            const nextState = updater(currentState);

            // Save filtered state to localStorage
            try {
              // @ts-expect-error filterState returns Partial<T> which we need to handle
              const filteredState = filterState(nextState);
              const persistedState = { ...filteredState, _version: version };
              localStorage.setItem(key, JSON.stringify(persistedState));
            } catch (error) {
              console.error("Error persisting state:", error);
            }

            // Regular state update with original updater function
            set(stateOrUpdater);
          } else {
            // For direct state objects
            const nextState = stateOrUpdater;

            // Save filtered state to localStorage
            try {
              // @ts-expect-error filterState returns Partial<T> which we need to handle
              const filteredState = filterState(nextState);
              const persistedState = { ...filteredState, _version: version };
              localStorage.setItem(key, JSON.stringify(persistedState));
            } catch (error) {
              console.error("Error persisting state:", error);
            }

            // Regular state update
            set(stateOrUpdater);
          }
        },
        get,
        api
      ),
      ...loadPersistedState(),
    } as T;

    return initialState;
  };
