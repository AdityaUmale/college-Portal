"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarUserInfo from "./SidebarUserInfo";
import { CalendarCheck, RadioTower, Users, Route, Layers3  } from "lucide-react";

const navlinks = [
  { id: 1, icon: <CalendarCheck />, name: "Events", path: "/dashboard" },
  {
    id: 2,
    icon: <RadioTower />,
    name: "Announcements",
    path: "/dashboard/announcements",
  },
  { id: 3, icon: <Users />, name: "Clubs", path: "/dashboard/clubs" },
  { id: 4, icon: <Route />, name: "Roadmaps", path: "https://roadmap.sh" },
  { id: 5, icon: <Layers3 />, name: "PYQ's", path: "/dashboard/pyqs" },
];
const allowedPaths = [
  "/dashboard",
  "/dashboard/announcements",
  "/dashboard/clubs",
  "https://roadmap.sh",
  "/dashboard/pyqs",
];
const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));
  
  if (!isAllowedPath) return null;
  return (
    <div className="bg-gray-800 flex-shrink-0 h-screen flex flex-col justify-between items-center text-white w-64">
      <h1 className="text-3xl border-white border-2 rounded-xl p-3 m-3 font-semibold">
        Manage
      </h1>

      <nav className="w-full h-fit flex gap-2 flex-col justify-center items-center">
        {navlinks.map((link) => (
          <Link
            key={link.id}
            href={link.path}
            className={`flex  w-[80%] p-3 rounded-md font-semibold text-md cursor cursor-pointer item-center ${
              pathname === link.path ? "bg-gray-700" : ""
            }`}
          >
            {link.icon}&nbsp; {link.name}
          </Link>
        ))}
      </nav>
      <SidebarUserInfo />
    </div>
  );
};

export default Sidebar;
