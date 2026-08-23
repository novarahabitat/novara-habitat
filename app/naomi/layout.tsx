import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naomi — Job Hunt",
  description: "Private job-search workspace",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  referrer: "no-referrer",
};

export default function NaomiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
