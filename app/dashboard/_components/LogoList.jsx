"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { db } from "@/configs/FirebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { Share2, X, Download, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
        logos.push({ id: doc.id, ...doc.data() });
      });
      setLogoList(logos.reverse());
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

  const downloadImage = (image, title) => {
    if (typeof window === "undefined") return;
    console.log("image.title: ", title);
    const link = document.createElement("a");
    link.href = image;
    link.download = `${title}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete Logo from Firestore
  const deleteLogo = async (logoId) => {
    if (!userDetail?.email || !logoId) return;

    try {
      await deleteDoc(doc(db, "users", userDetail.email, "logos", logoId));
      setLogoList((prevLogos) =>
        prevLogos.filter((logo) => logo.id !== logoId)
      );
      console.log("Logo deleted successfully");
    } catch (error) {
      console.error("Error deleting logo:", error);
    }
  };

  const ViewLogo = (image, title) => {
    const imageWindow = window.open("", "_blank");
    if (imageWindow) {
      const img = document.createElement("img");
      img.src = image; // Use the passed `image` parameter
      img.alt = "Logo Image";
      img.style.maxWidth = "90%"; // Ensure it fits the window
      img.style.height = "90%";
      img.style.borderRadius = "10%";
      img.style.cursor = "pointer";

      // Image click event to download
      img.onclick = () => {
        const link = document.createElement("a");
        link.href = image;
        link.download = `${title}.webp`; // Default name as 'logo.png'
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      imageWindow.document.body.style.margin = "0"; // Remove margins
      imageWindow.document.body.style.display = "flex";
      imageWindow.document.body.style.justifyContent = "center";
      imageWindow.document.body.style.alignItems = "center";
      imageWindow.document.body.style.height = "100vh";
      imageWindow.document.body.appendChild(img);
    }
  };

  return (
    <div className="my-10">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {logoList.length > 0
          ? logoList.map((logo) => (
              <div
                key={logo.id}
                className="hover:scale-105 transition-all cursor-pointer p-2 shadow-xl rounded-xl relative group"
              >
                {/* Delete Icon (Visible on Hover) */}
                <Trash
                  onClick={() => deleteLogo(logo.id)}
                  className="absolute top-3 left-3 w-8 h-8 p-1 bg-white text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                />

                <Share2
                  onClick={() => {
                    setSelectedLogo(logo);
                    setIsDialogOpen(true);
                  }}
                  className="opacity-0 bg-white text-black rounded-full m-1 group-hover:opacity-100 cursor-pointer right-2 top-2 absolute"
                  width={30}
                  height={30}
                  strokeWidth={1}
                />

                <Image
                  onClick={() => {
                    ViewLogo(logo?.image, logo?.title);
                  }}
                  className="w-full rounded-lg"
                  src={logo.image || "/loading.gif"}
                  alt={logo.title || "Untitled"}
                  width={400}
                  height={200}
                />
                <h2 className="text-center text-sm font-medium mt-2 line-clamp-1 hover:line-clamp-4">
                  {logo.title || "No Title"}
                </h2>
                <p className="text-xs text-gray-500 text-center line-clamp-2 hover:line-clamp-8">
                  {logo.desc || "No Description Available"}
                </p>
              </div>
            ))
          : // Skeleton Effect for loading state
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <div
                key={item}
                className="bg-slate-200 animate-pulse rounded-xl w-full h-[200px]"
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
                    downloadImage(selectedLogo.image || "/loading.gif", title)
                  }
                  className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full cursor-pointer flex items-center justify-center p-2 hover:border hover:border-gray-500"
                  color="#DE3163"
                />
              </div>
            )}
          </div>

          {/* Social Share Buttons */}
          <div className="flex justify-center items-center gap-4 mt-1">
            {selectedLogo && getShareLinks(selectedLogo) && (
              <>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${selectedLogo.image}`}
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
                  href={`https://x.com/intent/tweet?url=${selectedLogo.image}`}
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
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${selectedLogo.image}`}
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
                  href={`https://api.whatsapp.com/send?text=${selectedLogo.image}`}
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
