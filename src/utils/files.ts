import {
  createDir,
  exists,
  FsDirOptions,
  readTextFile,
  writeFile,
} from "@tauri-apps/api/fs";
import { DATA_DIR_KEY } from "./storage";

const fsDirOpts: FsDirOptions = {
  recursive: true,
};

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

export async function getDataDir(): Promise<string | null> {
  return localStorage.get(DATA_DIR_KEY).then((dir: string | undefined) => {
    if (!dir) {
      return null;
    }
    return String(dir);
  });
}

async function getTodayFilePath(): Promise<string> {
  const dir = await getDataDir();

  if (!dir) throw new Error("Data folder not set");

  return `${dir}/${getTodayFileName()}`;
}

async function setupStorage() {
  try {
    const dir = await getDataDir();

    if (!dir) throw new Error("Data folder not set");

    if (!(await exists(dir, fsDirOpts))) {
      await createDir(dir, fsDirOpts);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getTodayFileContents() {
  try {
    await setupStorage();
    const filePath = await getTodayFilePath();

    let contents = "";

    if (await exists(filePath, fsDirOpts)) {
      contents = await readTextFile(filePath, fsDirOpts);
    }

    // remove the header if it exists
    if (contents.startsWith(getTodayHeader())) {
      contents = contents.slice(getTodayHeader().length + 2);
    }

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
