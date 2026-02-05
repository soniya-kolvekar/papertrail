import { useState } from "react";
import type {
  Template,
  TemplateSection,
  TemplateType,
} from "../types/templates";

interface Props {
  onCreate: (template: Template) => void;
}

export default function CreateTemplateModal({ onCreate }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<TemplateType>("custom");
  const [tone, setTone] = useState("");

  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [globalRules, setGlobalRules] = useState("");
  const [promptInstruction, setPromptInstruction] = useState("");

  function addSection() {
    setSections((prev) => [
      ...prev,
      {
        id: `section_${prev.length + 1}`,
        label: "",
        order: prev.length + 1,
        section_type: "paragraph",
        content_source: "ai_generated",
      },
    ]);
  }

  function updateSection<K extends keyof TemplateSection>(
    index: number,
    key: K,
    value: TemplateSection[K]
  ) {
    const updated = [...sections];
    updated[index] = { ...updated[index], [key]: value };
    setSections(updated);
  }

  function removeSection(index: number) {
    const updated = sections.filter((_, i) => i !== index);
    setSections(
      updated.map((s, i) => ({
        ...s,
        order: i + 1,
      }))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const template: Template = {
      id: name.toLowerCase().replace(/\s+/g, "_"),
      name,
      type,
      tone,
      layout: sections,
      global_rules: globalRules
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      prompt_instruction: promptInstruction,
      is_system_template: false,
    };

    onCreate(template);
    setIsOpen(false);

    // reset
    setName("");
    setType("custom"); 
    setTone("");
    setSections([]);
    setGlobalRules("");
    setPromptInstruction("");
  }

  const inputClass =
    "w-full bg-background border border-muted/40 rounded-lg p-3 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all";
  const labelClass = "block font-indie text-secondary text-lg mb-1";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full"
      >
        + Create New Template
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="bg-background w-full max-w-3xl rounded-2xl border border-primary/30 shadow-xl">
            {/* Header */}
            <div className="p-6 border-b">
              <h3 className="text-3xl font-amarna text-primary">
                New Document Template
              </h3>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 max-h-[70vh] overflow-y-auto"
            >
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Template Name</label>
                  <input
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Document Type</label>
                  <select
                    className={inputClass}
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as TemplateType)
                    }
                  >
                    <option value="custom">Custom</option>
                    <option value="letter">Letter</option>
                    <option value="report">Report</option>
                    <option value="essay">Essay</option>
                    <option value="email">Email</option>
                    <option value="resume">Resume</option>
                    <option value="caption">Caption</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Tone</label>
                <input
                  className={inputClass}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="formal, friendly, concise"
                />
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className={labelClass}>Document Structure</label>
                  <button
                    type="button"
                    onClick={addSection}
                    className="text-sm text-primary"
                  >
                    + Add Section
                  </button>
                </div>

                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        className={inputClass}
                        placeholder="Section Label"
                        value={section.label}
                        onChange={(e) =>
                          updateSection(index, "label", e.target.value)
                        }
                      />

                      <select
                        className={inputClass}
                        value={section.section_type}
                        onChange={(e) =>
                          updateSection(
                            index,
                            "section_type",
                            e.target.value as TemplateSection["section_type"]
                          )
                        }
                      >
                        <option value="heading">Heading</option>
                        <option value="date">Date</option>
                        <option value="title">Title</option>
                        <option value="paragraph">Paragraph</option>
                        <option value="body">Body</option>
                        <option value="signature">Signature</option>
                      </select>

                      <select
                        className={inputClass}
                        value={section.content_source}
                        onChange={(e) =>
                          updateSection(
                            index,
                            "content_source",
                            e.target.value as TemplateSection["content_source"]
                          )
                        }
                      >
                        <option value="user_input">User Input</option>
                        <option value="ai_generated">AI Generated</option>
                        <option value="static">Static</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="text-xs text-red-500"
                    >
                      Remove section
                    </button>
                  </div>
                ))}
              </div>

              {/* Global Rules */}
              <div>
                <label className={labelClass}>Global Style Rules</label>
                <input
                  className={inputClass}
                  value={globalRules}
                  onChange={(e) => setGlobalRules(e.target.value)}
                  placeholder="No emojis, formal language, concise"
                />
              </div>

              {/* Prompt */}
              <div>
                <label className={labelClass}>AI Prompt Instruction</label>
                <textarea
                  className={`${inputClass} min-h-[120px]`}
                  value={promptInstruction}
                  onChange={(e) =>
                    setPromptInstruction(e.target.value)
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}