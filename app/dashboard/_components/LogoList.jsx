"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { db } from "@/configs/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Share2, X, Download } from "lucide-react";

import FacebookIcon from "../../../public/facebook.svg";
import WhatsappIcon from "../../../public/whatsapp.svg";
import LinkedinIcon from "../../../public/linkedin.svg";
import TwitterIcon from "../../../public/twitter.svg";

const LogoList = () => {
  const { userDetail } = useContext(UserDetailContext);
  const [logoList, setLogoList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);

  useEffect(() => {
    if (userDetail?.email) {
      GetUserLogos();
    }
  }, [userDetail]);

  // Get data from the Firestore DB
  const GetUserLogos = async () => {
    if (!userDetail?.email) {
      console.log("userDetail is missing");
      return;
    }

    try {
      console.log("Fetching logos for user:", userDetail.email);
      const querySnapshot = await getDocs(
        collection(db, "users", userDetail.email, "logos")
      );

      if (querySnapshot.empty) {
        console.warn("No logos found in Firestore.");
      }

      const logos = [];
      querySnapshot.forEach((doc) => {
        // Include the document ID with the logo data
        logos.push({ id: doc.id, ...doc.data() });
      });

      console.log("Fetched logos:", logos);
      setLogoList(logos);
    } catch (error) {
      console.error("Error fetching logos:", error);
    }
  };

  // Share on Social Media function
  const shareOnSocials = (logo) => {
    setSelectedLogo(logo);
    setIsDialogOpen(true);
  };

  const getShareLinks = (logo) => {
    if (!logo || !logo.id) return null;

    // Get the base URL of your website
    const baseURL = typeof window !== "undefined" ? window.location.origin : "";
    // Construct the share URL using the logo ID
    const shareURL = `${baseURL}/share/${logo.id}`;

    // Prepare share text
    const title = encodeURIComponent(logo.title || "Check out this logo!");
    const description = encodeURIComponent(
      logo.desc || "Look at this amazing logo!"
    );

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareURL
      )}&quote=${description}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}%0A${description}%0A${encodeURIComponent(
        shareURL
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareURL
      )}&summary=${description}`,
      whatsapp: `https://api.whatsapp.com/send?text=${title}%0A${description}%0A${encodeURIComponent(
        shareURL
      )}`,
    };
  };

  const downloadImage = (image) => {
    if (typeof window === "undefined") return;

    const link = document.createElement("a");
    link.href = image;
    link.download = "AiImage.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {logoList.length > 0
          ? logoList.map((logo) => (
              <div
                key={logo.id}
                className="hover:scale-105 cursor-pointer transition-all border-2 p-2 border-gray-500 shadow-xl rounded-xl relative"
              >
                <Share2
                  onClick={() => shareOnSocials(logo)}
                  className="cursor-pointer right-2 absolute"
                  width={35}
                  height={35}
                  strokeWidth={1}
                />
                <Image
                  className="w-full rounded-full"
                  src={logo.image || "/loading.gif"}
                  alt={logo.title || "Untitled"}
                  width={400}
                  height={200}
                />
                <h2 className="text-center text-lg font-medium mt-2">
                  {logo.title || "No Title"}
                </h2>
                <p className="text-sm text-gray-500 text-center">
                  {logo.desc || "No Description Available"}
                </p>
              </div>
            ))
          : // Skeleton Effect for loading state
            [1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-slate-200 animate-pulse rounded-xl w-full h-48"
              ></div>
            ))}
      </div>

      {/* Alert Dialog with share buttons */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-between">
              <AlertDialogTitle>Share this logo</AlertDialogTitle>
              <AlertDialogCancel>
                <X />
              </AlertDialogCancel>
            </div>
            <AlertDialogDescription>
              Click an icon below to share.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center gap-2 justify-center">
            {selectedLogo && (
              <div className="relative inline-block">
                <Image
                  src={selectedLogo.image || "/loading.gif"}
                  alt="Selected Logo"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <Download
                  onClick={() =>
                    downloadImage(selectedLogo.image || "/loading.gif")
                  }
                  className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full cursor-pointer flex items-center justify-center p-2 hover:border hover:border-gray-500"
                  color="#DE3163"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-4 mt-1">
            {selectedLogo && getShareLinks(selectedLogo) && (
              <>
                <a
                  href={getShareLinks(selectedLogo).facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={FacebookIcon}
                    width={40}
                    height={40}
                    className="hover:scale-110 transition"
                    alt="Facebook"
                    priority
                  />
                </a>
                <a
                  href={getShareLinks(selectedLogo).twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={TwitterIcon}
                    width={40}
                    height={40}
                    className="hover:scale-110 transition"
                    alt="Twitter"
                    priority
                  />
                </a>
                <a
                  href={getShareLinks(selectedLogo).linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={LinkedinIcon}
                    width={40}
                    height={40}
                    className="hover:scale-110 transition"
                    alt="LinkedIn"
                    priority
                  />
                </a>
                <a
                  href={getShareLinks(selectedLogo).whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={WhatsappIcon}
                    width={40}
                    height={40}
                    className="hover:scale-110 transition"
                    alt="WhatsApp"
                    priority
                  />
                </a>
              </>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LogoList;
