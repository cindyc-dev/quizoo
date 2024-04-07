import React from "react";

interface PresentationProps {
  params: { gameId: string };
}

export default function Presentation({
  params: { gameId },
}: PresentationProps) {
  return <div>Host</div>;
}
