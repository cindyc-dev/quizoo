import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { type PlayerJoinLeaveEvent as PlayerJoinLeftEvent } from "~/types/pusherEvents";
import { pusherServer } from "~/utils/pusherServer";
import axios from "axios";
import { env } from "~/env";
import { getHttpUrl } from "~/server/utils/pusherHttp";

interface PusherChannelInfoResponse {
  occupied: boolean;
  subscription_count: number;
}

export const socketsRouter = createTRPCRouter({
  playerJoin: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        gameId: z.string().min(1),
      }),
    )
    .mutation((opts) => {
      const { username, gameId } = opts.input;

      const joinEvent: PlayerJoinLeftEvent = {
        username,
        time: new Date(),
      };

      // TODO check if channel is active

      // TODO change this to use database instead and prevent username clashes
      return pusherServer.trigger(gameId, "player-joined", joinEvent);
    }),
  playerLeave: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        gameId: z.string().min(1),
      }),
    )
    .mutation((opts) => {
      const { username, gameId } = opts.input;
      const leftEvent: PlayerJoinLeftEvent = {
        username,
        time: new Date(),
      };
      return pusherServer.trigger(gameId, "player-left", leftEvent);
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
