import React, { useState } from "react";

interface EventComponentProps {
  name: string;
  description: string;
  link: string;
  createdBy: string;
}

const EventComponent: React.FC<EventComponentProps> = ({
  name,
  description,
  link,
  createdBy,
}) => {
  const [showMore, setShowMore] = useState(false);

  const toggleDescription = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="border border-gray-300 rounded p-4 mb-4">
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
      <div className=" flex justify-between">
        <a
          target="_blank"
          href={link}
          className="text-blue-700 font-semibold hover:underline"
        >
          Link
        </a>
        <p className="text-sm">Created by: {createdBy}</p>
      </div>
    </div>
  );
};

export default EventComponent;
