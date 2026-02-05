/**
 * Utility to analyze content and extract key metadata
 */
export const buildAnalysisPrompt = (content) => {
    return `
Analyze the following user content and extract key metadata for social media caption generation.

User Content:
"${content}"

Return ONLY a JSON object with the following fields:
- "topics": Array of 3-5 key topics or keywords.
- "highlights": Array of 2-3 most important phrases/points.
- "intent": The primary goal (informational, promotional, conversational, inspirational, etc.).
- "contentType": The nature of the content (blog post summary, personal story, product announcement, etc.).

JSON Output:
`;
};

export const parseAnalysis = (text) => {
    try {
        // Attempt to extract JSON from the text if LLM includes extra text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(text);
    } catch (error) {
        console.error("Failed to parse analysis JSON:", error);
        return {
            topics: [],
            highlights: [],
            intent: "general",
            contentType: "social post"
        };
    }
};
