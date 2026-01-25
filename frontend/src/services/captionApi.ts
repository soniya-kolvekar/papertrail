export type CaptionRequest = {
  platform: string;
  tone: string;
  content: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function generateCaption(payload: CaptionRequest): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/captions/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  try {
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Caption generation failed");
    }

    return data.caption;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    // Fallback for non-JSON errors or network failures
    throw new Error("Failed to connect to caption service");
  }
}
