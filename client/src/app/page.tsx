"use client";

import EventComponent from "@/components/EventComponent";
import ListWrapper from "@/components/ListWrapper";
import { useRecoilValue } from "recoil";
import { userState } from "./recoilContextProvider";
import { EventForm } from "@/components/forms/EventForm";

const events = [
  {
    name: "Event 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.",
    link: "https://example.com/event1",
    createdBy: "8",
    username: "Alice Smith",
  },
  {
    name: "Event 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.",
    link: "https://example.com/event1",
    createdBy: "1",
    username: "Alice Smith",
  },
];
export default function Events() {
  const userId = useRecoilValue(userState)._id;
  return (
    <ListWrapper heading="Events" form={<EventForm />}>
      {events.map((event, index) => {
        if (event.createdBy == userId) {
          return (
            <EventComponent
              key={index}
              name={event.name}
              description={event.description}
              link={event.link}
              createdBy={event.createdBy}
              username={event.username}
            />
          );
        }
      })}
      {events.map((event, index) => {
        if (event.createdBy !== userId) {
          return (
            <EventComponent
              key={index}
              name={event.name}
              description={event.description}
              link={event.link}
              createdBy={event.createdBy}
              username={event.username}
            />
          );
        }
      })}
    </ListWrapper>
  );
}
