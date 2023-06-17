import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Placeholder from "@tiptap/extension-placeholder";

const LinkExt = Link.configure({
  HTMLAttributes: {
    class:
      "underline decoration-slate-400 underline-offset-2 cursor-pointer hover:opacity-50",
  },
});

const CodeExt = Code.configure({
  HTMLAttributes: {
    class:
      "bg-slate-100 rounded-md px-1 py-0.5 group-hover:bg-slate-200 transition-colors duration-100 align-center",
  },
});

const MarkdownExt = Markdown.configure({
  html: true,
  breaks: true,
});

const PlaceholderExt = Placeholder.configure({
  placeholder: "Start typing...",
});

const testContent = `
<p>Hello world! <a href="#">This is a link.</a></p>
<p>This is a new paragraph with <strong>bold text</strong> and <em>italic text</em>, and some <code>inline code</code> too.</p>
<p>Here's a bulleted list:</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
`;

function MarkdownPreview({ editor }: { editor: Editor | null }) {
  return (
    <div className="mt-4 text-sm">
      <pre className="whitespace-pre-wrap">
        {editor?.storage.markdown.getMarkdown()}
      </pre>
    </div>
  );
}

const EditorComponent = () => {
  const editor = useEditor({
    extensions: [StarterKit, LinkExt, CodeExt, MarkdownExt, PlaceholderExt],
    // content: testContent,
    content: localStorage.getItem("content") || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] focus:outline-none hover:bg-slate-100 text-sm p-3 transition-colors duration-100 rounded-lg group",
      },
    },
  });

  return (
    <div className="absolute inset-0">
      <EditorContent editor={editor} />
      {/* <MarkdownPreview editor={editor} /> */}
    </div>
  );
};

export default EditorComponent;
