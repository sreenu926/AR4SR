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
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-red-500 text-3xl">
          Hello, {userDetail?.name}
        </h2>
      </div>

      <div className="flex justify-between items-center mt-6 ">
        <h2 className="font-bold text-2xl">Dashboard</h2>
        <Link className="curson-pointer" href={"/create"}>
          <Button>+ Create New logo</Button>
        </Link>
      </div>
    </div>
  );
};

export default Info;
