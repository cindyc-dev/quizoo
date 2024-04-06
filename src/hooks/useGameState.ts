import { useState } from "react";

export const initialGameState: GameState = {
  gameId: "",
};

interface GameState {
  gameId: string;
}

type UpdateStateFn = (newState: GameState) => void;

function useGameState(
  initialStateKey: string,
  initialData: GameState,
): [GameState, UpdateStateFn] {
  // Initialize state with data from localStorage if available
  const [state, setState] = useState<GameState>(() => {
    const storedData = localStorage.getItem(initialStateKey);
    return storedData ? (JSON.parse(storedData) as GameState) : initialData;
  });

  // Function to update the state and localStorage
  const updateState = (newState: GameState) => {
    setState(newState);
    localStorage.setItem(initialStateKey, JSON.stringify(newState));
  };

  return [state, updateState];
}

export default useGameState;
