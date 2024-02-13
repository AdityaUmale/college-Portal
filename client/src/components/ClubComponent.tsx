import { userState } from "@/app/recoilContextProvider";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { Button } from "@/components/ui/button";

interface ClubComponentProps {
  name: string;
  description: string;
  strength: number;
  createdBy: string;
  clubHead: string;
}

const ClubComponent: React.FC<ClubComponentProps> = ({
  name,
  description,
  strength,
  createdBy,
  clubHead,
}) => {
  const [showMore, setShowMore] = useState(false);

  const toggleDescription = () => {
    setShowMore(!showMore);
  };
  const user = useRecoilValue(userState);
  const userId = user._id;
  const userRole = user.role;

  if (createdBy === userId) {
    return (
      <div className="border hover:border-gray-500 border-gray-300 bg-gray-700 text-white hover:bg-gray-600 rounded-lg p-4 mb-4">
        <h2 className="text-2xl font-semibold mb-2">{name} (Your Club)</h2>
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
        <div>
          <div>Strength:{strength}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="border hover:border-gray-500 hover:bg-gray-200 gap-2 border-gray-300 flex flex-col items-start rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>
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
      <div className="flex w-full justify-between items-center">
        <div>Strength:{strength}</div>
        <div>Club Head: {clubHead}</div>
      </div>{" "}
      {userRole === "user" && <Button variant="default">Apply</Button>}
    </div>
  );
};

export default ClubComponent;
