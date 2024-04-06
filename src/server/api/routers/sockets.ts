import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { type PlayerJoinedEvent } from "~/types/pusherEvents";
import { pusherServer } from "~/utils/pusherServer";
import axios from "axios";
import { env } from "~/env";
import { getHttpUrl } from "~/server/utils/pusherHttp";

interface PusherChannelInfoResponse {
  occupied: boolean;
  subscription_count: number;
}

export const socketsRouter = createTRPCRouter({
  join: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        gameId: z.string().min(1),
      }),
    )
    .mutation((opts) => {
      const { username, gameId } = opts.input;

      const joinEvent: PlayerJoinedEvent = {
        username,
        time: new Date(),
      };

      return pusherServer.trigger(gameId, "player-joined", joinEvent);
    }),
  getChannelInfo: publicProcedure
    .input(
      z.object({
        gameId: z.string().min(1),
      }),
    )
    .mutation(async (opts) => {
      const { gameId } = opts.input;
      try {
        const url = getHttpUrl({
          requestMethod: "GET",
          requestPath: `/apps/${env.PUSHER_APP_ID}/channels/${gameId}`,
          queryParameters: "info=subscription_count",
        });
        const response = await axios.get<PusherChannelInfoResponse>(url);
        return response.data;
      } catch (error) {
        console.error("Error fetching subscription count:", error);
        return null;
      }
    }),
});
