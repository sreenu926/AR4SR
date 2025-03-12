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
    <div className="my-4">
      <HeadingDescription
        title={Lookup.LogoPricingModelTitle}
        description={Lookup.LogoPricingModelDesc}
      />

      <div className="grid grid-cols-2 gap-10">
        {Lookup.pricingOption.map((pricing, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-5 border rounded-xl mt-5"
          >
            <Image
              src={pricing.icon}
              alt={pricing.title}
              width={60}
              height={60}
            />

            <h2 className="font-medium text-2xl">{pricing.title}</h2>

            <div>
              {pricing.features.map((feature, index) => (
                <h2 key={index} className="text-lg mt-3">
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
                  <Button className="bg-red-500 mt-5">{pricing.button}</Button>
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
