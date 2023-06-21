import Editor from "./components/Editor";
import Preferences from "./components/Preferences";
import { useInitialContent } from "./utils/editor";
import Onboarding, { useShouldShowOnboarding } from "./components/Onboarding";

function App() {
  const initialContent = useInitialContent();
  const shouldShowOnboarding = useShouldShowOnboarding();

  return (
    <>
      <div
        className="h-10 bg-gradient-to-b from-white to-white/0 z-30 fixed top-0 left-0 w-full"
        data-tauri-drag-region
      ></div>
      {shouldShowOnboarding ? (
        <Onboarding />
      ) : (
        <>
          <Editor initialContent={initialContent} />
          <Preferences />
        </>
      )}
    </>
  );
}

export default App;
