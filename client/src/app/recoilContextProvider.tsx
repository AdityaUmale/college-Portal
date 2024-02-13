"use client";

import { RecoilRoot, atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    _id: "8",
    name: "Shoaib Akhtar",
    email: "shoaib@gmail.com",
    description: "Description 1",
    role: "staff",
  },
});

export default function RecoidContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
