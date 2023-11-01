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
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github.css";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Highlight from "@tiptap/extension-highlight";

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

const lowlight = createLowlight(common);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const SyntaxHighlighterExt = CodeBlockLowlight.configure({
  lowlight,
});

const StarterKitExt = StarterKit.extend({
  addKeyboardShortcuts() {
    return {
      // tiptap seems to swallow this shortcut while the editor is focused
      "Mod-,": () => dispatchEvent(new Event("show-preferences")),
    };
  },
  // note: chaining .configure() after .extend() doesn't work
  addOptions() {
    return {
      ...this.parent?.(),
      codeBlock: false as const,
    };
  },
});

const TaskItemExt = TaskItem.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-l": () => this.editor.commands.toggleTaskList(),
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name),
    };
  },
  addOptions() {
    return {
      ...this.parent?.(),
      nested: true,
    };
  },
});

const HighlightExt = Highlight.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-h": () => this.editor.commands.toggleHighlight(),
      "Mod-Enter": () => {
        this.editor.commands.unsetHighlight();
        setTimeout(() => {
          this.editor.commands.insertContent(" ", {
            parseOptions: { preserveWhitespace: "full" },
          });
        }, 10);
        return true;
      },
    };
  },
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

const EditorComponent = ({ filename }: { filename: string }) => {
  const [state, dispatch] = useReducer(dailyStorageReducer, {
    ...initialDailyStorageState,
    filename,
  });

  const editor = useEditor({
    extensions: [
      StarterKitExt,
      LinkExt,
      MarkdownExt,
      PlaceholderExt,
      SyntaxHighlighterExt,
      TaskList,
      TaskItemExt,
      HighlightExt,
    ],
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
