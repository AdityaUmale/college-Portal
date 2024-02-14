"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRecoilValue } from "recoil";
import { userState } from "@/app/recoilContextProvider";

export default function SidebarUserInfo() {
  const userName = useRecoilValue(userState).name;
  const createUserFallBack = (userName: string) => {
    if (userName.length === 0) return "";
    return userName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("recoil-persist");
    window.location.href = "/";
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
        <PopoverContent className="p-2">
          <button
            onClick={logout}
            className="p-2 w-full hover:bg-gray-200 flex justify-center items-center cursor-pointer text-black"
          >
            <LogOut />
            Logout
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
