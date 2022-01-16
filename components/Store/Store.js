import { useMemo } from "react";
import create from "zustand";

let store;

const initialState = {
  isAnimating: false,
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
      ? JSON.parse(localStorage.getItem("dark-mode")) || true
      : true,
  fontSize:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("font-size")) || 18
      : 18,
};

function initStore(preloadedState = initialState) {
  return create((set, get) => ({
    ...initialState,
    ...preloadedState,
    setIsAnimating: (isAnimating) => set(() => ({ isAnimating })),
    changeSettings: (params) => {
      const loggedIn = get().accessToken;
      const settings = get().settings;
      if (!loggedIn) {
        if (params.darkMode != undefined) {
          set((state) => ({ darkMode: params.darkMode }));
          localStorage.setItem("dark-mode", JSON.stringify(params.darkMode));
        } else if (params.fontSize) {
          set((state) => ({ fontSize: params.fontSize }));
          localStorage.setItem("font-size", JSON.stringify(params.fontSize));
        }
      } else {
        axios
          .patch(`${apiUrl}/api/settings/${settings.id}/`, params)
          .then((response) => {
            localStorage.setItem("settings", JSON.stringify(response.data));
            localStorage.setItem(
              "dark-mode",
              JSON.stringify(response.data.darkMode)
            );
            set((state) => ({ settings: response.data }));
            set((state) => ({ darkMode: response.data.darkMode }));
            set((state) => ({ fontSize: response.data.fontSize }));
          })
          .catch((err) => {
            console.log(err);
          });
      }
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
