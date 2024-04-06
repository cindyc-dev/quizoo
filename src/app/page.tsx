"use client";

import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageLayout from "~/components/PageLayout";
import QuizooLogo from "~/components/QuizooLogo";
import RoomIdInput from "~/components/RoomIdInput";
import { api } from "~/trpc/react";

export default function Home() {
  const [pusher, setPusher] = useState<Pusher | null>(null);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_PUSHER_APP_KEY ||
      !process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER
    ) {
      console.error("ERROR:");
      toast.error("Failed at creating Pusher instance.");
      return;
    }
    const initializedPusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      },
    );
    Pusher.logToConsole = true;

    setPusher(initializedPusher);

    return () => {
      if (initializedPusher) {
        initializedPusher.disconnect();
      }
    };
  }, []);
  const joinMutation = api.sockets.join.useMutation();

  if (!pusher) {
    return;
  }

  return (
    <PageLayout className="justify-center" isPusherActive={pusher !== null}>
      <QuizooLogo />
      <h1 className="text-primary-content">Quizoo</h1>
      <RoomIdInput
        handleSubmit={async ({ roomId, username }) => {
          const channel = pusher.subscribe(roomId);
          channel.bind("pusher:subscription_succeeded", async () => {
            joinMutation.mutate({
              username,
              roomId,
            });
          });
        }}
      />
    </PageLayout>
  );
}
