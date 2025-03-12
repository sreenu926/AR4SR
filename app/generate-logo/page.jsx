"use client";
import React, { Suspense, useContext, useState, useEffect } from "react";
import { UserDetailContext } from "../_context/UserDetailContext";
import Prompt from "../_data/Prompt";
import axios from "axios";
import Image from "next/image";
import lg from "/public/lg.gif";
import HeadingDescription from "../create/_components/HeadingDescription";
import Lookup from "../_data/Lookup";
import { Download, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const GenerateLogo = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoImage, setLogoImage] = useState();
  const searchParams = useSearchParams();
  const modelType = searchParams.get("type");

  const GenerateAILogo = async () => {
    if (!formData) {
      console.log("formData is null or undefined. Skipping GenerateAILogo.");
      return; // Exit the function if formData is not defined.
    }

    if (modelType != "Free" && userDetail?.credits <= 0) {
      console.log("Not Enough Credits, Please Purchase Some.");
      toast("Not Enough Credits, Please Purchase Some.");
      return;
    }

    setLoading(true);

    //Generate Logo Prompt from AI
    const PROMPT = Prompt.LOGO_PROMPT.replace("{logoTitle}", formData?.title)
      .replace("{logoDesc}", formData?.desc)
      .replace("{logoColor}", formData?.palette)
      .replace("{logoDesign}", formData?.design?.title)
      .replace("{logoPrompt}", formData?.design?.prompt)
      .replace("{logoIdea}", formData?.idea);

    console.log("PROMPT: ", PROMPT);

    try {
      //Generate Logo Image
      const result = await axios.post("/api/ai-logo-model", {
        prompt: PROMPT,
        email: userDetail?.email,
        title: formData.title,
        desc: formData.desc,
        type: modelType,
        userCredits: userDetail?.credits,
      });
      console.log("result?.data?.image ", result?.data?.image);
      setLogoImage(result.data?.image);
      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  // Image Download Code
  const handleImgDownload = (imageSrc) => {
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "AiImage.webp"; // File name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (formData) {
      GenerateAILogo();
    }
  }, [formData]);

  useEffect(() => {
    if (typeof window !== undefined && userDetail?.email) {
      const storage = localStorage.getItem("formData");
      if (storage) {
        setFormData(JSON.parse(storage));
        console.log(JSON.parse(storage));
      }
    }
  }, [userDetail]);

  return (
    <div className="font-bold">
      {loading && (
        <div className="mt-12 flex flex-col rounded-full items-center justify-center gap-4">
          <HeadingDescription
            title={Lookup.LoadingWaitTitle}
            description={Lookup.LoadingWaitDesc}
          />
          {loading && (
            <Image
              className="ml-10 mt-5"
              src={lg}
              alt="logo"
              width={200}
              height={200}
              unoptimized
            />
          )}
        </div>
      )}
      <div className="flex flex-col mt-10 items-center">
        {!loading && (
          <p className="text-red-600 text-2xl">Your logo is ready</p>
        )}
        {!loading && logoImage && (
          <Image
            unoptimized
            src={logoImage}
            alt="logo"
            width={512}
            height={512}
            className="rounded-lg mt-10"
          />
        )}
      </div>
      <div>
        {!loading && (
          <div className="flex justify-center items-center mt-9 gap-8">
            <button
              onClick={() =>
                handleImgDownload(logoImage ? logoImage : "/design_1.webp")
              }
              className="flex items-center gap-2 bg-purple-500 cursor-pointer text-white shadow-xl p-2 px-1.5 rounded-lg text-base"
            >
              <Download />
              Download
            </button>

            <Link
              className="flex items-center gap-2 border rounded-lg shadow-xl border-[#e5e7eb] p-2 px-1.5 text-base"
              href={"/dashboard"}
            >
              <LayoutDashboard />
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap the component in a Suspense boundary
export default function GenerateLogoWrapper() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <GenerateLogo />
    </Suspense>
  );
}
