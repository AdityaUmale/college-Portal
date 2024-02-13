"use client";

import AnnouncementComponent from "@/components/AnnouncementComponent";
import ListWrapper from "@/components/ListWrapper";
import { AnnouncementForm } from "@/components/forms/AnnouncementForm";
import { useRecoilValue } from "recoil";
import { userState } from "../recoilContextProvider";

const announcements = [
  {
    title: "Announcement 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.",
    createdBy: "8",
    username: "Alice Smith",
  },
  {
    title: "Announcement 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.",
    createdBy: "1",
    username: "Alice Smith",
  },
];

export default function Announcements() {
  const userId = useRecoilValue(userState)._id;
  return (
    <ListWrapper heading="Announcements" form={<AnnouncementForm />}>
      {announcements
        .filter((announcement) => announcement.createdBy === userId)
        .map((announcement, index) => (
          <AnnouncementComponent
            key={index}
            name={announcement.title}
            description={announcement.description}
            createdBy={announcement.createdBy}
            username={announcement.username}
          />
        ))}
      {announcements
        .filter((announcement) => announcement.createdBy !== userId)
        .map((announcement, index) => (
          <AnnouncementComponent
            key={index}
            name={announcement.title}
            description={announcement.description}
            createdBy={announcement.createdBy}
            username={announcement.username}
          />
        ))}
    </ListWrapper>
  );
}
