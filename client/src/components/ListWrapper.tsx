"use client";
import React from "react";

interface ListWrapperProps {
  children: React.ReactNode;
}

const ListWrapper: React.FC<ListWrapperProps> = ({ children }) => {
  return (
    <main className="flex-grow h-screen flex justify-center items-center gap-4 bg-slate-100">
      <div className=" w-[80%] border bg-white border-gray-300 min-h-[80vh] rounded-lg p-4">
        {children}
      </div>
    </main>
  );
};

export default ListWrapper;
