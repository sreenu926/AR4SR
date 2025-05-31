"use client";
import React, { useState } from "react";
import LogoTitle from "./_components/exercises";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoColorPallete from "./_components/LogoColorPallete";
import LogoDesigns from "./_components/LogoDesigns";
import LogoIdea from "./_components/LogoIdea";
import PricingModel from "./_components/PricingModel";

function CreateLogo() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState();

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    console.log(formData);
  };

  return (
    <div className="mt-5 md:mt-15 p-4 md:p-8 bg-amber-50 border rounded-xl 2xl:mx-72">
      {step == 1 ? (
        <LogoTitle
          onHandleInputChange={(v) => onHandleInputChange("title", v)}
          formData={formData}
        />
      ) : step == 2 ? (
        <LogoColorPallete
          onHandleInputChange={(v) => onHandleInputChange("palette", v)}
          formData={formData}
        />
      ) : step == 3 ? (
        <LogoDesigns
          onHandleInputChange={(v) => onHandleInputChange("design", v)}
          formData={formData}
        />
      ) : step == 4 ? (
        <LogoIdea
          onHandleInputChange={(v) => onHandleInputChange("idea", v)}
          formData={formData}
        />
      ) : step == 5 ? (
        <PricingModel
          formData={formData}
          onHandleInputChange={(v) => onHandleInputChange("pricing", v)}
        />
      ) : null}

      {/* <div className="flex items-center justify-between mt-10">
        {step != 1 && (
          <div className="border-2 border-white hover:rounded-sm hover:border-black">
            <Button onClick={() => setStep(step - 1)}>
              <div className="flex gap-4 cursor-pointer">
                <ArrowLeft /> <span className="hidden md:inline">Previous</span>
              </div>
            </Button>
          </div>
        )}

        <div className="border-2 border-white hover:rounded-sm hover:border-black">
          <Button onClick={() => setStep(step + 1)} className="bg-red-500">
            <div className="flex gap-4 cursor-pointer">
              <span className="hidden md:inline">Continue</span> <ArrowRight />
            </div>
          </Button>{" "}
        </div>
      </div> */}
    </div>
  );
}

export default CreateLogo;
