import type { Template } from "../types/templates";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditTemplateModal from "./editTemplateModal";

interface Props {
  templates: Template[];
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Partial<Template>) => void;
}

export default function TemplateList({ templates, onDelete, onEdit }: Props) {
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null); // ✅ NEW
  const navigate = useNavigate();

  const handleUseTemplate = (template: Template) => {
  navigate(`/generate/${template.type}`, {
    state: { template },
  });
};

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 border-b border-muted/20 pb-8">
          <h2 className="text-5xl font-amarna font-bold text-primary mb-2">
            Template Management
          </h2>
          <p className="text-xl font-indie text-secondary">
            Configure your document generation blueprints
          </p>
        </header>

        {/* Template List */}
        <div className="flex flex-col gap-6">
          {templates.map((template) => {
            const isSystem = template.is_system_template ?? false;

            const sectionCount = template.layout.length;
            const sectionTypes = Array.from(
              new Set(template.layout.map((s) => s.section_type))
            );

            return (
              <div
                key={template.id}
                className={`border p-6 rounded-xl transition-all
                  ${
                    isSystem
                      ? "bg-secondary/5 border-secondary/30"
                      : "bg-background border-muted/30 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                  }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold">{template.name}</h3>
                      {isSystem && (
                        <span className="text-[10px] uppercase tracking-widest bg-secondary px-2 py-0.5 rounded font-mono font-bold text-black">
                          System
                        </span>
                      )}
                    </div>

                    <p className="font-mono text-sm text-muted-foreground">
                      Type:{" "}
                      <span className="text-primary">{template.type}</span> ·
                      Tone:{" "}
                      <span className="text-primary">{template.tone}</span>
                    </p>

                    <p className="font-mono text-xs text-muted-foreground">
                      Sections:{" "}
                      <span className="text-primary">{sectionCount}</span>
                      {sectionTypes.length > 0 && (
                        <>
                          {" "}·{" "}
                          <span className="text-primary">
                            {sectionTypes.join(", ")}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg"
                    >
                      Use
                    </button>

                    
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="px-6 py-2 border border-primary/40 text-primary font-mono text-sm rounded-lg hover:bg-primary/10"
                    >
                      Preview
                    </button>

                    {!isSystem && (
                      <>
                        <button
                          onClick={() => setEditingTemplate(template)}
                          className="px-6 py-2 border border-muted-foreground/30 font-mono text-sm rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => onDelete(template.id)}
                          className="px-6 py-2 text-destructive font-mono text-sm rounded-lg"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-muted/20 rounded-2xl">
            <p className="font-indie text-2xl text-muted-foreground">
              No templates found…
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTemplate && (
        <EditTemplateModal
          template={editingTemplate}
          onSave={onEdit}
          onClose={() => setEditingTemplate(null)}
        />
      )}

      
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-background border border-muted/30 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-muted/20">
              <h3 className="font-bold text-lg">
                {previewTemplate.name} · JSON Preview
              </h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="font-mono text-sm text-muted-foreground hover:text-foreground"
              >
                [ CLOSE ]
              </button>
            </div>

            <pre className="p-6 text-xs font-mono overflow-auto max-h-[70vh] bg-muted/10">
{JSON.stringify(previewTemplate, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}