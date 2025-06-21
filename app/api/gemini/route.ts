// app/api/gemini/route.ts
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import { systemInstruction } from "@/constants/instructions";
import { isContextuallyInScope } from "@/lib/match";
import { taxKeywords } from "@/constants/keywords";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const historyJson = formData.get("history") as string;
    const imageFile = formData.get("image") as File | null;

    const history = JSON.parse(historyJson);
    // --- START: Input Validation ---
    if (
      !history ||
      !Array.isArray(history) ||
      history.length === 0 ||
      history[history.length - 1].role !== "user" ||
      (!history[history.length - 1].parts?.[0]?.text && !imageFile) // Ensure either text or image is present
    ) {
      return NextResponse.json(
        {
          error: "Invalid or empty conversation history or no image provided.",
        },
        { status: 400 }
      );
    }
    // --- END: Input Validation ---

    const lastMessage = history[history.length - 1];
    let userQueryText = lastMessage.parts[0]?.text || ""; // Initialize, might be empty if only image

    let visionInputParts: Array<any> = [];

    // --- START: Image Processing ---
    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const mimeType = imageFile.type || "image/jpeg";
      const base64Image = imageBuffer.toString("base64");

      visionInputParts.push({
        inlineData: {
          data: base64Image,
          mimeType,
        },
      });

      if (!userQueryText) {
        userQueryText =
          "Please analyze this image for any tax-related information, such as invoices, receipts, or financial statements, and explain its correlation with Indonesian tax regulations.";
      } else {
        userQueryText = `Based on this image and my question: "${userQueryText}", please provide tax-related insights.`;
      }
    }
    // --- END: Image Processing ---

    // Check if the query (now potentially enriched by image data) is out of tax scope
    // This `isContextuallyInScope` might need refinement to consider image content too.
    if (!isContextuallyInScope(history, 3, taxKeywords) && !imageFile) {
      // Only block if no image and out of scope
      return NextResponse.json({
        question: userQueryText,
        answer:
          "Maaf, saya hanya dapat membantu pertanyaan seputar pajak Indonesia.",
        examples: [],
        regulations: [],
        references: [],
      });
    }

    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    // Prepare content for Gemini, combining text and image parts
    const chatHistoryWithVision = history.map((message: any) => {
      if (message.role === "user" && message === lastMessage) {
        return {
          role: "user",
          parts: [
            { text: userQueryText },
            ...visionInputParts, // Add image data here
          ],
        };
      }
      return message;
    });

    const chat: ChatSession = model.startChat({
      history: chatHistoryWithVision,
    });

    const result = await chat.sendMessage(userQueryText); // You might send a more refined prompt here for image analysis
    const response = await result.response;
    let text = response.text();

    console.log("Raw text from model:", text);

    let cleanText = text.trim();

    // Remove markdown code block fences if present
    const jsonCodeBlockRegexStart = /^```json\s*/;
    const jsonCodeBlockRegexEnd = /\s*```$/;

    if (jsonCodeBlockRegexStart.test(cleanText)) {
      cleanText = cleanText.replace(jsonCodeBlockRegexStart, "");
    }
    if (jsonCodeBlockRegexEnd.test(cleanText)) {
      cleanText = cleanText.replace(jsonCodeBlockRegexEnd, "");
    }
    cleanText = cleanText.trim(); // Trim again after removal

    console.log("Cleaned text for JSON parsing:", cleanText);

    let parsed: any;
    try {
      parsed = JSON.parse(cleanText);

      // Validate parsed JSON structure more strictly
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("answer" in parsed) ||
        typeof parsed.answer !== "string" ||
        !("examples" in parsed) ||
        !Array.isArray(parsed.examples) ||
        !("regulations" in parsed) ||
        !Array.isArray(parsed.regulations) ||
        !("references" in parsed) ||
        !Array.isArray(parsed.references)
      ) {
        throw new Error("Invalid JSON structure received from model.");
      }
    } catch (err) {
      console.error("JSON parsing error:", err);
      console.error("Failed JSON text:", cleanText);
      return NextResponse.json({
        answer:
          "Maaf, saya mengalami kesulitan dalam memproses jawaban karena format yang tidak sesuai dari model AI. Silakan coba ajukan pertanyaan dengan format yang lebih jelas atau gunakan kata kunci yang spesifik.",
        examples: [],
        regulations: [],
        references: [],
      });
    }

    // Extract citations (if any) and merge with model's references
    const citations =
      response.candidates?.[0]?.citationMetadata?.citationSources
        ?.map((source) => source.uri)
        .filter(Boolean) ?? [];

    const finalReferences = [
      ...new Set([...(parsed.references || []), ...citations]),
    ];

    return NextResponse.json({
      answer: parsed.answer,
      examples: parsed.examples,
      regulations: parsed.regulations,
      references: finalReferences,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({
      answer:
        "Maaf, saya mengalami kesulitan dalam memproses jawaban karena format yang tidak sesuai dari model AI. Silakan coba ajukan pertanyaan dengan format yang lebih jelas atau gunakan kata kunci yang spesifik.",
      examples: [],
      regulations: [],
      references: [],
    });
  }
}
