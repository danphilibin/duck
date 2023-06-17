import Editor from "./components/Editor";
import { useInitialContent } from "./utils/editor";

function App() {
  const initialContent = useInitialContent();

  return (
    <>
      <div
        className="h-10 bg-gradient-to-b from-white to-white/0  z-10 absolute top-0 left-0 w-full"
        data-tauri-drag-region
      ></div>
      <div className="h-screen overflow-scroll">
        {initialContent !== null && (
          <div className="p-3 pt-6">
            <Editor initialContent={initialContent} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
