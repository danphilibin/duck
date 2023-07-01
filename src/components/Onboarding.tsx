import { useLocalStorage } from "react-use";
import { STORAGE_DIR_KEY, selectDataFolder } from "../utils/files";

export function useShouldShowOnboarding() {
  const [dataDir] = useLocalStorage(STORAGE_DIR_KEY, "");
  return !dataDir;
}

export default function Onboarding() {
  const [sdir, setDataDir] = useLocalStorage(STORAGE_DIR_KEY, "");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-[380px] w-full px-4 mx-auto text-center leading-5">
        <img
          src="../../src-tauri/icons/icon_1024x1024.png"
          className="w-16 h-16 mx-auto mb-1"
        />
        <h1 className="text-2xl font-semibold tracking-tight">Duck</h1>
        <p className="mt-1">A daily programming notepad.</p>
        <p className="text-sm text-gray-600 mt-6 mb-4">
          Duck saves your notes in daily Markdown files. Please select a storage
          location to begin using Duck:
        </p>
        <button
          className="rounded-md border border-gray-300 shadow-sm py-1.5 px-4 text-gray-700 font-medium text-sm hover:text-gray-700/80"
          onClick={() => {
            selectDataFolder()
              .then((res) => {
                if (typeof res !== "string") return;
                setDataDir(res);
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        >
          Select a location...
        </button>
      </div>
    </div>
  );
}
