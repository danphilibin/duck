import Editor from "./components/Editor";
import EntryBlock from "./components/EntryBlock";

function App() {
  return (
    <>
      <div className="h-8" data-tauri-drag-region></div>
      <div className="p-3 pt-0">
        <EntryBlock />
      </div>
    </>
  );
}

export default App;
