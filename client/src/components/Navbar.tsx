"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const Navbar: React.FC = () => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-end items-center gap-4 p-4">
      <Button onClick={() => router.push("/login")} variant="outline">
        Login
      </Button>
      <Button onClick={() => router.push("/signup")}>Register</Button>
    </div>
  );
};

export default Navbar;
