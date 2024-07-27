import { clubsState, userState } from "@/app/recoilContextProvider";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/axiosInstance";
import { set } from "react-hook-form";
import ClubMembersList from "./ClubMembersList";

interface ClubComponentProps {
  id: string;
  name: string;
  description: string;
  strength: number;
  createdBy: string;
  clubHead: string;
  username: string;
  members: { _id: string; name: string }[];
  pendingRequests: { _id: { _id: string; name: string }; name: string }[];
}

const ClubComponent: React.FC<ClubComponentProps> = ({
  id,
  name,
  description,
  strength,
  clubHead,
  username,
  members,
  pendingRequests = [],
}) => {
  const [showMore, setShowMore] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const toggleDescription = () => {
    setShowMore(!showMore);
  };
  const [user, setUser] = useRecoilState(userState);
  const setClub = useSetRecoilState(clubsState);
  const userId = user._id;
  const userRole = user.role;

  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };

  const applyClub = () => {
    axiosInstance.post(`/club/apply/${id}`).then((response) => {
      setClub((oldClubs) => {
        const newClubs = oldClubs.map((club) => {
          if (club._id === id) {
            return {
              ...club,
              pendingRequests: [
                ...club.pendingRequests,
                { _id: { _id: user._id, name: user.name }, name: user.name },
              ],
            };
          }
          return club;
        });
        return newClubs;
      });
    });
  };

  const acceptRequest = (request: { _id: { _id: string; name: string }; name: string }) => {
    console.log("Accept button clicked for:", request);
  
    const userIdString = request._id._id;
    console.log("Accept request called with userId:", userIdString);
  
    axiosInstance
      .post(`/club/accept-request/${id}/${userIdString}`)
      .then((response) => {
        console.log("Accept request response:", response.data);
        setClub((oldClubs) => {
          const newClubs = oldClubs.map((club) => {
            if (club._id === id) {
              return {
                ...club,
                pendingRequests: club.pendingRequests.filter(
                  (req) => req._id._id !== userIdString
                ),
                members: [
                  ...club.members,
                  {
                    _id: userIdString,
                    name: request.name,
                  },
                ],
                strength: club.strength + 1,
              };
            }
            return club;
          });
          return newClubs;
        });
      })
      .catch((error) => {
        console.error(
          "Error accepting request:",
          error.response?.data || error.message
        );
        console.error("Full error object:", error);
      });
  };

  if (clubHead === userId || userRole === "staff") {
    return (
      <div className="border hover:border-gray-500 border-gray-300 bg-gray-700 text-white hover:bg-gray-600 rounded-lg p-4 mb-4">
        <h2 className="text-2xl font-semibold mb-2">
          {name} {clubHead === userId && "(Your Club)"}
        </h2>
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
        <Button onClick={toggleMembers} variant="outline" className="mt-2">
          {showMembers ? "Hide Members" : "Show Members"}
        </Button>
        {showMembers && (
          <div className="mt-2">
            <h3 className="text-lg font-semibold">Members:</h3>
            <ul>
              {members.map((member) => (
                <li key={member._id}>{member.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Pending Requests:</h3>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div
              key={request._id._id}
                className="flex items-center mt-2"
              >
                <span>{request.name}</span>
                <Button
                  onClick={() => {
                    console.log("Accept button clicked for:", request);
                    acceptRequest(request);
                  }}
                  variant="outline"
                  className="ml-2"
                >
                  Accept
                </Button>
              </div>
            ))
          ) : (
            <p>No pending requests.</p>
          )}
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
      </div>
      {userRole === "user" && (
        <Button
          onClick={applyClub}
          variant="default"
          disabled={
            user.clubs.includes(name) ||
            pendingRequests.some((req) => req._id._id === userId)
          }
        >
          {pendingRequests.some((req) => req._id._id === userId)
            ? "Request Pending"
            : "Apply"}
        </Button>
      )}
      <Button onClick={toggleMembers} variant="outline" className="mt-2">
        {showMembers ? "Hide Members" : "Show Members"}
      </Button>
      {showMembers && (
        <div className="mt-2">
          <h3 className="text-lg font-semibold">Members:</h3>
          <ul>
            {members.map((member) => (
              <li key={member._id}>{member.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClubComponent;
