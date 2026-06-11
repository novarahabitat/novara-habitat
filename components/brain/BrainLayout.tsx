"use client";

import { ReactNode } from "react";
import BrainSidebar from "./BrainSidebar";

type BrainLayoutProps = {
  children: ReactNode;
};

export default function BrainLayout({
  children,
}: BrainLayoutProps) {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div>
            <BrainSidebar />
          </div>

          <div>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
