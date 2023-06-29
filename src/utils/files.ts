import {
  BaseDirectory,
  createDir,
  exists,
  FsDirOptions,
  readTextFile,
  writeFile,
} from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { homeDir } from "@tauri-apps/api/path";

const fsDirOpts: FsDirOptions = {
  dir: BaseDirectory.Document,
  recursive: true,
};

export const STORAGE_DIR_KEY = "storageDir";

export async function selectDataFolder() {
  return open({
    directory: true,
    recursive: true,
    defaultPath: await homeDir(),
  });
}

function getTodayFileName() {
  // name format: YYYY-MM-DD.md
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}.md`;
}

export function getTodayHeader() {
  // header format: # Tue Apr 04 2023
  const date = new Date();
  return `# ${date.toDateString()}`;
}

function getStorageDir(): string | null {
  const dir = localStorage.getItem(STORAGE_DIR_KEY) ?? "";
  return dir ? JSON.parse(dir) : null;
}

async function getTodayFilePath(): Promise<string> {
  const dir = getStorageDir();

  if (!dir) throw new Error("Data folder not set");

  return `${dir}/${getTodayFileName()}`;
}

async function setupStorage() {
  try {
    const dir = getStorageDir();
    console.log("dir", dir);

    if (!dir) throw new Error("Data folder not set");

    if (!(await exists(dir, fsDirOpts))) {
      await createDir(dir, fsDirOpts);
    }

    console.log("Confirmed storage dir exists:", dir);
  } catch (e) {
    console.error(e);
  }
}

export async function getTodayFileContents() {
  try {
    await setupStorage();
    const filePath = await getTodayFilePath();

    let contents = "";

    console.log("Checking if today's file already exists");

    if (await exists(filePath, fsDirOpts)) {
      console.log("File does exist, reading contents");
      contents = await readTextFile(filePath, fsDirOpts);
    } else {
      console.log("File does not exist, creating one");
    }

    // remove the header if it exists
    if (contents.startsWith(getTodayHeader())) {
      contents = contents.slice(getTodayHeader().length);
    }

    contents = contents.trim();

    return contents;
  } catch (e) {
    console.error(e);
  }
}

export async function writeToFile(contents: string) {
  try {
    await setupStorage();
    const filePath = await getTodayFilePath();
    const fileContents = getTodayHeader() + "\n\n" + contents;

    await writeFile(
      {
        contents: fileContents,
        path: filePath,
      },
      fsDirOpts
    );
  } catch (e) {
    console.error(e);
  }
}
