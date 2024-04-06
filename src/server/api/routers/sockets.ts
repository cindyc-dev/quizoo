import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { type PlayerJoinedEvent } from "~/types/pusherEvents";
import { pusherServer } from "~/utils/pusherServer";

export const socketsRouter = createTRPCRouter({
  join: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        roomId: z.string().min(1),
      }),
    )
    .mutation((opts) => {
      const { username, roomId } = opts.input;

      const joinEvent: PlayerJoinedEvent = {
        username,
        time: new Date()
      }

      return pusherServer.trigger(roomId, "player-joined", joinEvent);
    }),
});
