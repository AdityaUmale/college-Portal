"use client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { clubsState, Club } from "../../../recoilContextProvider";
import ClubComponent from "@/components/ClubComponent";
import axiosInstance from "@/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function ClubPage({ params }: { params: { clubId: string } }) {
  const { clubId } = params;
  const [clubs, setClubs] = useRecoilState(clubsState);
  const club = clubs.find(c => c._id === clubId);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!club) {
      axiosInstance.get(`/club/${clubId}`)
        .then((response) => {
          setClubs(oldClubs => [...oldClubs, response.data]);
        })
        .catch((error) => {
          console.error("Error fetching club:", error);
          if (error.response?.status === 401) {
            router.push("/login");
            toast({
              title: "Error",
              description: "Please login to view this club",
            });
          }
        });
    }
  }, [clubId, club, setClubs, router, toast]);

  if (!club) {
    return <div>Loading...</div>;
  }

  const updateClub = (updatedClub: Club) => {
    setClubs(oldClubs => oldClubs.map(c => c._id === updatedClub._id ? updatedClub : c));
  };

  return (
    <div className="p-4 w-full">
      <ClubComponent
        {...club}
        id={club._id}
        updateClub={updateClub}
      />
    </div>
  );
}