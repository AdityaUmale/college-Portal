"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle } from "lucide-react";
import { useRecoilValue } from "recoil";
import { userState } from "@/app/recoilContextProvider";

interface ListWrapperProps {
  children: React.ReactNode;
  form: React.ReactNode;
  heading: string;
}

const ListWrapper: React.FC<ListWrapperProps> = ({
  children,
  heading,
  form,
}) => {
  const userRole = useRecoilValue(userState).role;
  return (
    <main className="flex-grow flex-1 h-screen flex flex-col justify-center items-center gap-2 bg-slate-100">
      <div className="w-[80%] flex justify-between ">
        <h1 className="text-5xl font-bold text-gray-800">{heading}</h1>
        {form && userRole === "staff" && (
          <Popover>
            <PopoverTrigger className=" bg-gray-700 flex items-center gap-1 justify-center p-3 rounded-md text-white font-bold">
              <PlusCircle />
              Add {heading.slice(0, -1)}
            </PopoverTrigger>
            <PopoverContent>{form}</PopoverContent>
          </Popover>
        )}
      </div>
      <div className="w-[80%] border bg-white border-gray-300 min-h-[80vh] max-h-[85%] rounded-lg p-3 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </main>
  );
};

export default ListWrapper;
