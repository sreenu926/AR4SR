"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

function Header() {
  const { user } = useUser();

  return (
    <div className="px-10 lg:px-32 xl:px-48 2xl:px-56 p-4 flex justify-between items-center shadow-sm">
      <Link href={"/"}>
        <Image src={"/logo.svg"} alt="logo" width={100} height={0} />
      </Link>

      <div className="flex gap-2">
        {user ? (
          <div className="flex gap-4">
            <SignOutButton>
              <Button className="bg-red-500 mt-5">Log Out</Button>
            </SignOutButton>
          </div>
        ) : (
          <SignInButton>
            <Button className="bg-red-500 mt-5">Sign In</Button>
          </SignInButton>
        )}
        <div className="mt-6">
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default Header;
