"use client";

import EventComponent from "@/components/EventComponent";
import ListWrapper from "@/components/ListWrapper";
import { useRecoilState, useRecoilValue } from "recoil";
import { eventsState, userState } from "../recoilContextProvider";
import { EventForm } from "@/components/forms/EventForm";
import { useEffect } from "react";
import axiosInstance from "@/axiosInstance";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function Events() {
  const user = useRecoilValue(userState);
  const { toast } = useToast();
  const [events, setEvents] = useRecoilState(eventsState);
  const router = useRouter();
  useEffect(() => {
    axiosInstance
      .get("/event")
      .then((response) => {
        const fetchedEvents = response.data;
        setEvents(fetchedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        if (error.response.status === 401) {
          router.push("/login");
          toast({
            title: "Error",
            description: "Please login to view events",
          });
        }
      });
  }, []);

  const userId = user._id;
  if (events.length === 0) {
    return (
      <ListWrapper heading="Events" form={<EventForm />}>
        <h1 className=" text-5xl text-gray-600 font-semibold">
          No events found
        </h1>
      </ListWrapper>
    );
  }
  return (
    <ListWrapper heading="Events" form={<EventForm />}>
      {events.map((event, index) => {
        if (event.createdBy == userId) {
          return (
            <EventComponent
              key={index}
              name={event.title}
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
              name={event.title}
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
