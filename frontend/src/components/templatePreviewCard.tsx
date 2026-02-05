import { useState } from "react";
import type { Template } from "../types/templates";

interface Props {
  template: Template;
}

export default function TemplatePreviewCard({ template }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CARD */}
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer border border-muted/30 rounded-xl p-5 hover:border-primary/60 hover:shadow-md transition-all bg-background"
      >
        <h3 className="text-xl font-bold text-foreground">{template.name}</h3>

        <p className="text-xs font-mono text-muted-foreground mt-1">
          Type: <span className="text-primary">{template.type}</span> · Tone:{" "}
          <span className="text-primary">{template.tone}</span>
        </p>

        <p className="text-xs font-mono text-muted-foreground mt-2">
          Sections:{" "}
          <span className="text-primary">
            {template.layout.length}
          </span>
        </p>

        <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Click to view JSON
        </p>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-background border border-muted/30 rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-muted/20">
              <h4 className="font-bold text-lg">
                {template.name} · JSON Structure
              </h4>
              <button
                onClick={() => setOpen(false)}
                className="text-sm font-mono text-muted-foreground hover:text-foreground"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* JSON Viewer */}
            <pre className="p-6 text-xs font-mono overflow-auto max-h-[70vh] bg-muted/10">
{JSON.stringify(template, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}