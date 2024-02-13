"use client";

import EventComponent from "@/components/EventComponent";
import ListWrapper from "@/components/ListWrapper";
const events = [
  {
    name: "Event 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.",
    link: "https://example.com/event1",
    createdBy: "1",
  },
  {
    name: "Event 1",
    description: "Description of Event 1",
    link: "https://example.com/event1",
    createdBy: "1",
  },
  {
    name: "Event 1",
    description: "Description of Event 1",
    link: "https://example.com/event1",
    createdBy: "8",
  },
  {
    name: "Event 1",
    description: "Description of Event 1",
    link: "https://example.com/event1",
    createdBy: "1",
  },
  {
    name: "Event 1",
    description: "Description of Event 1",
    link: "https://example.com/event1",
    createdBy: "1",
  },
  {
    name: "Event 1",
    description: "Description of Event 1",
    link: "https://example.com/event1",
    createdBy: "1",
  },
  {
    name: "Event 1",
    description: "Description of Event 1",
    link: "https://example.com/event1",
    createdBy: "1",
  },
  {
    name: "Event 2",
    description: "Description of Event 2",
    link: "https://example.com/event2",
    createdBy: "2",
  },
  {
    name: "Event 3",
    description: "Description of Event 3",
    link: "https://example.com/event3",
    createdBy: "3",
  },
];
export default function Events() {
  return (
    <ListWrapper>
      <EventComponent
        name={"Shoaib's event"}
        description={"Description 1"}
        link={"https://example.com/event1"}
        createdBy={"8"}
      />
      {events.map((event, index) => (
        <EventComponent
          key={index}
          name={event.name}
          description={event.description}
          link={event.link}
          createdBy={event.createdBy}
        />
      ))}
    </ListWrapper>
  );
}
