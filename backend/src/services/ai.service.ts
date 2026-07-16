import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../utils/prompt.js";
import { chunkArray } from "../utils/batch.util.js";
import { CRMRecord } from "../types/crm.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});


function getIndianDateTime(): string {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value || "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}
/**
 * Calls Gemini API with retry mechanism
 */
async function generateWithRetry(
  prompt: string,
  retries: number = 3
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0,
        },
      });

      return response.text ?? "";
    } catch (error) {
      console.error(`Gemini request failed (Attempt ${attempt}/${retries})`);

      if (attempt === retries) {
        throw error;
      }

      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return "";
}

/**
 * Extract CRM Records from CSV rows
 */
export async function extractCRMRecords(
  records: Record<string, string>[]
): Promise<CRMRecord[]> {
  // Split records into batches of 20
  const batches = chunkArray(records, 20);

  const finalResult: CRMRecord[] = [];

  for (const batch of batches) {
    const prompt = `
${SYSTEM_PROMPT}

CSV Records:
${JSON.stringify(batch, null, 2)}
`;

    try {
      const text = await generateWithRetry(prompt);

      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Debug logs
      console.log("========== PROMPT ==========");
      console.log(prompt);

      console.log("========== GEMINI RESPONSE ==========");
      console.log(cleaned);
      console.log("============================");

      let parsed: unknown;

      try {
        parsed = JSON.parse(cleaned);
      } catch {
        console.error("Gemini returned invalid JSON");
        continue;
      }

      if (Array.isArray(parsed)) {
        const records = (parsed as CRMRecord[]).map((record) => ({
          ...record,
          created_at: getIndianDateTime()
        }));

        finalResult.push(...records);
      } else {
        console.error("Gemini response is not an array");
      }
    } catch (error) {
      console.error("Batch processing failed:", error);
    }
  }

  return finalResult;
}