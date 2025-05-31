import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";

export async function POST(req) {
  try {
    // Parse the FormData
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read file as Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    // Generate summary (Basic - you can integrate AI for better results)
    const summary = extractedText.slice(0, 500) + "..."; // Taking first 500 characters as a sample summary

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    return NextResponse.json(
      { error: "Failed to analyze PDF" },
      { status: 500 }
    );
  }
}
