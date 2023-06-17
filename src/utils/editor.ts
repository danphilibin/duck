import { useEffect, useRef, useState } from "react";
import { useDebounce, useEventListener } from "usehooks-ts";
import { Editor } from "@tiptap/react";
import { getTodayFileContents, writeToFile } from "./files";

const AUTOSAVE_INTERVAL = 1500;

export function useInitialContent() {
  const [contents, setContents] = useState<string | null>(null);

  useEffect(() => {
    getTodayFileContents().then((res) => (res ? setContents(res) : null));
  }, []);

  return contents;
}

export function useSaveContent(content: string | null, editor: Editor | null) {
  const newContent = useDebounce(content, AUTOSAVE_INTERVAL);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => setIsDirty(true), [content]);

  useEffect(() => {
    if (!editor) return;
    writeToFile(editor.storage.markdown.getMarkdown()).then(() => {
      setIsDirty(false);
    });
  }, [newContent]);

  useEventListener("focus", async () => {
    // don't pull in changes if we haven't saved yet
    if (isDirty) return;

    const fileContents = await getTodayFileContents();

    if (!fileContents) return;

    if (fileContents !== content) {
      editor?.commands.setContent(fileContents);
    }
  });
}

export const testContent = `
<p>Hello world! <a href="#">This is a link.</a></p>
<p>This is a new paragraph with <strong>bold text</strong> and <em>italic text</em>, and some <code>inline code</code> too.</p>
<p>Here's a bulleted list:</p>
<ul>
  <li>Item 1</li>
  <li>
    Item 2
    <ul>
      <li>Nested Item 1</li>
      <li>
        Nested Item 2
        <ul>
          <li>Deeply Nested Item 1</li>
          <li>Deeply Nested Item 2</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>Item 3</li>
</ul>
<p>Here's an ordered list:</p>
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
</ol>
<p>This is a blockquote:</p>
<blockquote>
  <p>Here's some text that's indented.</p>
  <p>Here's some more text that's indented.</p>
</blockquote>
`;
