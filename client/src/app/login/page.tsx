"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axiosInstance from "@/axiosInstance";
import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "../recoilContextProvider";
import { useToast } from "@/components/ui/use-toast";

export default function Component() {
  const router = useRouter();
  const { toast } = useToast();
  const setAuth = useSetRecoilState(userState);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    const formValues: Record<string, string> = {};
    formData.forEach((value, key) => {
      formValues[key] = value.toString();
    });
    try {
      const { data } = await axiosInstance.post("/auth/login", formValues);
      setAuth(data.user);
      if (data && data.token) {
        localStorage.setItem("token", data.token);
      }
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while logging in",
      });
    }
  };

  return (
    <Card className="m-auto max-w-sm">
      <form ref={formRef} onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                required
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" required type="password" />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
            <div
              className="flex justify-end text-sm underline cursor-pointer text-gray-600  items-center"
              onClick={() => router.push("/signup")}
            >
              Don&apos;t have an account? Register
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
