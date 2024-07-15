"use client";

import AnnouncementComponent from "@/components/AnnouncementComponent";
import ListWrapper from "@/components/ListWrapper";
import { AnnouncementForm } from "@/components/forms/AnnouncementForm";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  Announcemnt,
  announcementsState,
  userState,
} from "../../recoilContextProvider";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/axiosInstance";

export default function Announcements() {
  const user = useRecoilValue(userState);
  const userId = user._id;
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useRecoilState(announcementsState);
  const router = useRouter();
  useEffect(() => {
    axiosInstance
      .get("/announcement")
      .then((response) => {
        const fetchedEvents = response.data;
        setAnnouncements(fetchedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        if (error.response.status === 401) {
          router.push("/login");
          toast({
            title: "Error",
            description: "Please login to view announcements",
          });
        }
      });
  }, []);
  if (announcements.length === 0) {
    return (
      <ListWrapper heading="Announcements" form={<AnnouncementForm />}>
        <h1 className=" text-5xl text-gray-600 font-semibold">
          No Announcements found
        </h1>
      </ListWrapper>
    );
  }
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
