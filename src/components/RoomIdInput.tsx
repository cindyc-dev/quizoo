"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  roomId: z
    .string()
    .length(6, {
      message: "The Room ID should have 6 characters",
    })
    .min(1),
  username: z.string().min(1),
});

interface RoomIdInputInterface {
  handleSubmit: (values: z.infer<typeof formSchema>) => void;
  buttonText?: string;
}

export default function RoomIdInput({ handleSubmit }: RoomIdInputInterface) {
  const query = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: query.get("roomId") ?? "",
      username: query.get("username") ?? "",
    },
  });

  const { formState } = form;
  const roomId = query.get("roomId");
  const username = query.get("username");

  useEffect(() => {
    form.setValue("roomId", roomId ?? "");
    form.setValue("username", username ?? "");
  }, [roomId, form, username]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="😇 Username" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
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

        <Button
          type="submit"
          className="flex w-full justify-items-center gap-2 align-middle text-white"
          variant="animatedGradient"
          disabled={!formState.isValid}
        >
          Join
          <FaArrowRightToBracket />
        </Button>
      </form>
    </Form>
  );
}
