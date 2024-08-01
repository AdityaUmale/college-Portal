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
  clubHeads: { _id: string; name: string }[];
  username: string;
  members: { _id: string; name: string }[];
  pendingRequests: { _id: { _id: string; name: string }; name: string }[];
}

const ClubComponent: React.FC<ClubComponentProps> = ({
  id,
  name,
  description,
  strength,
  clubHeads,
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

  const acceptRequest = (request: {
    _id: { _id: string; name: string };
    name: string;
  }) => {
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

  const deleteClub = () => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      axiosInstance
        .delete(`/club/${id}`)
        .then(() => {
          setClub((oldClubs) => oldClubs.filter((club) => club._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting club:", error);
        });
    }
  };

  const isStaffOrClubHead =
    clubHeads?.some((head) => head._id === userId) || userRole === "staff";

  const assignClubHead = (userId: string) => {
    axiosInstance
      .post(`/club/${id}/assign-head/${userId}`)
      .then((response) => {
        console.log("Club head assigned successfully:", response.data);
        // Update local state
        setClub((oldClubs) => {
          return oldClubs.map((club) => {
            if (club._id === id) {
              return {
                ...club,
                clubHeads: response.data.clubHeads,
              };
            }
            return club;
          });
        });
      })
      .catch((error) => {
        console.error("Error assigning club head:", error);
      });
  };
  const removeMember = (userId: string) => {
    axiosInstance
      .post(`/club/${id}/remove-member/${userId}`)
      .then(() => {
        setClub((oldClubs) => {
          const newClubs = oldClubs.map((club) => {
            if (club._id === id) {
              return {
                ...club,
                members: club.members.filter((member) => member._id !== userId),
                clubHeads: club.clubHeads.filter((head) => head._id !== userId),
                strength: club.strength - 1,
              };
            }
            return club;
          });
          return newClubs;
        });
      })
      .catch((error) => {
        console.error("Error removing member:", error);
      });
  };

  const removeClubHead = (userId: string) => {
    axiosInstance
      .post(`/club/${id}/remove-head/${userId}`)
      .then((response) => {
        console.log("Club head removed successfully:", response.data);
        // Update local state
        setClub((oldClubs) => {
          return oldClubs.map((club) => {
            if (club._id === id) {
              return {
                ...club,
                clubHeads: response.data.clubHeads,
              };
            }
            return club;
          });
        });
      })
      .catch((error) => {
        console.error("Error removing club head:", error);
      });
  };

  return (
    <div
      className={`border hover:border-gray-500 ${
        isStaffOrClubHead
          ? "bg-gray-700 text-white hover:bg-gray-600"
          : "hover:bg-gray-200"
      } gap-2 border-gray-300 flex flex-col items-start rounded-lg p-4 mb-4`}
    >
      <h2 className="text-2xl font-semibold mb-2">
        {name} {clubHeads?.some((head) => head._id === userId) && "(Your Club)"}
        {!isStaffOrClubHead &&
          user.clubs.includes(name) &&
          "(You are a member)"}
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
        <div>Strength: {strength}</div>
        {!isStaffOrClubHead && <div>Club Head: {username}</div>}
      </div>
      <Button onClick={toggleMembers} variant="outline" className="mt-2">
        {showMembers ? "Hide Members" : "Show Members"}
      </Button>
      {showMembers && (
        <div className="mt-2">
          <h3 className="text-lg font-semibold">Members:</h3>
          <ul>
            {members.map((member) => (
              <li key={member._id}>
                {member.name}
                {(userRole === "staff" ||
                  clubHeads.some((head) => head._id === userId)) &&
                  !clubHeads?.some((head) => head._id === member._id) && (
                    <Button
                      onClick={() => assignClubHead(member._id)}
                      variant="outline"
                      className="ml-2"
                    >
                      Make Club Head
                    </Button>
                  )}
                {userRole === "staff" &&
                  clubHeads?.some((head) => head._id === member._id) && (
                    <Button
                      onClick={() => removeClubHead(member._id)}
                      variant="outline"
                      className="ml-2"
                    >
                      Remove Club Head
                    </Button>
                  )}

                {(userRole === "staff" ||
                  clubHeads.some((head) => head._id === userId)) &&
                  !clubHeads?.some((head) => head._id === member._id) && (
                    <Button
                      onClick={() => removeMember(member._id)}
                      variant="destructive"
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  )}
                {clubHeads?.some((head) => head._id === member._id) && (
                  <span className="ml-2 text-green-500">(Club Head)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {isStaffOrClubHead && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Pending Requests:</h3>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div key={request._id._id} className="flex items-center mt-2">
                <span>{request.name}</span>
                <Button
                  onClick={() => acceptRequest(request)}
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
      )}
      {userRole === "staff" && (
        <Button onClick={deleteClub} variant="destructive" className="mt-2">
          Delete Club
        </Button>
      )}
      {userRole === "user" && !user.clubs.includes(name) && (
        <Button
          onClick={applyClub}
          variant="default"
          disabled={pendingRequests.some((req) => req._id._id === userId)}
          className="mt-2"
        >
          {pendingRequests.some((req) => req._id._id === userId)
            ? "Request Pending"
            : "Apply"}
        </Button>
      )}
    </div>
  );
};
export default ClubComponent;
