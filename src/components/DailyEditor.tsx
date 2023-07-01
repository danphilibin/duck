import { useState } from "react";
import Editor from "./Editor";
import { useOnWindowRefocus } from "../utils/useOnWindowRefocus";

// wait until 3am to switch to the next day, so that working past midnight
// doesn't bump you into a new file.
const DAY_STARTS_AT = 3;

function getTodayFileName() {
  const date = new Date();

  if (date.getHours() < DAY_STARTS_AT) {
    date.setDate(date.getDate() - 1);
  }

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // name format: YYYY-MM-DD.md
  return `${date.getFullYear()}-${month}-${day}.md`;
}

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
