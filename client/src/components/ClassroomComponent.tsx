import {
  Classroom,
  classroomState,
  userState,
} from "@/app/recoilContextProvider";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Post {
  _id: string;
  content: string;
  createdBy:
    | {
        _id: string;
        name?: string;
      }
    | string;
  createdAt: string;
}

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef(null);

  const toggleDescription = () => {
    setShowMore(!showMore);
  };
  const [user, setUser] = useRecoilState(userState);
  const setClassroom = useSetRecoilState(classroomState);
  const userId = user._id;
  const userRole = user.role;
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.on("text-change", () => {
        setNewPostContent(quill.root.innerHTML);
      });
    }
  }, []);

  useEffect(() => {
    // Fetch posts when component mounts
    fetchPosts();
  }, [id]);

  const fetchPosts = () => {
    axiosInstance
      .get(`/classroom/${id}/posts`)
      .then((response) => {
        console.log("Fetched posts:", response.data);
        // Flatten the array of arrays into a single array of posts
        const flattenedPosts = response.data.flat();
        setPosts(flattenedPosts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  const applyClassroom = () => {
    axiosInstance
      .post(`/classroom/apply/${id}`)
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
          setClassroom((oldClassrooms) =>
            oldClassrooms.filter((classroom) => classroom._id !== id)
          );
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
                members: classroom.members.filter(
                  (member) => member._id !== userId
                ),
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
      axiosInstance
        .post(`/classroom/revert-application/${id}`)
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUpload = () => {
    if (uploadedFile && quillRef.current) {
      console.log("Uploading file:", uploadedFile.name);
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertText(range.index, `File uploaded: ${uploadedFile.name}`);
      } else {
        quill.insertText(
          quill.getLength(),
          `File uploaded: ${uploadedFile.name}`
        );
      }
      setUploadedFile(null);
    }
  };

  const handlePostContentChange = (content: string) => {
    setNewPostContent(content);
  };

  const createPost = () => {
    axiosInstance
      .post(`/classroom/${id}/posts/${userId}`, { content: newPostContent })
      .then((response) => {
        // Assuming the response.data is the newly created post
        setPosts((oldPosts) => [...oldPosts, response.data]);
        setNewPostContent("");
        if (quillRef.current) {
          quillRef.current.getEditor().root.innerHTML = "";
        }
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  const deletePost = (postId: string) => {
    if (!postId) {
      console.error("Invalid postId");
      return;
    }
    axiosInstance
      .delete(`/classroom/${id}/posts/${postId}`)
      .then(() => {
        setPosts((oldPosts) => oldPosts.filter((post) => post._id !== postId));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
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
        {!isStaff && user.classrooms.includes(name) && "(You are a member)"}
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

                {userRole === "staff" || (
                  <Button
                    onClick={() => removeClassroomMember(member._id)}
                    variant="destructive"
                    className="ml-2"
                  >
                    Remove
                  </Button>
                )}
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
        <Button
          onClick={deleteClassroom}
          variant="destructive"
          className="mt-2"
        >
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
            ? "processing..."
            : pendingRequests.some((req) => req._id._id === userId)
            ? "Revert Application"
            : "Apply"}
        </Button>
      )}
      <h1>Instructions :</h1>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Create a new post</h3>
        {typeof window !== "undefined" && (
          <ReactQuill
            ref={quillRef}
            value={newPostContent}
            onChange={setNewPostContent}
            modules={{
              toolbar: [
                ["bold", "italic", "underline", "strike"],
                ["link", "image"],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ size: ["small", false, "large", "huge"] }],
                [{ align: [] }],
                ["clean"],
              ],
            }}
          />
        )}
        <div className="mt-2 flex items-center">
          <label htmlFor="file-upload" className="sr-only">
            Choose file
          </label>
          <input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            aria-label="File upload"
          />
          <button
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              } else {
                console.error("File input reference is null");
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Choose File
          </button>
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            disabled={!uploadedFile}
          >
            Upload File
          </button>
          {uploadedFile && <span>{uploadedFile.name}</span>}
        </div>
        <button
          onClick={createPost}
          className="mt-2 bg-purple-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Posts</h3>
        {posts.map((post: Post) => (
          <div key={post._id} className="border p-4 my-2 rounded">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <p className="text-sm text-gray-500">
              Posted by:{" "}
              {typeof post.createdBy === "object"
                ? post.createdBy.name || "Unknown user"
                : "Unknown user"}{" "}
              on {new Date(post.createdAt).toLocaleString()}
            </p>
            {(userRole === "staff" ||
              (typeof post.createdBy === "object" &&
                post.createdBy._id === userId)) && (
              <button
                onClick={() => deletePost(post._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClassroomComponent;
