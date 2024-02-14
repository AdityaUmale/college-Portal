import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import RecoidContextProvider from "./recoilContextProvider";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Manage",
  description: "Generated by create next app",
};
const allowedPaths = ["/", "/announcements", "/clubs"];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex w-full">
          <RecoidContextProvider>{children}</RecoidContextProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
