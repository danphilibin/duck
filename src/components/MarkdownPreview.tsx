import { Editor } from "@tiptap/react";

export default function MarkdownPreview({ editor }: { editor: Editor | null }) {
  return (
    <div className="mt-4 text-sm">
      <pre className="whitespace-pre-wrap">
        {editor?.storage.markdown.getMarkdown()}
      </pre>
    </div>
  );
}
