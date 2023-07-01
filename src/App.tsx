import Preferences from "./components/Preferences";
import Onboarding, { useShouldShowOnboarding } from "./components/Onboarding";
import DailyEditor from "./components/DailyEditor";
import Notifications from "./components/Notifications";

function App() {
  const shouldShowOnboarding = useShouldShowOnboarding();

  return (
    <>
      <div
        className="h-10 bg-gradient-to-b from-white to-white/0 z-30 fixed top-0 left-0 w-full"
        data-tauri-drag-region
      ></div>
      <Notifications />
      {shouldShowOnboarding ? (
        <Onboarding />
      ) : (
        <>
          <DailyEditor />
          <Preferences />
        </>
      )}
    </>
  );
}

export default App;
