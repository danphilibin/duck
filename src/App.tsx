import Editor from "./components/Editor";
import { useInitialContent } from "./utils/editor";

function App() {
  const initialContent = useInitialContent();

  return (
    <>
      <div
        className="h-10 bg-gradient-to-b from-white to-white/0 z-30 fixed top-0 left-0 w-full"
        data-tauri-drag-region
      ></div>
      {initialContent !== null && <Editor initialContent={initialContent} />}
    </>
  );
}

export default App;
