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

// --- END: Optimization 2 ---

export async function POST(req: Request) {
  try {
    const { history } = await req.json();

    // --- START: Optimization 3 - Input Validation and Early Exit ---
    if (
      !history ||
      !Array.isArray(history) ||
      history.length === 0 || // Ensure history is not empty
      history[history.length - 1].role !== "user" ||
      !history[history.length - 1].parts?.[0]?.text
    ) {
      return NextResponse.json(
        { error: "Invalid or empty conversation history provided." },
        { status: 400 }
      );
    }
    // --- END: Optimization 3 ---

    const lastMessage = history[history.length - 1];
    const userQueryText = lastMessage.parts[0].text;

    // Check if the query is out of tax scope
    if (!isContextuallyInScope(history, 3, taxKeywords)) {
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
      // --- START: Optimization 4 - Safety Settings (Optional but Recommended) ---
      // Configure safety settings if you want to control harmful content
      // safetySettings: [
      //   {
      //     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      //   },
      //   // Add other categories as needed
      // ],
      // --- END: Optimization 4 ---
    });

    const chat: ChatSession = model.startChat({
      history,
    });

    const result = await chat.sendMessage(userQueryText);
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
      // Provide a more informative error to the user if JSON parsing fails
      return NextResponse.json({
        question: userQueryText,
        answer:
          "Maaf, saya mengalami kesulitan dalam memproses jawaban karena format yang tidak sesuai dari model AI. Silakan coba ajukan pertanyaan dengan format yang lebih jelas atau gunakan kata kunci yang spesifik.",
        examples: [],
        regulations: [],
        references: [], // No references if parsing failed
      });
    }
    // --- END: Optimization 5 ---

    // Extract citations (if any) and merge with model's references
    const citations =
      response.candidates?.[0]?.citationMetadata?.citationSources
        ?.map((source) => source.uri)
        .filter(Boolean) ?? [];

    const finalReferences = [
      ...new Set([...(parsed.references || []), ...citations]), // Use a Set to avoid duplicates
    ];

    return NextResponse.json({
      question: parsed.question,
      answer: parsed.answer,
      examples: parsed.examples,
      regulations: parsed.regulations,
      references: finalReferences,
    });
  } catch (error) {
    console.error("Error in API route:", error); // More generic error logging
    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan internal saat memproses permintaan Anda. Silakan coba lagi nanti.",
      },
      { status: 500 }
    );
  }
}
