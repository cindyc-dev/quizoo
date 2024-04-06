"use client";

import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageLayout from "~/components/PageLayout";
import QuizooLogo from "~/components/QuizooLogo";
import RoomIdInput from "~/components/RoomIdInput";
import { getPusherEnvVars } from "~/utils/pusherClient";

export default function Home() {
  const router = useRouter();
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    // Initialise Client Pusher
    const { appKey, appCluster } = getPusherEnvVars();
    const initializedPusher = new Pusher(appKey, {
      cluster: appCluster,
    });
    Pusher.logToConsole = true;
    setPusher(initializedPusher);

    return () => {
      // Clean Up Pusher instance when component unmounts
      if (initializedPusher) {
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
      toast.success(
        `Successfully created and connected to ${roomId} as ${username}.`,
      );
      setIsSubscribed(true);
    });
  };

  if (!isSubscribed) {
    return (
      <PageLayout className="justify-center" isPusherActive={pusher !== null}>
        <QuizooLogo />
        <h1 className="text-primary-content">Quizoo</h1>
        <RoomIdInput handleSubmit={handleSubmit} />
      </PageLayout>
    );
  }
  return (
    <PageLayout className="justify-center" isPusherActive={pusher !== null}>
      <p>Waiting...</p>
    </PageLayout>
  );
}
