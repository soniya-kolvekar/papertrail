import { useState } from "react";
import type {
  Template,
  TemplateSection,
  TemplateType,
} from "../types/templates";

interface Props {
  template: Template;
  onSave: (id: string, updatedData: Partial<Template>) => void;
  onClose: () => void;
}

export default function EditTemplateModal({
  template,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(template.name);
  const [type, setType] = useState<TemplateType>(template.type);
  const [tone, setTone] = useState(template.tone);

  const [sections, setSections] = useState<TemplateSection[]>(
    template.layout
  );

  const [globalRules, setGlobalRules] = useState(
    template.global_rules.join(", ")
  );

  const [promptInstruction, setPromptInstruction] = useState(
    template.prompt_instruction
  );

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

    onSave(template.id, {
      name,
      type,
      tone,
      layout: sections,
      global_rules: globalRules
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      prompt_instruction: promptInstruction,
    });

    onClose();
  }

  const inputClass =
    "w-full bg-background border border-muted/40 rounded-lg p-3 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all";
  const labelClass = "block font-indie text-secondary text-lg mb-1";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-background border border-secondary/30 w-full max-w-2xl rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-muted/20">
          <h3 className="text-3xl font-amarna text-secondary">
            Modify Template
          </h3>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
            &gt; Template ID: {template.id}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Name */}
          <div>
            <label className={labelClass}>Template Name</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Type */}
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
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className={labelClass}>Tone</label>
            <input
              className={inputClass}
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className={labelClass}>Document Structure</label>
              <button
                type="button"
                onClick={addSection}
                className="text-sm text-secondary"
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
                      updateSection(
                        index,
                        "label",
                        e.target.value
                      )
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
              placeholder="No emojis, concise, formal"
            />
          </div>

          {/* Prompt */}
          <div>
            <label className={labelClass}>AI Prompt Instruction</label>
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={promptInstruction}
              onChange={(e) =>
                setPromptInstruction(e.target.value)
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-muted-foreground"
            >
              [ CANCEL ]
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-secondary text-secondary-foreground font-bold rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}