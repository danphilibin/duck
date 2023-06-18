import { useState } from "react";
import Link from "@tiptap/extension-link";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Placeholder from "@tiptap/extension-placeholder";
import { useSaveContent } from "../utils/editor";
import { getTodayHeader } from "../utils/files";

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

function MarkdownPreview({ editor }: { editor: Editor | null }) {
  return (
    <div className="mt-4 text-sm">
      <pre className="whitespace-pre-wrap">
        {editor?.storage.markdown.getMarkdown()}
      </pre>
    </div>
  );
}

const StarterKitExt = StarterKit.configure({
  code: {
    HTMLAttributes: {
      class:
        "bg-slate-100 rounded-md px-1 py-0.5 group-hover:bg-slate-200 transition-colors duration-100 align-center",
    },
  },
});

const EditorComponent = ({
  initialContent,
}: {
  initialContent: string | null;
}) => {
  // this prevents hot reloads from resetting the editor content.
  const [content, setContent] = useState<string | null>(initialContent);

  const editor = useEditor({
    extensions: [StarterKitExt, LinkExt, MarkdownExt, PlaceholderExt],
    content,
    editorProps: {
      attributes: {
        class: "focus:outline-none text-sm p-4 pt-3 rounded-lg group",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useSaveContent(content, editor);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-none text-lg font-semibold pt-10 p-4 pb-0 cursor-default">
        {getTodayHeader().replace(/^# /, "")}
      </div>
      <EditorContent editor={editor} className="flex-1 flex flex-col" />
      {/* <MarkdownPreview editor={editor} /> */}
    </div>
  );
};

export default EditorComponent;
