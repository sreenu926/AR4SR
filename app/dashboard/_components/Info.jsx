"use client";

import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useContext } from "react";
import PaymentPage from "@/app/create/_components/PaymentPage";

const Info = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [showPaymentPage, setShowPaymentPage] = useState(false);

  const handleCreateNewLogo = () => {
    if (userDetail?.credits <= 0) {
      // Show PaymentPage if credits are insufficient
      setShowPaymentPage(true);
    } else {
      // Redirect to the Create New Logo functionality
      window.location.href = "/create";
    }
  };

  return (
    <div>
      <div className="flex flex-col text-xl gap-4 sm:text-3xl sm:flex-row sm:justify-between items-center">
        <h2 className="font-bold">
          Hello, <span className="text-red-500">{userDetail?.name}</span>
        </h2>
        <div className="flex items-center gap-2">
          <Image
            unoptimized
            src={"/coin.png"}
            alt="coin"
            width={40}
            height={40}
          />
          <h2 className="font-bold">{userDetail?.credits} Credits Left</h2>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 ">
        <h2 className="font-bold text-xl sm:text-2xl">Dashboard</h2>
        <Button onClick={handleCreateNewLogo}>
          {userDetail?.credits <= 0 ? "Buy Credits" : "+ Create New Logo"}
        </Button>
      </div>
      {/* Conditionally Render PaymentPage */}
      {showPaymentPage && (
        <div className="mt-10 md:mx-90">
          <PaymentPage />
        </div>
      )}
    </div>
  );
};

export default Info;
