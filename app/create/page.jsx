"use client";
import React, { useState } from "react";
import LogoTitle from "./excercises";

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
      ) : null}
    </div>
  );
}

export default CreateLogo;
