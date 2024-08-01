"use client";

import { RecoilRoot, atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  clubs: string[];
  password: string;
}
export interface Event {
  _id: string;
  title: string;
  description: string;
  link: string;
  createdBy: string;
  username: string;
}
export interface Announcemnt {
  title: string;
  description: string;
  createdBy: string;
  username: string;
}
export interface Club {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  strength: number;
  clubHeads: { _id: string; name: string }[];
  username: string;
  members: { _id: string; name: string }[];
  pendingRequests: { _id: { _id: string; name: string }; name: string }[];
}
export const userState = atom<User>({
  key: "userState",
  default: {
    _id: "",
    name: "",
    email: "",
    role: "",
    clubs: [],
    password: "",
  },
  effects_UNSTABLE: [persistAtom],
});

export const eventsState = atom<Event[]>({
  key: "eventsState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const clubsState = atom<Club[]>({
  key: "clubsState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const announcementsState = atom<Announcemnt[]>({
  key: "announcementsState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default function RecoidContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
