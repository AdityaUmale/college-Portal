"use client";

import axiosInstance from "@/axiosInstance";
import ListWrapper from "@/components/ListWrapper";
import { ClubForm } from "@/components/forms/ClubForm";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Club, clubsState } from "../../recoilContextProvider";
import { useRecoilState } from "recoil";
import Link from "next/link";

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
    <div className="p-4 w-full">
    <ListWrapper heading="Clubs" form={<ClubForm />}>
      {clubs.map((club, index) => (
        <Link href={`/dashboard/clubs/${club._id}`} key={club._id} >
        <div className="border p-4 mb-4 rounded hover:bg-gray-100">
            <h2 className="text-2xl font-semibold">{club.name}</h2>
            <p>{club.description.substring(0, 100)}...</p>
          </div>
        </Link>
      ))}
    </ListWrapper>
    </div>
  );
}

