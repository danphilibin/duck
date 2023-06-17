import Editor from "./components/Editor";
import { useInitialContent } from "./utils/editor";

function App() {
  const initialContent = useInitialContent();

  return (
    <>
      <div className="h-8" data-tauri-drag-region></div>
      {initialContent !== null && (
        <div className="p-3 pt-0">
          <Editor initialContent={initialContent} />
        </div>
      )}
    </>
  );
}

export default App;
