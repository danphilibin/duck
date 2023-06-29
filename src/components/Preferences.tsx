import { useDialogStore } from "@ariakit/react";
import Dialog from "./Dialog";
import { useHotkeys } from "react-hotkeys-hook";
import { useEventListener } from "usehooks-ts";
import { useLocalStorage } from "usehooks-ts";
import { STORAGE_DIR_KEY, selectDataFolder } from "../utils/files";

export default function Preferences() {
  const dialog = useDialogStore({
    animated: true,
  });

  const [dataFolder, setDataFolder] = useLocalStorage(STORAGE_DIR_KEY, "");

  useHotkeys("meta+comma", () => dialog.toggle(), [dialog]);
  useEventListener("toggle-preferences", dialog.toggle);
  useEventListener("show-preferences", dialog.show);

  function onSelect() {
    selectDataFolder().then((res) => {
      if (typeof res == "string") {
        setDataFolder(res);
      }
    });
  }

  return (
    <Dialog dialog={dialog} title="Preferences">
      <div>
        <label className="text-slate-900 font-medium block">
          Storage location
        </label>

        {dataFolder ? (
          <>
            <p className="mt-1">{dataFolder}</p>
            <button
              className="text-blue-600 font-medium py-1 hover:opacity-60"
              onClick={onSelect}
            >
              Change...
            </button>
          </>
        ) : (
          <button
            className="text-blue-600 font-medium py-1 hover:opacity-60"
            onClick={onSelect}
          >
            Select...
          </button>
        )}

        {!dataFolder && (
          <p className="mt-2">⚠️ Please select a storage location.</p>
        )}
      </div>
    </Dialog>
  );
}
