import { useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";

export function useOnWindowRefocus(cb: () => void, deps: unknown[] = []) {
  useEffect(() => {
    let unlisten: () => void;

    appWindow
      .onFocusChanged(({ payload: focused }) => {
        if (focused) {
          cb();
        }
      })
      .then((u) => {
        unlisten = u;
      })
      .catch((e) => {
        console.error(e);
      });

    return () => {
      if (unlisten) unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb, ...deps]);
}
