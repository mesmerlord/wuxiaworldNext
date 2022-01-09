import { useMemo } from "react";
import create from "zustand";

let store;

const initialState = {
  lastUpdate: 0,
  darkMode: false,
  count: 0,
  siteName: process.env.NEXT_PUBLIC_SITE_NAME,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  accessToken:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("token"))
      : null,
  userInfo:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user-info"))
      : null,
  settings:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("settings"))
      : { darkMode: true },
  darkMode:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("dark-mode"))
      : true,
  fontSize:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("font-size"))
      : 18,
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

  if (typeof window === "undefined") return _store;
  if (!store) store = _store;

  return _store;
};

export function useHydrate(initialState) {
  const state =
    typeof initialState === "string" ? JSON.parse(initialState) : initialState;
  const store = useMemo(() => initializeStore(state), [state]);
  return store;
}
