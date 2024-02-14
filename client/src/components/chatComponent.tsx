import React, { Suspense, useEffect, useState } from "react";
import Preloader from "./Preloader";
import MessageInput from "./SuggestionMessageInput";
import axiosInstance from "@/axiosInstance";
import { useRouter } from "next/navigation";

type ChatMessage = {
  createdBy: string;
  suggestion: string;
};

const ChatComponent: React.FC<{ eventId: string }> = ({ eventId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axiosInstance
      .get("/event/getAllSuggestions/" + eventId)
      .then((response) => {
        const fetchedMessages = response.data.suggestions;
        setMessages(fetchedMessages);
        console.log("Fetched messages:", fetchedMessages);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        if (error.response.status === 401) {
          router.push("/login");
        }
      });
  }, []);

  const getMessageClassName = (createdBy: string): string => {
    switch (createdBy) {
      case "You":
        return "bg-gray-200";
      case "Author":
        return "bg-gray-300";
      case "Anonymous":
        return "bg-gray-100";
      default:
        return "";
    }
  };

  const handleSubmit = (message: string) => {
    const newMessage: ChatMessage = { createdBy: "You", suggestion: message };
    axiosInstance
      .post("/event/suggestion/" + eventId, { suggestion: message })
      .then((response) => {
        console.log("Suggestion added:", response.data);
        setMessages([...messages, newMessage]);
      })
      .catch((error) => {
        console.error("Error adding suggestion:", error);
      });
  };

  return (
    <Suspense fallback={<Preloader />}>
      <div className="flex flex-col gap-2 p-4 bg-white rounded-md shadow-md">
        <div className="flex flex-col gap-2">
          {loading ? (
            <Preloader />
          ) : messages.length === 0 ? (
            <div className="text-gray-600 p-2 rounded-md bg-gray-200">
              No suggestions yet.
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`text-gray-700 p-2 rounded-md ${getMessageClassName(
                  message.createdBy
                )}`}
              >
                <span className="text-sm font-semibold">
                  {message.createdBy}:&nbsp;
                </span>
                {message.suggestion}
              </div>
            ))
          )}
        </div>
        <MessageInput onSubmit={handleSubmit} />
      </div>
    </Suspense>
  );
};

export default ChatComponent;
