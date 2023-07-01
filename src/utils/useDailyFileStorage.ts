import { Reducer } from "react";

export type StorageState = {
  filename: string;
  content: string;
  title: string;
  isLoading: boolean;
  lastSavedToDisk: number;
  lastContentChange: number;
  lastSyncedToEditor: number;
};

type Action =
  | {
      type: "LOAD_FROM_DISK";
      filename: string;
      content: string;
    }
  | { type: "SET_CURRENT_FILENAME"; filename: string }
  | { type: "SAVE_TO_DISK_SUCCESS" }
  | { type: "CONTENT_CHANGE" };

export const initialDailyStorageState: StorageState = {
  filename: "",
  content: "",
  title: "",
  isLoading: false,
  lastContentChange: 0,
  lastSavedToDisk: 0,
  lastSyncedToEditor: 0,
};

const dailyFileStorageReducer: Reducer<StorageState, Action> = (
  state,
  action
) => {
  switch (action.type) {
    // call this after asynchronously loading from disk
    case "LOAD_FROM_DISK":
      if (Date.now() < state.lastSyncedToEditor) {
        console.log(
          "📄 Ignoring load from disk because it is older than the last sync to editor"
        );
        return state;
      }

      console.log("📄 Loaded", action.filename);

      let title = action.filename;
      let content = action.content;

      if (content.startsWith("# ")) {
        title = content.split("\n")[0].slice(2);
        content = content.slice(title.length + 3);
      }

      return {
        ...state,
        content: content.trim(),
        title: title.trim(),
        filename: action.filename,
        lastSavedToDisk: Date.now(),
        lastSyncedToEditor: Date.now(),
      };
    case "SET_CURRENT_FILENAME":
      return {
        ...state,
        filename: action.filename,
      };
    case "CONTENT_CHANGE":
      return {
        ...state,
        lastContentChange: Date.now(),
      };
    case "SAVE_TO_DISK_SUCCESS":
      return {
        ...state,
        lastSavedToDisk: Date.now(),
        lastSyncedToEditor: Date.now(),
      };
    default:
      return state;
  }
};

export default dailyFileStorageReducer;
