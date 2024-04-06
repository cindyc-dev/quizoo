"use client";

import React, { useEffect, useState } from "react";
import { FaArrowRightToBracket } from "react-icons/fa6";
import PageLayout from "~/components/PageLayout";
import { Button } from "~/components/ui/button";
import { Indicator } from "~/components/ui/indicator";
import { generateGamePin } from "~/utils/gamePin";
import Pusher from "pusher-js";
import type * as PusherTypes from "pusher-js";
import { toast } from "sonner";
import { type PlayerJoinedEvent } from "~/types/pusherEvents";

const initialGameState: GameState = {
  gameId: "",
};

interface GameState {
  gameId: string;
}

export default function Create() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channel, setChannel] = useState<PusherTypes.Channel | null>(null);
  const [players, setPlayers] = useState<PlayerJoinedEvent[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("gameState");
    console.log({ storedData });
    if (storedData) {
      setGameState(JSON.parse(storedData) as GameState);
    } else {
      setGameState(initialGameState);
    }
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(gameState) !== JSON.stringify(initialGameState) &&
      gameState !== null
    ) {
      localStorage.setItem("gameState", JSON.stringify(gameState));
    }
  }, [gameState]);

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

  if (!pusher) {
    return (
      <PageLayout>
        <div>
          We were unable to connect to Pusher. Please refresh the page and try
          again :(
        </div>
      </PageLayout>
    );
  }

  const handleCreate = () => {
    const newGameId = generateGamePin();
    setGameState({
      gameId: newGameId,
    });

    const channel = pusher.subscribe(newGameId);
    setChannel(channel);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Successfully Connected to game");
      setIsOnline(true);
      toast.success(`Successfully created and connected to ${newGameId}`);
    });

    channel.bind("player-joined", (data: PlayerJoinedEvent) => {
      console.log(`Player ${data.username} has joined`);
      setPlayers((oldState) => [...oldState, data]);
    });
  };

  // console.log(pusher);

  return (
    <PageLayout isPusherActive={pusher !== null}>
      <h1 className="text-primary-content">Create Game</h1>
      {!channel && (
        <Button
          type="submit"
          className="flex w-full max-w-sm justify-items-center gap-2 align-middle text-white"
          variant="animatedGradient"
          onClick={handleCreate}
        >
          Create Game
          <FaArrowRightToBracket />
        </Button>
      )}
      {channel && gameState?.gameId && (
        <div className="flex items-center justify-center gap-2">
          <p>Game ID: {gameState.gameId}</p>
          <Indicator variant={isOnline ? "online" : "offline"} />
        </div>
      )}
      {JSON.stringify(players)}
    </PageLayout>
  );
}
