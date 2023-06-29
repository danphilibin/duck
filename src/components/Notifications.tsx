import toast, { Toaster } from "react-hot-toast";

export { toast as notify };

export default function Notifications() {
  return (
    <Toaster
      position="bottom-right"
      gutter={6}
      toastOptions={{
        style: {
          fontSize: "14px",
        },
      }}
    />
  );
}
