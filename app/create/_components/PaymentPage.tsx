"use client";

import React, { useState, useContext } from "react";
import { UserDetailContext } from "../../_context/UserDetailContext";
import Script from "next/script";
import { db } from "@/configs/FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = ({ onPaymentSuccess }) => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const AMOUNT = 100; // Fixed amount in INR (1 INR = 1 credit)
  const CREDITS_PER_INR = 1; // Conversion rate for INR to credits
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // **Create Razorpay Order on the Backend**
      const response = await fetch("/api/create-order", { method: "POST" });
      const data = await response.json();

      //Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMOUNT * 100,
        currency: "INR",
        name: "AI LOGO GENERATOR",
        description: "Purchase Credits",
        order_id: data.orderId,
        handler: async function (response: any) {
          console.log("Payment Successful", response);
          // **Update User Credits After Successful Payment**
          try {
            const purchasedCredits = AMOUNT * CREDITS_PER_INR; // Calculate credits based on payment
            // Reference to the user's document in Firebase
            const docRef = doc(db, "users", userDetail?.email);
            // Update the user's credits in the Firebase database
            await updateDoc(docRef, {
              credits: Number(userDetail?.credits || 0) + purchasedCredits, // Increment credits
            });

            // Notify parent component of successful payment
            onPaymentSuccess(purchasedCredits);

            alert(
              `Payment successful! ${purchasedCredits} credits have been added to your account.`
            );
          } catch (dbError) {
            console.error("Error updating credits in Firebase:", dbError);
            alert(
              "Payment successful, but there was an issue updating your credits. Please contact support."
            );
          }
        },

        prefill: {
          name: userDetail?.name || "John Doe",
          email: userDetail?.email || "johndoe@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment failed", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[300px] h-[250px] bg-gray-100">
      {/* Razorpay script is loaded here */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
        <p className="mb-4">Amount to pay: {AMOUNT} INR</p>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`px-4 py-2 ${
            isProcessing ? "bg-gray-400" : "bg-blue-500 mx-10 hover:bg-blue-600"
          } text-white rounded`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
