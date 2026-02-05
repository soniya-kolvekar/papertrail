export type TemplateType =
  | "letter"
  | "report"
  | "essay"
  | "caption"
  | "email"
  | "resume"
  | "custom";

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  tone: string;
  layout: TemplateSection[];
  global_rules: string[];
  prompt_instruction: string;
  is_system_template?: boolean;
}


export interface TemplateSection {
  id: string;
  label: string;                // Heading, Date, Title, Body, Conclusion
  order: number;                // Word-like top to bottom order

  section_type:
    | "heading"
    | "date"
    | "title"
    | "body"
    | "paragraph"
    | "bullet"
    | "signature";

  content_source:
    | "user_input"
    | "ai_generated"
    | "static";

  placeholder?: string;         // UI hint
  required?: boolean;

  user_customizable?: boolean;

  rules?: string[];             // AI constraints for this section
}