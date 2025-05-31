"use client";
import React, { useState } from "react";
import Lookup from "../_data/Lookup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

function Hero() {
  // const [logoTitle, setLogoTitle] = useState();
  const logoTitle = "exercises";
  return (
    <div className="bg-amber-50 rounded-2xl p-5 flex items-center mt-6 md:mt-12 flex-col gap-4 md:gap-8">
      <h2 className="text-red-600 text-3xl md:text-6xl font-bold">
        {Lookup.HeroHeading}
      </h2>
      <h2 className="text-xl text-center md:text-4xl font-bold">
        {Lookup.HeroSubheading}
      </h2>
      <p className="text-sm md:text-lg text-center text-gray-500">
        {Lookup.HeroDesc}
      </p>

      <div className="flex gap-6 w-full justify-center max-w-2xl">
        <Link
          className="border-2 border-white hover:border-black hover:rounded-sm"
          href={"/create?title=" + logoTitle}
        >
          <Button className="bg-red-500 p-6 ">Get Started</Button>
        </Link>
      </div>
      <div className="flex w-[100px] md:w-[250px] justify-center gap-4">
        <Image
          unoptimized
          src={"/AR4SR-1.png"}
          alt="synaptra"
          width={250}
          height={200}
          className="rounded-lg border-2 border-gray-200"
        />
        <Image
          unoptimized
          src={"/AR4SR-2.png"}
          alt="synaptra"
          width={250}
          height={200}
          className="rounded-lg border-2 border-gray-200"
        />
      </div>
    </div>
  );
}

export default Hero;
