"use client";
import React, { useState } from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import LogoDesig from "@/app/_data/LogoDesig";
import Image from "next/image";

function LogoDesigns({ onHandleInputChange, formData }) {
  const [selectedOption, setSelectedOption] = useState(formData?.design?.title);

  return (
    <div className="my-2">
      <HeadingDescription
        title={Lookup.LogoDesignTitle}
        description={Lookup.LogoDesignDesc}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
        {LogoDesig.map((design, index) => (
          <div
            key={index}
            className={`p-1 hover:border-2 border-red-500 text-center font-bold rounded-xl cursor-pointer ${
              selectedOption === design.title &&
              "border-2 rounded-xl border-red-500"
            }`}
            onClick={() => {
              setSelectedOption(design.title), onHandleInputChange(design);
            }}
          >
            <Image
              className="w-full rounded-xl h-[100px] object-cover"
              src={design.image}
              alt={design.title}
              width={100}
              height={100}
              unoptimized
            />
            <p>{design.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoDesigns;
