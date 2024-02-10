"use client";
import Container from "@/components/Container";
import React, { useState } from "react";
import AuthNavbar from "@/components/AuthNavbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import google from "../../assets/google.png";
import { SignupForm } from "@/components/form/SignupForm";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";

type toastMsgProp = {
  title: string;
  description: string;
};
const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const toastMsg = ({ title, description }: toastMsgProp) => {
    toast({
      title: title,
      description: description,
    });
  };
  return (
    <main className="flex flex-col flex-nowrap select-none  font-sans">
      <Toaster />
      <AuthNavbar page={"signup"} />
      <Container className="overflow-hidden">
        {isLoading && <Loader />}
        <div>
          <h2 className="text-5xl font-semibold mb-4">Signup</h2>
          <h4 className="text-gray-600 mb-4">Hi Welcome👋 </h4>
          <div className="max-w-[350px] flex flex-col gap-4">
            <SignupForm toastMsg={toastMsg} setIsLoading={setIsLoading} />
            <hr className="border-t-[1px] border-solid border-gray-200 h-1 text-center overflow-visible  after:content-['or'] after:relative after:top-[-14px] after:bg-white after:text-gray-400 after:px-1 bg-transparent w-[calc(100%_-_10%)] mx-auto" />
            <Button className="bg-transparent text-gray-600 border-[1px] border-gray-400 rounded-2xl w-full gap-4 items-center justify-center ">
              <Image src={google} width={20} height={20} alt="" />
              Login With Google
            </Button>
            <p className="text-gray-400 text-sm mx-auto">
              Already have an account?{"  "}
              <Link href={`${process.env.APP_URL}/auth/login`}>
                <span className="font-bold text-secondary">Login</span>
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default Page;
