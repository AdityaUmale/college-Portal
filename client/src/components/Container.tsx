import React from "react";
import { cn } from "@/lib/utils";
type SectionProp = {
  className ?:string;
  children: React.ReactNode;
};

const Container = ({ children , className }: SectionProp) => {
  return (
    <main className={cn('lg:px-16 lg:py-34 py-4 px-4 overflow-y-scroll min-h-[calc(100vh_-_70px)] w-full' , className)}>
      {children}
    </main>
  );
};
export default Container;
