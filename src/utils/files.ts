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

export function getTodayFileName(date = new Date()) {
  // name format: YYYY-MM-DD.md
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}.md`;
}

function filenameToDate(filename: string) {
  const [year, month, day] = filename.split("-").map((x) => parseInt(x, 10));
  return new Date(year, month - 1, day);
}

export function getDailyHeader(date = new Date()) {
  // header format: # Tue Apr 04 2023
  return `# ${date.toDateString()}`;
}

function getStorageDir(): string | null {
  const dir = localStorage.getItem(STORAGE_DIR_KEY) ?? "";
  return dir ? JSON.parse(dir) : null;
}

function getFullFilePath(filename: string): string {
  const dir = getStorageDir();

  if (!dir) throw new Error("Data folder not set");

  return `${dir}/${filename}`;
}

async function setupStorage() {
  const dir = getStorageDir();

  if (!dir) throw new Error("Data folder not set");

  if (!(await exists(dir, fsDirOpts))) {
    await createDir(dir, fsDirOpts);
  }
}

export async function getFileContents(filename: string) {
  await setupStorage();
  const filePath = getFullFilePath(filename);

  let content = "";

  if (await exists(filePath, fsDirOpts)) {
    console.log("📄 Found existing file, reading contents");
    content = await readTextFile(filePath, fsDirOpts);
  } else {
    console.log("📄 Creating new file for today");
    content = getDailyHeader(filenameToDate(filename));
  }

  return {
    filename,
    content: content.trim(),
  };
}

export async function writeToFile(filename: string, contents: string) {
  try {
    await setupStorage();
    const filePath = getFullFilePath(filename);

    await writeFile(
      {
        path: filePath,
        contents,
      },
      fsDirOpts
    );
  } catch (e) {
    console.error(e);
  }
}
