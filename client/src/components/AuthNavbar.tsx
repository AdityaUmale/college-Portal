// constants.js

// AuthNavbar.js
import Image from "next/image";
import logo from "../assets/logo.png";
import { Button } from "./ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";



type NavbarProps = {
  page: string;
};

type AuthTableProps = {
  name: string;
  href: string;
};

const authTabs: AuthTableProps[] = [
  {
    name: "Home",
    href: `${process.env.APP_URL}`,
  },
  {
    name: "Login",
    href: `/login`,
  },
];

const AuthNavbar = ({ page }: NavbarProps) => {
  return <NavBar tabs={page === "signup" ? authTabs : [...authTabs.slice(0, 1), { name: "Signup", href: `/signup` }]} />;
};

type NavBarProps = {
  tabs: AuthTableProps[];
};

const NavBar = ({ tabs }: NavBarProps) => {
  return (
    <nav className="h-[70px] bg-transparent flex w-full items-center justify-between px-8 lg:px-14">
      <Image src={logo} width={200} height={50} objectFit="fit" alt="logo" />
      <div className="hidden lg:flex justify-between items-center gap-10">
        {tabs.map((tab, i) => (
          <Link key={i} href={tab.href}>            
            <Button variant={tab.name === "Home" ? "outline" : "default"} className="py-1 px-6  text-base h-fit border-[1px] border-accent rounded-xl w-[130px] flex gap-2">
             {
                tab.name === "Home" ?  tab.name : (
                  <>
                  <LogIn size={20} className="" /> {tab.name}
                  </>    
                )
             }
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AuthNavbar;
