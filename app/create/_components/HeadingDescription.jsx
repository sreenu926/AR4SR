import React from "react";

function HeadingDescription({ title, description }) {
  return (
    <div>
      <h2 className="font-bold text-center text-xl md:text-3xl text-red-600 mb-4 md:mb-10 ">
        {title}
      </h2>
      <p className="text-md md:text-lg text-center text-gray-500 mb-4 md:mb-10">
        {description}
      </p>
    </div>
  );
}

export default HeadingDescription;
