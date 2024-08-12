"use client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { classroomState, Classroom } from "../../../recoilContextProvider";
import axiosInstance from "@/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic'

const ClassroomComponent = dynamic(() => import('@/components/ClassroomComponent'), {
  ssr: false,
})



export default function ClassroomPage({ params }: { params: { classroomId: string } }) {
  const { classroomId } = params;
  const [classrooms, setClassrooms] = useRecoilState(classroomState);
  const classroom = classrooms.find(c => c._id === classroomId);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!classroom) {
      axiosInstance.get(`/classroom/${classroomId}`)
        .then((response) => {
          setClassrooms(oldClassrooms => [...oldClassrooms, response.data]);
        })
        .catch((error) => {
          console.error("Error fetching classroom:", error);
          if (error.response?.status === 401) {
            router.push("/login");
            toast({
              title: "Error",
              description: "Please login to view this classroom",
            });
          }
        });
    }
  }, [classroomId, classroom, setClassrooms, router, toast]);

  if (!classroom) {
    return <div>Loading...</div>;
  }

  const updateClassroom = (updatedClassroom: Classroom) => {
    setClassrooms(oldClassrooms => oldClassrooms.map(c => c._id === updatedClassroom._id ? updatedClassroom : c));
  };

  return (
    <div className="p-4 w-full">
      <ClassroomComponent
        {...classroom}
        id={classroom._id}
        updateClassroom={updateClassroom}
      />
    </div>
  );
}