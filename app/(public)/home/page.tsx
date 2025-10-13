import type { Metadata } from "next";
import AboutUs from "@/app/components/HomePage/AboutUs";
import Hero from "@/app/components/HomePage/Hero";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutUs />
    </>
  );
}
