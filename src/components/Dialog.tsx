import React from "react";
import * as Ariakit from "@ariakit/react";
import { X } from "lucide-react";

export default function Dialog(props: {
  dialog: Ariakit.DialogStore;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Ariakit.Dialog
      store={props.dialog}
      backdrop={
        <div className="inset-0 z-40 backdrop-blur-[1px] opacity-0 data-[enter]:opacity-100 transition-all duration-150 bg-white/60" />
      }
      className="fixed inset-4 top-8 z-50 mx-auto h-fit overflow-auto bg-white rounded-lg p-4 shadow-lg opacity-0 data-[enter]:opacity-100 transition-all duration-150 -translate-y-2 origin-top data-[enter]:translate-y-0 text-sm text-slate-600"
      style={{
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.04), 0 10px 15px -3px rgba(0,0,0,0.1)",
      }}
    >
      <div className="absolute top-0 right-0">
        <button
          onClick={props.dialog.hide}
          className="p-4 text-slate-600 hover:opacity-60"
        >
          <X size={16} />
        </button>
      </div>
      <h2 className="text-base font-medium mb-4 text-slate-900">
        {props.title}
      </h2>
      {props.children}
    </Ariakit.Dialog>
  );
}
