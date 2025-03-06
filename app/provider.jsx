"use client";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import axios from "axios";
import { useUser } from "@clerk/nextjs"; // ✅ Import useAuth from Clerk
import { UserDetailContext } from "./_context/UserDetailContext";

function Provider({ children }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState();

  //Save user data
  const CheckUserAuth = async () => {
    console.log("user: ", user);
    //Save User to Database
    const result = await axios.post("/api/users", {
      userName: user?.fullName,
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });
    console.log("result.data: ", result.data);
    setUserDetail(result.data);
  };

  useEffect(() => {
    user && CheckUserAuth();
  }, [user]);

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <Header />
        <div className="px-10 lg:px-32 xl:px-48 2xl:px-56">{children}</div>
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;
