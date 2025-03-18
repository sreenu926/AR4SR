"use client";

import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
    </div>
  );
}
