import { open } from "@tauri-apps/api/dialog";
import { homeDir } from "@tauri-apps/api/path";

export const DATA_DIR_KEY = "data_dir";

export async function selectDataFolder() {
  return open({
    directory: true,
    defaultPath: await homeDir(),
  });
}
