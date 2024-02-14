"use client";
import { userState } from "@/app/recoilContextProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import ChatComponent from "./chatComponent";

interface EventComponentProps {
  name: string;
  description: string;
  link: string;
  createdBy: string;
  username: string;
  eventId: string;
}

const EventComponent: React.FC<EventComponentProps> = ({
  name,
  description,
  link,
  createdBy,
  username,
  eventId,
}) => {
  const [showMore, setShowMore] = useState(false);
  const toggleDescription = () => {
    setShowMore(!showMore);
  };
  const user = useRecoilValue(userState);
  const userId = user._id;

  if (createdBy === userId) {
    return (
      <div className="border hover:border-gray-500 border-gray-300 bg-gray-700 text-white hover:bg-gray-600 rounded-lg p-4 mb-4">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2">{name} (Your Event)</h2>
          <Popover>
            <PopoverTrigger className=" bg-gray-500 flex items-center gap-1 justify-center p-3 rounded-md text-white font-bold">
              Suggestions
            </PopoverTrigger>
            <PopoverContent className="custom-scrollbar w-[30rem] h-fit max-h-[20rem] overflow-auto bg-white rounded-lg border-gray-500 border-2 text-black p-2 font-bold">
              <div className=" text-2xl mx-2">Suggestions</div>
              <ChatComponent eventId={eventId} />
            </PopoverContent>
          </Popover>
        </div>
        <div
          className={`mb-2 ${showMore ? "" : "line-clamp-3"} whitespace-normal`}
        >
          {description}
        </div>
        {description.length > 100 && (
          <button
            onClick={toggleDescription}
            className="text-gray-400 hover:underline focus:outline-none"
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="border hover:border-gray-500 hover:bg-gray-200 border-gray-300 flex flex-col items-start rounded-lg p-4 mb-4">
      <div className="flex w-full justify-between items-center">
        <h2 className="text-2xl font-semibold mb-2">{name}</h2>
        <Popover>
          <PopoverTrigger className=" bg-gray-500 flex items-center gap-1 justify-center p-3 rounded-md text-white font-bold">
            Suggestions
          </PopoverTrigger>
          <PopoverContent className="custom-scrollbar w-[30rem] h-fit max-h-[20rem] overflow-auto bg-white rounded-lg border-gray-500 border-2 text-black p-2 font-bold">
            <div className=" text-2xl mx-2">Suggestions</div>
            <ChatComponent eventId={eventId} />
          </PopoverContent>
        </Popover>
      </div>
      <div
        className={`mb-2 ${showMore ? "" : "line-clamp-3"} whitespace-normal`}
      >
        {description}
      </div>
      {description.length > 100 && (
        <button
          onClick={toggleDescription}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          {showMore ? "Show less" : "Show more"}
        </button>
      )}
      <div className="w-full flex justify-between items-center">
        <a
          target="_blank"
          href={link}
          className="text-blue-700 font-semibold underline"
        >
          Link
        </a>

        <div>Created by: {username}</div>
      </div>
    </div>
  );
};

export default EventComponent;
