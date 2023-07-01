import { useState } from "react";
import { getTodayFileName } from "../utils/files";
import Editor from "./Editor";
import { useOnWindowRefocus } from "../utils/useOnWindowRefocus";

function useTodayFileName() {
  const [filename, setFilename] = useState<string>(getTodayFileName());

  useOnWindowRefocus(() => {
    setFilename(getTodayFileName());
  });

  return filename;
}

export default function DailyEditor() {
  const filename = useTodayFileName();

  return <Editor filename={filename} />;
}
