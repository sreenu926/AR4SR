"use client";
import React, { useState } from "react";
import Lookup from "../_data/Lookup";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Hero() {
  const [logoTitle, setLogoTitle] = useState();
  return (
    <div className="flex items-center mt-32 flex-col gap-15">
      <h2 className="text-pink-600 text-6xl font-bold">{Lookup.HeroHeading}</h2>
      <h2 className="text-4xl font-bold">{Lookup.HeroSubheading}</h2>
      <p className="text-lg text-gray-500">{Lookup.HeroDesc}</p>

      <div className="flex gap-6 w-full justify-center max-w-2xl">
        {/* <input
          className="p-3 border rounded-md w-3/4 shadow-md"
          type="text"
          placeholder={Lookup.InputTitlePlaceholder}
          onChange={(event) => setLogoTitle(event?.target.value)}
        /> */}
        <Link
          className="border-2 border-white hover:border-black hover:rounded-sm"
          href={"/create?title=" + logoTitle}
        >
          <Button className="bg-red-500 p-6 ">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
