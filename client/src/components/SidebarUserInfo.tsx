"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function SidebarUserInfo() {
  const userName = "Shoaib Akhtar";
  const createUserFallBack = (userName: string) => {
    return userName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };
  return (
    <div className="p-4 flex items-center justify-between w-full">
      <Avatar>
        <AvatarImage src="" alt="@shadcn" />
        <AvatarFallback>{createUserFallBack(userName)}</AvatarFallback>
      </Avatar>
      <div>{userName}</div>
      <Popover>
        <PopoverTrigger>
          {" "}
          <MoreVertical
            size={"30"}
            className="hover:bg-gray-600 cursor-pointer p-1 rounded-md"
          />
        </PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>
    </div>
  );
}
