import React from "react";

function HeadingDescription({ title, description }) {
  return (
    <div>
      <h2 className="font-bold text-3xl text-red-600 ">{title}</h2>
      <p className="text-lg text-gray-500 mt-2">{description}</p>
    </div>
  );
}

export default HeadingDescription;
