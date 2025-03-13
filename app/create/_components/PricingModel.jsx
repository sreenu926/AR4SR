"use client";
import React, { useEffect } from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

function PricingModel({ formData }) {
  const { user } = useUser();

  useEffect(() => {
    if (formData?.title && typeof window !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  return (
    <div className="my-0">
      <HeadingDescription
        title={Lookup.LogoPricingModelTitle}
        description={Lookup.LogoPricingModelDesc}
      />

      <div className="grid grid-col-1 md:grid-cols-2 gap-2 md:gap-10">
        {Lookup.pricingOption.map((pricing, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-5 border rounded-xl mt-0"
          >
            <div className="flex flex-row gap-2 md:flex-col">
              <div className="w-[30px] md:w-[60px]">
                <Image
                  src={pricing.icon}
                  alt={pricing.title}
                  width={60}
                  height={60}
                  unoptimized
                />
              </div>
              <h2 className="font-medium text-center text-lg md:text-2xl">
                {pricing.title}
              </h2>
            </div>

            <div>
              {pricing.features.map((feature, index) => (
                <h2 key={index} className="text-sm md:text-lg mt-3">
                  {feature}
                </h2>
              ))}
            </div>

            {user ? (
              <div className="flex gap-4 mt-4">
                <Link
                  href={`/generate-logo?type=${encodeURIComponent(
                    pricing.title
                  )}`}
                >
                  <Button className="bg-red-500 mt-5">
                    <span className="text-xs md:text-sm">{pricing.button}</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <SignInButton
                mode="modal"
                forceRedirectUrl={`/generate-logo?type=${encodeURIComponent(
                  pricing.title
                )}`}
              >
                <Button className="bg-red-500 mt-5">Sign In</Button>
              </SignInButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingModel;
