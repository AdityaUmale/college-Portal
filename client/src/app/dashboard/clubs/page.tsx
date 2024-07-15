"use client";

import axiosInstance from "@/axiosInstance";
import ClubComponent from "@/components/ClubComponent";
import ListWrapper from "@/components/ListWrapper";
import { ClubForm } from "@/components/forms/ClubForm";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Club, clubsState } from "../../recoilContextProvider";
import { useRecoilState } from "recoil";

export default function Clubs() {
  const { toast } = useToast();
  const [clubs, setClubs] = useRecoilState(clubsState);
  const router = useRouter();
  useEffect(() => {
    axiosInstance
      .get("/club")
      .then((response) => {
        const fetchedEvents = response.data;
        setClubs(fetchedEvents);
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
  if (clubs.length === 0) {
    return (
      <ListWrapper heading="Clubs" form={<ClubForm />}>
        <h1 className=" text-5xl text-gray-600 font-semibold">
          No Clubs found
        </h1>
      </ListWrapper>
    );
  }
  return (
    <ListWrapper heading="Clubs" form={<ClubForm />}>
      {clubs.map((club, index) => (
        <ClubComponent
          key={index}
          id={club._id}
          name={club.name}
          description={club.description}
          createdBy={club.createdBy}
          strength={club.strength}
          clubHead={club.clubHead}
          username={club.username}
        />
      ))}
    </ListWrapper>
  );
}
