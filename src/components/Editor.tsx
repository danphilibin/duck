import Link from "@tiptap/extension-link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const LinkExt = Link.configure({
  HTMLAttributes: {
    class:
      "underline decoration-slate-400 underline-offset-2 cursor-pointer hover:opacity-50",
  },
});

const testContent = `
<p>Hello world! <a href="#">This is a link.</a></p>
<p>This is a new paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
<p>Here’s a bulleted list:</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
`;

const Editor = () => {
  const editor = useEditor({
    extensions: [StarterKit, LinkExt],
    content: testContent,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none hover:bg-slate-100 p-3 transition-colors duration-100 rounded-lg",
      },
    },
  });

  return (
    <div className="absolute inset-0">
      <EditorContent editor={editor} className="focus:bg-red-500" />
    </div>
  );
};

export default Editor;
