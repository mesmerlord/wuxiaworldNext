import { useMemo } from 'react';
import create from 'zustand';

let store;

const initialState = {
  lastUpdate: 0,
  darkMode: false,
  count: 0,
};

function initStore(preloadedState = initialState) {
  return create((set, get) => ({
    ...initialState,
    ...preloadedState,

    toggleDarkMode: (params) => {
      set({
        darkMode: params,
      });
    },
  }));
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    store = undefined;
  }

  if (typeof window === 'undefined') return _store;
  if (!store) store = _store;

  return _store;
};

export function useHydrate(initialState) {
  const state = typeof initialState === 'string' ? JSON.parse(initialState) : initialState;
  const store = useMemo(() => initializeStore(state), [state]);
  return store;
}
