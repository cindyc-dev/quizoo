"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  roomId: z
    .string({
      required_error: "Room ID is required",
    })
    .length(6, {
      message: "The Room ID should have 6 characters",
    }),
});

export default function RoomIdInput() {
  const router = useRouter();
  const query = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: query.get("roomId") ?? "",
    },
  });

  const roomId = query.get("roomId");

  useEffect(() => {
    form.setValue("roomId", roomId ?? "");
  }, [roomId, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if (values.roomId) {
      void router.push(`/join?roomId=${values.roomId}`);
    } else {
      void router.push("/join");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="🏠 Room ID" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Join
        </Button>
      </form>
    </Form>
  );
}
