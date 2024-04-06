"use client";

import React, { useEffect, useState } from "react";
import { FaArrowRightToBracket } from "react-icons/fa6";
import PageLayout from "~/components/PageLayout";
import { Button } from "~/components/ui/button";
import { Indicator } from "~/components/ui/indicator";
import useGameState, { initialGameState } from "~/hooks/useGameState";
import { generateGamePin } from "~/utils/gamePin";

export default function Create() {
  const [gameState, setGameState] = useGameState("gameState", initialGameState);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // TODO Check if currentGameId is still active - reset if no one is in the game
  }, [])

  const handleCreate = () => {
    const newGameId = generateGamePin();
    setGameState({
      gameId: newGameId,
    });
  };

  return (
    <PageLayout>
      <h1 className="text-primary-content">Create Game</h1>
      {!gameState.gameId && (
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
      {gameState.gameId && (
        <div className="flex items-center justify-center gap-2">
          <p>Game ID: {gameState.gameId}</p>
          <Indicator variant={isOnline ? "online" : "offline"} />
        </div>
      )}
    </PageLayout>
  );
}
