"use client";

import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";

const Info = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  return (
    <div>
      <div className="flex flex-col text-xl gap-4 sm:text-3xl sm:flex-row sm:justify-between items-center">
        <h2 className="font-bold">
          Hello, <span className="text-red-500">{userDetail?.name}</span>
        </h2>
        <div className="flex items-center gap-2">
          <Image src={"/coin.png"} alt="coin" width={40} height={40} />
          <h2 className="font-bold">{userDetail?.credits} Credits Left</h2>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 ">
        <h2 className="font-bold text-xl sm:text-2xl">Dashboard</h2>
        <Link className="curson-pointer w-27 sm:w-45 " href={"/create"}>
          <Button>+ Create New Logo</Button>
        </Link>
      </div>
    </div>
  );
};

export default Info;
