"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/axiosInstance";
import { useSetRecoilState } from "recoil";
import { eventsState } from "@/app/recoilContextProvider";

const formSchema = z.object({
  Title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  Description: z.string().min(3, {
    message: "Description should be at least 3 characters",
  }),
  Link: z.string().url(),
});

export function EventForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Title: "",
      Description: "",
      Link: "",
    },
  });
  const setEvent = useSetRecoilState(eventsState);
  function onSubmit(values: z.infer<typeof formSchema>) {
    axiosInstance
      .post("/event/create", {
        title: values.Title,
        description: values.Description,
        link: values.Link,
      })
      .then((response) => {
        setEvent((oldEvents) => [...oldEvents, response.data.event]);
      })
      .catch((error) => {
        console.error(error);
      });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription>Write the title of Event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>
                Write the description of your Event.{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="Link" {...field} />
              </FormControl>
              <FormDescription>
                Write the Link of Event for people to join.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
