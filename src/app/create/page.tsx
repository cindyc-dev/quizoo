"use client";

import React, { useState } from "react";
import { FaArrowRightToBracket } from "react-icons/fa6";
import PageLayout from "~/components/PageLayout";
import RoomIdInput from "~/components/RoomIdInput";
import { Button } from "~/components/ui/button";
import { generateGamePin } from "~/utils/gamePin";

export default function Create() {
  const [gameId, setGameId] = useState("");
  const handleCreate = () => {
    const newGameId = generateGamePin();
    console.log({ newGameId });
    setGameId(newGameId);
  };

  return (
    <PageLayout>
      <h1 className="text-primary-content">Create Game</h1>
      {!gameId && (
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
      {gameId && <p>Game ID: {gameId}</p>}
    </PageLayout>
  );
}
