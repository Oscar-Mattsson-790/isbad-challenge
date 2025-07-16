import React from "react";
import Header from "./header";
import StickyWrapper from "@/components/sticky-wrapper";
import Footer from "./footer";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#242422] pb-[64px]">{children}</main>
      <Footer />
      <StickyWrapper />
      <Toaster />
    </div>
  );
}
