import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import ServicesPreview from "@/components/home/ServicesPreview";
import ChoirTeaser from "@/components/home/ChoirTeaser";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "Imara Studios — Premium Music & Media Production | Nakuru",
  description:
    "Imara Studios — Nakuru's premier music recording, production, vocal training, video production studio and home of the acclaimed Imara Chorale.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesPreview />
      <ChoirTeaser />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
