import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tricky Waitlist",
  description:
    "Answer 3 interior design questions and spin to win prizes worth up to ₹500.",
  openGraph: {
    title: "Win with Tricky Waitlist",
    description: "Take the quiz, spin the wheel, win prizes.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0d0b09] antialiased`}>
        {children}
      </body>
    </html>
  );
}
