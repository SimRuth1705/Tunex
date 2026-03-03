import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Workflow from "../components/Workflow";
import BetaTicketSection from "../components/BetaTicketSection"; // 🌟 Import the new section

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center overflow-clip w-full">
      <Hero />
      <Features />
      <Workflow />
      <BetaTicketSection />
      <div className="w-full max-w-6xl mx-auto border-t border-white/5 opacity-50 mt-20" />
    </div>
  );
}
