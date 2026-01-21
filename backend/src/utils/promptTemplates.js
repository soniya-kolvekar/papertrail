export const buildPrompt = ({ platform, tone, content }) => {
  // Validate and normalize inputs
  const safePlatform = (platform || "Social Media").toLowerCase();
  const safeTone = (tone || "neutral").toLowerCase();

  // Basic content sanitization to prevent prompt injection
  const safeContent = content.replace(/[\${}]/g, "");

  const lengthInstruction = safePlatform === 'linkedin'
    ? '- Long-form, professional, and storytelling style'
    : '- Platform appropriate length';

  return `
You are an expert social media copywriter.

Generate a ${safeTone} caption for ${safePlatform}.

Rules:
${lengthInstruction}
- STRICTLY NO EMOJIS (unless explicitly requested)
- Clear and engaging
- No hashtags unless platform supports it
- Output ONLY the caption text

User content:
"${safeContent}"
`;
};
