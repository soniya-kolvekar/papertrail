export function validateTemplate(template) {
  const requiredFields = [
    "id",
    "name",
    "type",
    "tone",
    "layout",
    "global_rules",
    "prompt_instruction"
  ];

  for (const field of requiredFields) {
    if (template[field] === undefined || template[field] === null) {
      return { valid: false, message: `${field} is required` };
    }
  }

  // layout must be an array
  if (!Array.isArray(template.layout)) {
    return { valid: false, message: "layout must be an array" };
  }

  // global rules must be array
  if (!Array.isArray(template.global_rules)) {
    return { valid: false, message: "global_rules must be an array" };
  }

  // basic layout sanity check
  for (const section of template.layout) {
    if (!section.id || !section.section_type || !section.content_source) {
      return { valid: false, message: "Invalid section in layout" };
    }
  }

  // prompt safety
  const bannedPhrases = ["ignore all previous", "system override"];
  for (const phrase of bannedPhrases) {
    if (template.prompt_instruction.toLowerCase().includes(phrase)) {
      return { valid: false, message: "Unsafe prompt instruction detected" };
    }
  }

  return { valid: true };
}