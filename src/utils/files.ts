import {
  BaseDirectory,
  createDir,
  exists,
  FsDirOptions,
  readTextFile,
  writeFile,
} from "@tauri-apps/api/fs";
import { isDevelopment } from "./environment";

// TODO: add a setting for this
export const DATA_FOLDER = isDevelopment ? "Duck-dev" : "Duck";

const fsDirOpts: FsDirOptions = {
  dir: BaseDirectory.Document,
  recursive: true,
};

function getTodayFileName() {
  // name format: YYYY-MM-DD.md
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}.md`;
}

function getTodayHeader() {
  // header format: # Tue Apr 04 2023
  const date = new Date();
  return `# ${date.toDateString()}`;
}

function getTodayFilePath() {
  return `${DATA_FOLDER}/${getTodayFileName()}`;
}

async function setupStorage() {
  try {
    if (!(await exists(DATA_FOLDER, fsDirOpts))) {
      await createDir(DATA_FOLDER, fsDirOpts);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getTodayFileContents() {
  try {
    await setupStorage();
    const filePath = getTodayFilePath();

    let contents = "";

    if (await exists(filePath, fsDirOpts)) {
      contents = await readTextFile(filePath, fsDirOpts);
    }

    if (!contents) {
      contents = getTodayHeader() + "  \n\n ";
    }

    return contents;
  } catch (e) {
    console.error(e);
  }
}

export async function writeToFile(contents: string) {
  try {
    await setupStorage();
    const filePath = getTodayFilePath();

    await writeFile({ contents, path: filePath }, fsDirOpts);
  } catch (e) {
    console.error(e);
  }
}
