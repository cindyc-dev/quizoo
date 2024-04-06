"use server";

import { type Response } from "pusher";
import type Pusher from "pusher-js";
import { type PlayerJoinedEvent } from "~/types/pusherEvents";
import { pusherServer } from "~/utils/pusherServer";

export const handleJoin = async (
  roomId: string,
  username: string,
  pusher: Pusher,
): Promise<Response> => {
  "use server";

  console.log("Sending Player Joined Event");

  const joinEvent: PlayerJoinedEvent = {
    username,
    time: new Date(),
  };
  console.log(pusherServer);

  return pusherServer.trigger(roomId, "player-joined", joinEvent);
};
