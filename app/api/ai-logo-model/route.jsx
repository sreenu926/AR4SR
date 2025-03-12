import { AILogoPrompt } from "@/configs/AiModel";
import { db } from "@/configs/FirebaseConfig";
import axios from "axios";
import { NextResponse } from "next/server";
import { updateDoc, setDoc, doc } from "firebase/firestore";
import Replicate from "replicate";

import { getStorage } from "firebase/storage";
const storage = getStorage();

export async function POST(req) {
  try {
    const { prompt, email, title, desc, type, userCredits } = await req.json();
    if (!type) {
      throw new Error("Missing 'type' in request body.");
    }
    let imageUrl = "";

    // Generate AI Text Prompt for Logo
    const AiPromptResult = await AILogoPrompt.sendMessage(prompt);
    const parsedResult = JSON.parse(AiPromptResult.response.text());
    console.log("Parsed AI Prompt:", parsedResult.prompt);
    const AIPrompt = parsedResult.prompt;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    if (type == "Free") {
      const BASE_URL = "https://aigurulab.tech";
      const response = await axios.post(
        `${BASE_URL}/api/generate-image`,
        {
          width: 1024,
          height: 1024,
          input: AIPrompt,
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

      imageUrl = response.data.image; // Extract Base64 Image
    } else {
      // Replicate API End Point
      const response = await replicate.run(
        "bytedance/hyper-flux-8step:81946b1e09b256c543b35f37333a30d0d02ee2cd8c4f77cd915873a1ca622bad",
        {
          input: {
            prompt: AIPrompt,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "webp",
            guidance_scale: 3.5,
            output_quality: 80,
            num_inference_steps: 8,
          },
        }
      );
      console.log("Replicate API Output:", response);
      imageUrl = await ConvertImageToBase64(response);

      const docRef = doc(db, "users", email);
      await updateDoc(docRef, {
        credits: Number(userCredits) - 1,
      });
    }

    //Save to Firebase Database
    await setDoc(doc(db, "users", email, "logos", Date.now().toString()), {
      image: imageUrl,
      title: title,
      desc: desc,
    });
    console.log("Logo saved to Firebase");

    return NextResponse.json({ image: imageUrl });
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: e.message || "API Error" },
      { status: 500 }
    );
  }
  async function ConvertImageToBase64(image) {
    try {
      const resp = await axios.get(image, { responseType: "arraybuffer" });
      const base64ImageRaw = Buffer.from(resp.data).toString("base64");
      return `data:image/webp;base64,${base64ImageRaw}`;
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      throw error; // Re-throw the error to be caught by the main try-catch block
    }
  }
}
