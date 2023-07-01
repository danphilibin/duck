import { useCallback, useEffect, useReducer } from "react";
import Link from "@tiptap/extension-link";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Placeholder from "@tiptap/extension-placeholder";
import { getFileContents, writeToFile } from "../utils/files";
import dailyStorageReducer, {
  StorageState,
  initialDailyStorageState,
} from "../utils/useDailyFileStorage";
import { useOnWindowRefocus } from "../utils/useOnWindowRefocus";
import { useThrottle } from "react-use";

const AUTOSAVE_INTERVAL = 1500;

const LinkExt = Link.configure({
  autolink: false,
  HTMLAttributes: {
    class:
      "underline decoration-slate-400 underline-offset-2 cursor-pointer hover:opacity-50",
  },
});

const MarkdownExt = Markdown.configure({
  html: true,
  breaks: true,
});

const PlaceholderExt = Placeholder.configure({
  placeholder: "Start typing...",
});

export function useSaveContent(
  state: StorageState,
  editor: Editor | null,
  writeFileFn: (content: string) => void
) {
  const lastUpdateKey = useThrottle(state.lastContentChange, AUTOSAVE_INTERVAL);
  // don't write if we haven't read from disk yet
  const isReadyToSave = !!state.lastSavedToDisk;

  useEffect(() => {
    if (!editor || !isReadyToSave) return;
    writeFileFn(editor.storage.markdown.getMarkdown());
  }, [editor, writeFileFn, lastUpdateKey, isReadyToSave]);
}

function MarkdownPreview({ editor }: { editor: Editor | null }) {
  return (
    <div className="mt-4 text-sm">
      <pre className="whitespace-pre-wrap">
        {editor?.storage.markdown.getMarkdown()}
      </pre>
    </div>
  );
}

const EditorComponent = ({ filename }: { filename: string }) => {
  const [state, dispatch] = useReducer(dailyStorageReducer, {
    ...initialDailyStorageState,
    filename,
  });

  const editor = useEditor({
    extensions: [StarterKit, LinkExt, MarkdownExt, PlaceholderExt],
    content: state.content,
    editorProps: {
      attributes: {
        class: "focus:outline-none text-sm p-[7%] pt-3 rounded-lg group",
      },
    },
    onUpdate: () => {
      // sets a lastContentChange timestamp that we use to periodically save to disk
      dispatch({ type: "CONTENT_CHANGE" });
    },
  });

  const loadFromDisk = useCallback(() => {
    getFileContents(filename)
      .then((res) =>
        res !== undefined
          ? dispatch({
              type: "LOAD_FROM_DISK",
              ...res,
            })
          : null
      )
      .catch(() => {
        console.error("Failed to load file from disk");
      });
  }, [filename]);

  const loadOnRefocus = useCallback(() => {
    if (state.lastSavedToDisk + AUTOSAVE_INTERVAL < Date.now()) {
      console.log("💾 Contents on disk may have changed, reloading");
      loadFromDisk();
    }
  }, [state.lastSavedToDisk, loadFromDisk]);

  useOnWindowRefocus(loadOnRefocus);

  const writeToDisk = useCallback(
    (content: string) => {
      console.log("💾 Writing to disk");

      const contentWithTitle = `# ${state.title}\n\n${content}`;

      writeToFile(state.filename, contentWithTitle)
        .then(() => {
          dispatch({
            type: "SAVE_TO_DISK_SUCCESS",
          });
          return;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [state.filename, state.title]
  );

  useEffect(() => {
    console.log("📝 Loading updated content into editor");
    editor?.commands.setContent(state.content);
  }, [editor, state.content]);

  useEffect(() => {
    loadFromDisk();
  }, [loadFromDisk]);

  useSaveContent(state, editor, writeToDisk);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-none text-lg font-semibold pt-10 p-[7%] pb-0 cursor-default">
        {state.title}
      </div>
      <EditorContent editor={editor} className="flex-1 flex flex-col" />
      {/* <MarkdownPreview editor={editor} /> */}
    </div>
  );
};

export default EditorComponent;
