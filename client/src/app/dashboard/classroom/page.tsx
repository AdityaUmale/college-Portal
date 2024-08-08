"use client";

import axiosInstance from "@/axiosInstance";
import ListWrapper from "@/components/ListWrapper";
import { ClassroomForm } from "@/components/forms/ClassroomForm";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { classroomState, Club, clubsState } from "../../recoilContextProvider";
import { useRecoilState } from "recoil";
import Link from "next/link";

export default function Classroom() {
  const { toast } = useToast();
  const [classroom, setClassroom] = useRecoilState(classroomState);
  const router = useRouter();

  useEffect(() => {
    axiosInstance
      .get("/classroom")
      .then((response) => {
        const fetchedEvents = response.data;
        setClassroom(fetchedEvents);
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
  if (classroom.length === 0) {
    return (
      <ListWrapper heading="Classroom" form={<ClassroomForm />}>
        <h1 className=" text-5xl text-gray-600 font-semibold">
          No Classroom found
        </h1>
      </ListWrapper>
    );
  }
  return (
    <div className="p-4 w-full">
    <ListWrapper heading="Classroom" form={<ClassroomForm />}>
      {classroom.map((classroom, index) => (
        <Link href={`/dashboard/classroom/${classroom._id}`} key={classroom._id} >
        <div className="border p-4 mb-4 rounded hover:bg-gray-100">
            <h2 className="text-2xl font-semibold">{classroom.name}</h2>
            <p>{classroom.description.substring(0, 100)}...</p>
          </div>
        </Link>
      ))}
    </ListWrapper>
    </div>
  );
}

