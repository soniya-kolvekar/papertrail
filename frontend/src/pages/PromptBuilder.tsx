import { useLocation } from "react-router-dom";
import { useState } from "react";
import type { Template } from "../types/templates";

export default function PromptBuilder() {
  const location = useLocation();
  const { template } = location.state as { template: Template };

  const [userInput, setUserInput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  function handleGeneratePrompt() {
    const prompt = buildPrompt(template, userInput);
    setGeneratedPrompt(prompt);
  }

  function buildPrompt(template: Template, userInput: string) {
    const orderedSections = [...template.layout].sort(
      (a, b) => a.order - b.order
    );

    const sectionInstructions = orderedSections
      .map((section, index) => {
        const rules =
          section.rules && section.rules.length > 0
            ? `Rules: ${section.rules.join("; ")}`
            : "";

        if (section.content_source === "user_input") {
          return `${index + 1}. ${section.label} (${section.section_type})
Source: USER INPUT
${rules}`;
        }

        if (section.content_source === "ai_generated") {
          return `${index + 1}. ${section.label} (${section.section_type})
Source: AI GENERATED
${rules}`;
        }

        return `${index + 1}. ${section.label} (${section.section_type})
Source: STATIC`;
      })
      .join("\n\n");

    return `
${template.prompt_instruction}

Document Type: ${template.type}
Tone: ${template.tone}

GLOBAL RULES:
${template.global_rules.join("\n")}

DOCUMENT STRUCTURE:
${sectionInstructions}

USER INPUT:
${userInput}

INSTRUCTIONS:
- Generate content strictly in the order above
- Do not invent extra sections
- Follow section-level and global rules
- Output clean, structured text
`;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold">
        {template.name} – Prompt Builder
      </h2>

      <p className="text-sm text-muted-foreground">
        {template.is_system_template ? "System Template" : "User Template"}
      </p>

      <textarea
        className="w-full p-4 border rounded-lg font-mono text-sm h-40"
        placeholder="Enter your content here..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      <button
        className="px-6 py-2 bg-primary text-white rounded-lg"
        onClick={handleGeneratePrompt}
      >
        Generate Prompt
      </button>

      {generatedPrompt && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 font-mono whitespace-pre-wrap">
          <h3 className="font-bold mb-2">Generated Prompt</h3>
          <pre>{generatedPrompt}</pre>
        </div>
      )}
    </div>
  );
}