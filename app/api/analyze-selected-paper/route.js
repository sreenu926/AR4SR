// /api/analyze-selected-paper/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { paper } = await req.json();

    if (!paper || !paper.abstract) {
      return NextResponse.json(
        { error: "Invalid paper data" },
        { status: 400 }
      );
    }

    console.log("Paper title:", paper.title); // Log title
    console.log("Paper URL:", paper.url); // Log URL

    const summary = await summarizeWithGemini(paper.abstract);

    return NextResponse.json(
      { summary, title: paper.title, url: paper.url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing selected paper:", error);
    return NextResponse.json(
      { error: "Failed to analyze paper" },
      { status: 500 }
    );
  }
}

async function summarizeWithGemini(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const response = await model.generateContent(
      `Summarize this research paper: ${text}`
    );
    return response.response.text();
  } catch (error) {
    console.error("Gemini summarization error:", error);
    return "Error generating summary.";
  }
}
