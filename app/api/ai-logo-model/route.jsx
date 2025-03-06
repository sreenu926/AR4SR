import { AILogoPrompt } from "@/configs/AiModel";
import { db } from "@/configs/FirebaseConfig";
import axios from "axios";
import { NextResponse } from "next/server";
import { setDoc, doc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { prompt, email, title, desc } = await req.json();
    let base64ImageWithMime = "";

    // Generate AI Text Prompt for Logo
    const AiPromptResult = await AILogoPrompt.sendMessage(prompt);
    const parsedResult = JSON.parse(AiPromptResult.response.text());
    console.log("Parsed AI Prompt:", parsedResult.prompt);
    const AIPrompt = parsedResult.prompt;
    console.log("Google API Key:", process.env.GOOGLE_GEMINI_API_KEY);

    const BASE_URL = "https://aigurulab.tech";
    const response = await axios.post(
      `${BASE_URL}/api/generate-image`,
      {
        width: 1024,
        height: 1024,
        input: AIPrompt, // "self-portrait of a woman, lightning in the background"
        model: "sdxl", //'flux(sdxl)'
        aspectRatio: "1:1", //Applicable to Flux model only
      },
      {
        headers: {
          "x-api-key": process.env.HUGGING_FACE_API_KEY, // Your API Key
          "Content-Type": "application/json", // Content Type
        },
        responseType: "json",
      }
    );

    console.log("API Response:", response.data);

    if (!response.data.image) {
      throw new Error("Image not found in API response.");
    }

    const base64Image = response.data.image; // Extract Base64 Image
    // base64ImageWithMime = `data:image/png;base64,${base64Image}`;

    //Save to Firebase Database
    await setDoc(doc(db, "users", email, "logos", Date.now().toString()), {
      image: base64Image,
      title: title,
      desc: desc,
    });
    console.log("Logo saved to Firebase");

    return NextResponse.json({ image: base64Image });
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
