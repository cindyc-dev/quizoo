"use client";

import { columns } from "./columns";
import React, { Suspense, useEffect, useState } from "react";
import { FaArrowRightToBracket } from "react-icons/fa6";
import PageLayout from "~/components/PageLayout";
import { Button } from "~/components/ui/button";
import { Indicator } from "~/components/ui/indicator";
import { generateGamePin } from "~/utils/gamePin";
import Pusher from "pusher-js";
import type * as PusherTypes from "pusher-js";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { getPusherEnvVars } from "~/utils/pusherClient";
import { api } from "~/trpc/react";
import { IoReload } from "react-icons/io5";
import { DataTable } from "./data-table";
import { cards } from "./columns";
import { type PlayerJoinLeaveEvent } from "~/types/pusherEvents";
import { Badge } from "~/components/ui/badge";

export default function Create() {
  const query = useSearchParams();
  const router = useRouter();
  const gameId = query.get("gameId");

  const [isOnline, setIsOnline] = useState(false);

  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channel, setChannel] = useState<PusherTypes.Channel | null>(null);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [players, setPlayers] = useState<string[]>([]);

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

  const channelInfoMutation = api.sockets.getChannelInfo.useMutation();
  const getPlayerCount = () => {
    if (gameId) {
      channelInfoMutation.mutate(
        { gameId },
        {
          onSuccess: (data) => {
            if (data) {
              const { subscription_count } = data;
              setPlayerCount(subscription_count);
            }
          },
          onError: (error) => {
            console.error(error);
            toast.error(`Error while fetching number of players in game.`);
          },
        },
      );
    }
  };

  // Fetch Channel Info
  useEffect(() => {
    getPlayerCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to GameId
  useEffect(() => {
    if (pusher && gameId) {
      const channel = pusher.subscribe(gameId);
      setChannel(channel);
      channel.bind("pusher:subscription_succeeded", () => {
        setIsOnline(true);
        toast.success(`Successfully created and connected to ${gameId}`);
      });

      channel.bind("player-joined", (data: PlayerJoinLeaveEvent) => {
        setPlayers((oldState) => [...oldState, data.username]);
        toast(`Player ${data.username} has joined`);
      });

      channel.bind("player-left", (data: PlayerJoinLeaveEvent) => {
        const newState = [...players].filter((p) => p !== data.username);
        toast(`Player ${data.username} has left.`);
        setPlayers([...newState]);
      });
    }
  }, [gameId, pusher]);

  if (!pusher) {
    return (
      <Suspense>
        <PageLayout>
          <div>
            We were unable to connect to Pusher. Please refresh the page and try
            again :(
          </div>
        </PageLayout>
      </Suspense>
    );
  }

  const handleCreate = () => {
    const newGameId = generateGamePin();
    router.push(`create?gameId=${newGameId}`);
  };

  const data = cards;

  return (
    <Suspense>
      <PageLayout isPusherActive={pusher !== null} className="bg-[#191733]">
        <div className="flex items-center justify-center gap-2 align-middle">
          <h1 className="m-0 mb-4 text-primary-content">
            {gameId ? `#${gameId}` : "Create Game"}
          </h1>
          {gameId && <Indicator variant={isOnline ? "online" : "offline"} />}
        </div>
        {!channel && (
          <Button
            type="submit"
            className="my-4 flex w-full max-w-sm justify-items-center gap-2 align-middle text-white"
            variant="animatedGradient"
            onClick={handleCreate}
          >
            Create Game
            <FaArrowRightToBracket />
          </Button>
        )}

        {/* Player Count and Players */}
        {channel && (
          <>
            <div className="flex items-center justify-center gap-4 text-xs">
              {channelInfoMutation.isPending ? (
                <p>Reloading Player Count...</p>
              ) : (
                <>
                  <p>Players in Game: {Math.max(playerCount - 1, 0)}</p>
                  <Button
                    onClick={() => {
                      getPlayerCount();
                    }}
                    variant="link"
                  >
                    <IoReload />
                  </Button>
                </>
              )}
            </div>
            <div className="mb-4">
              <h3 className="mt-2 text-white">Joined Players</h3>
              {players.length > 0 ? (
                players.map((player) => <Badge key={player}>{player}</Badge>)
              ) : (
                <p>No players have joined yet.</p>
              )}
            </div>
          </>
        )}

        <DataTable columns={columns} data={data} />
      </PageLayout>
    </Suspense>
  );
}
