"use client";
import { SendHorizontal } from "lucide-react";
import React, { useState } from "react";

interface MessageInputProps {
  onSubmit: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (message.trim() !== "") {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <div className="flex justify-between items-center py-2">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type your message..."
        className="border rounded-md p-2 w-full mr-2 focus:border-gray-500 focus:outline-none"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        <SendHorizontal />
      </button>
    </div>
  );
};

export default MessageInput;
