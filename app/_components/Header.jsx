"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";

function Header() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  return (
    <div className="px-10 lg:px-32 xl:px-48 2xl:px-56 p-4 flex justify-between items-center shadow-sm">
      <Link href={"/"}>
        <Image src={"/logo.svg"} alt="logo" width={100} height={0} />
      </Link>

      {/* <div className="flex gap-2">
        {user ? (
          <div className="my-auto mr-2 mt-4 rounded">
            <SignOutButton>
              <Button className="bg-red-500 mt-5 ">Log Out</Button>
            </SignOutButton>
          </div>
        ) : (
          <SignInButton>
            <Button className="bg-red-500 mt-5">Sign In</Button>
          </SignInButton>
        )}
        <div className="mt-6">
          <UserButton signOutOptions={{ redirectUrl: "/" }} />
        </div>
      </div> */}

      <ul className="hidden rounded text-black px-2 py-1 md:flex items-center gap-4">
        {user ? (
          <>
            {/* Dashboard Button */}
            <button
              className="flex border-2 border-gray-500 p-2 rounded-lg bg-sky-500 text-white items-center gap-2 hover:bg-black cursor-pointer transition"
              onClick={() => router.push("/dashboard")}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>

            {/* Clerk UserButton */}
            <UserButton signOutOptions={{ redirectUrl: "/" }} />
          </>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 border-2 border-gray-500 bg-sky-500 p-2 rounded-lg cursor-pointer hover:text-white hover:bg-black transition"
          >
            <Image
              className="rounded-full"
              src={"/user_icon.png"}
              width={32}
              height={32}
              alt="user icon"
            />
            <span>Account</span>
          </button>
        )}
      </ul>
    </div>
  );
}

export default Header;
