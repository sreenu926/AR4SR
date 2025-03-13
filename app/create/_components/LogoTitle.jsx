// "use client";
// import React, { useState } from "react";
// import HeadingDescription from "./HeadingDescription";
// import Lookup from "@/app/_data/Lookup";
// import { useSearchParams } from "next/navigation";

// function LogoTitle({ onHandleInputChange, formData }) {
//   const searchParam = useSearchParams();
//   const [title, setTitle] = useState(searchParam?.get("title") ?? "");
//   return (
//     <div className="my-10">
//       <HeadingDescription
//         title={Lookup?.LogoTitle}
//         description={Lookup.LogoTitleDesc}
//       />
//       <input
//         type="text"
//         placeholder={Lookup.InputTitlePlaceholder}
//         className="p-4 border rounded-lg mt-5 w-full"
//         value={formData?.title || ""}
//         onChange={(e) => onHandleInputChange(e.target.value)}
//       />
//     </div>
//   );
// }

// export default LogoTitle;

"use client";
import React, { useState, Suspense } from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import { useSearchParams } from "next/navigation";

function LogoTitle({ onHandleInputChange, formData }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogoTitleContent
        onHandleInputChange={onHandleInputChange}
        formData={formData}
      />
    </Suspense>
  );
}

function LogoTitleContent({ onHandleInputChange, formData }) {
  const searchParam = useSearchParams();
  const [title, setTitle] = useState(searchParam?.get("title") ?? "");

  return (
    <div className="my-0">
      <div className="mb-5">
        <HeadingDescription
          title={Lookup?.LogoTitle}
          description={Lookup.LogoTitleDesc}
        />
      </div>
      <input
        type="text"
        placeholder={Lookup.InputTitlePlaceholder}
        className="p-4 border text-center rounded-lg mt-5 w-full"
        value={formData?.title || ""}
        onChange={(e) => onHandleInputChange(e.target.value)}
      />
    </div>
  );
}

export default LogoTitle;
