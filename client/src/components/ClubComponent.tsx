import { clubsState, userState } from "@/app/recoilContextProvider";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/axiosInstance";
import { set } from "react-hook-form";

interface ClubComponentProps {
  id: string;
  name: string;
  description: string;
  strength: number;
  createdBy: string;
  clubHead: string;
  username: string;
}

const ClubComponent: React.FC<ClubComponentProps> = ({
  id,
  name,
  description,
  strength,
  clubHead,
  username,
}) => {
  const [showMore, setShowMore] = useState(false);

  const toggleDescription = () => {
    setShowMore(!showMore);
  };
  const [user, setUser] = useRecoilState(userState);
  const setClub = useSetRecoilState(clubsState);
  const userId = user._id;
  const userRole = user.role;
  const applyClub = () => {
    axiosInstance.get(`/club/apply/${id}`).then((response) => {
      setUser((oldUser) => ({ ...oldUser, clubs: [...oldUser.clubs, name] }));
      setClub((oldClubs) => {
        const newClubs = oldClubs.map((club) => {
          if (club._id === id) {
            return { ...club, strength: club.strength + 1 };
          }
          return club;
        });
        return newClubs;
      });
    });
  };
  if (clubHead === userId) {
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
      <h2 className="text-lg font-semibold mb-2">
        {name} {user.clubs.includes(name) && "(You are a member)"}
      </h2>
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
        <div>Club Head: {username}</div>
      </div>{" "}
      {userRole === "user" && (
        <Button
          onClick={applyClub}
          variant="default"
          disabled={user.clubs.includes(name)}
        >
          Apply
        </Button>
      )}
    </div>
  );
};

export default ClubComponent;
