"use client";

import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import PageLayout from "~/components/PageLayout";
import QuizooLogo from "~/components/QuizooLogo";
import RoomIdInput from "~/components/RoomIdInput";
import { api } from "~/trpc/react";
import { getPusherEnvVars } from "~/utils/pusherClient";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const router = useRouter();
  const query = useSearchParams();
  const roomId = query.get("roomId");
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const leaveMutation = api.sockets.playerLeave.useMutation();
  const joinMutation = api.sockets.playerJoin.useMutation();
  const emoteMutation = api.sockets.playerEmote.useMutation();

  useEffect(() => {
    // Initialise Client Pusher
    const { appKey, appCluster } = getPusherEnvVars();
    const initializedPusher = new Pusher(appKey, {
      cluster: appCluster,
    });
    Pusher.logToConsole = true;
    setPusher(initializedPusher);

    return () => {
      // TODO #debug - I have to idea if this is running lol; Pusher still disconnects when all of this is commented out; but it does prevent double connections (during development)
      // Trigger Leave
      if (initializedPusher) {
        leaveMutation.mutate({
          username,
          gameId: roomId!,
        });

        // Clean Up Pusher instance when component unmounts
        initializedPusher.unbind_all();
        initializedPusher.disconnect();
      }
    };
  }, []);

  if (!pusher) {
    return;
  }

  /** Set roomId to search param, username to local storage and subscribe to channel */
  const handleSubmit = ({
    roomId,
    username,
  }: {
    // TODO pretty sure react-form-hooks has types for their `handleSubmit` functions
    roomId: string;
    username: string;
  }) => {
    router.push(`?roomId=${roomId}`);
    localStorage.setItem("username", username);

    const channel = pusher.subscribe(roomId);
    channel.bind("pusher:subscription_succeeded", async () => {
      joinMutation.mutate(
        {
          username,
          gameId: roomId,
        },
        {
          onSuccess: (response) => {
            console.log({ joinResponse: response });
            if (response) {
              toast.success(
                `Successfully joined and connected to ${roomId} as ${username}.`,
              );
            } else {
              toast.error(
                `An error occured when trying to join ${roomId} as ${username}.`,
              );
            }
          },
        },
      );

      setIsSubscribed(true);
    });
    setUsername(username);
  };

  const handleEmote = (emote: string) => {
    emoteMutation.mutate({
      gameId: roomId!,
      username,
      emote,
    });
  };

  if (!isSubscribed) {
    return (
      <PageLayout className="justify-center" isPusherActive={pusher !== null}>
        <QuizooLogo />
        <h1 className="text-primary-content">Quizoo</h1>
        <Suspense>
          <RoomIdInput handleSubmit={handleSubmit} />
        </Suspense>
      </PageLayout>
    );
  }
  return (
    <PageLayout className="justify-center" isPusherActive={pusher !== null}>
      <p>Waiting...</p>
      <Button onClick={() => handleEmote("😄")}>Send Emote 😄</Button>
    </PageLayout>
  );
}
