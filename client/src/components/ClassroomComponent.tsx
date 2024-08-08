import { Classroom, classroomState , userState } from "@/app/recoilContextProvider";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/axiosInstance";


interface ClassroomComponentProps {
  id: string;
  name: string;
  description: string;
  strength: number;
  createdBy: string;
  username: string;
  members: { _id: string; name: string }[];
  pendingRequests: { _id: { _id: string; name: string }; name: string }[];
  updateClassroom: (updatedClassroom: Classroom) => void;
}

const ClassroomComponent: React.FC<ClassroomComponentProps> = ({
  id,
  name,
  description,
  strength,
  username,
  members,
  pendingRequests = [],
  updateClassroom,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const toggleDescription = () => {
    setShowMore(!showMore);
  };
  const [user, setUser] = useRecoilState(userState);
  const setClassroom = useSetRecoilState(classroomState);
  const userId = user._id;
  const userRole = user.role;

  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };

  const applyClassroom = () => {
    axiosInstance.post(`/classroom/apply/${id}`)
      .then((response) => {
        setClassroom((oldClassrooms) => {
          const newClassrooms = oldClassrooms.map((classroom) => {
            if (classroom._id === id) {
              return {
                ...classroom,
                pendingRequests: [
                  ...classroom.pendingRequests,
                  { _id: { _id: user._id, name: user.name }, name: user.name },
                ],
              };
            }
            return classroom;
          });
          return newClassrooms;
        });
      })
      .catch((error) => {
        console.error("Error applying to classroom:", error);
      })
      .finally(() => {
        setIsApplying(false);
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
      .post(`/classroom/accept-request/${id}/${userIdString}`)
      .then((response) => {
        console.log("Accept request response:", response.data);
        setClassroom((oldClassrooms) => {
          const newClassrooms = oldClassrooms.map((classroom) => {
            if (classroom._id === id) {
              return {
                ...classroom,
                pendingRequests: classroom.pendingRequests.filter(
                  (req) => req._id._id !== userIdString
                ),
                members: [
                  ...classroom.members,
                  {
                    _id: userIdString,
                    name: request.name,
                  },
                ],
                strength: classroom.strength + 1,
              };
            }
            return classroom;
          });
          return newClassrooms;
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

  const deleteClassroom = () => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      axiosInstance
        .delete(`/classroom/${id}`)
        .then(() => {
          setClassroom((oldClassrooms) => oldClassrooms.filter((classroom) => classroom._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting classroom:", error);
        });
    }
  };

  const isStaff = userRole === "staff";

  const removeClassroomMember = (userId: string) => {
    axiosInstance
      .post(`/classroom/${id}/remove-member/${userId}`)
      .then(() => {
        setClassroom((oldClassrooms) => {
          const newClassrooms = oldClassrooms.map((classroom) => {
            if (classroom._id === id) {
              return {
                ...classroom,
                members: classroom.members.filter((member) => member._id !== userId),
                strength: classroom.strength - 1,
              };
            }
            return classroom;
          });
          return newClassrooms;
        });
      })
      .catch((error) => {
        console.error("Error removing member:", error);
      });
  };


  const toggleClassroomApplication = () => {
    setIsApplying(true);
    if (pendingRequests.some((req) => req._id._id === userId)) {
      // Revert application
      axiosInstance.post(`/classroom/revert-application/${id}`)
        .then(() => {
          setClassroom((oldClassrooms) => {
            return oldClassrooms.map((classroom) => {
              if (classroom._id === id) {
                return {
                  ...classroom,
                  pendingRequests: classroom.pendingRequests.filter(
                    (req) => req._id._id !== userId
                  ),
                };
              }
              return classroom;
            });
          });
        })
        .catch((error) => {
          console.error("Error reverting application:", error);
        })
        .finally(() => {
          setIsApplying(false);
        });
    } else {
      applyClassroom();
    }
  };

  return (
    <div
      className={`border hover:border-gray-500 ${
        isStaff
          ? "bg-gray-700 text-white hover:bg-gray-600"
          : "hover:bg-gray-200"
      } gap-2 border-gray-300 flex flex-col items-start rounded-lg p-4 mb-4`}
    >
      <h2 className="text-2xl font-semibold mb-2">
        {!isStaff &&
          user.classrooms.includes(name) &&
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

                {(userRole === "staff" || (
                    <Button
                      onClick={() => removeClassroomMember(member._id)}
                      variant="destructive"
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  ))}
              
              </li>
            ))}
          </ul>
        </div>
      )}
      {isStaff && (
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
        <Button onClick={deleteClassroom} variant="destructive" className="mt-2">
          Delete Classroom
        </Button>
      )}
      {userRole === "user" && !user.classrooms.includes(name) && (
        <Button
          onClick={toggleClassroomApplication}
          variant="default"
          disabled={isApplying}
          className="mt-2"
        >
          {isApplying
            ?"processing..."
            :pendingRequests.some((req) => req._id._id === userId)
            ? "Revert Application"
            :"Apply"}
        </Button>
      )}
    </div>
  );
};
export default ClassroomComponent;
