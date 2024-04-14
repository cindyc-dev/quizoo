"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { TextCursorInput, CopyCheck, Info } from "lucide-react";
import { type Card, type CardType } from "~/types/cards";

// Used to render card dropdown options
export const CARD_RENDER: Record<CardType, React.ReactNode> = {
  MCQ: (
    <span className="flex items-center gap-2">
      <CopyCheck /> Multiple Choice Question
    </span>
  ),
  Type: (
    <span className="flex items-center gap-2">
      <TextCursorInput />
      Type-it-out
    </span>
  ),
  Slide: (
    <span className="flex items-center gap-2">
      <Info /> Information Slide
    </span>
  ),
};

export const columns: ColumnDef<Card>[] = [
  {
    accessorKey: "text",
    header: "Question/Text",
  },
  // {
  //   accessorKey: "answerOptions",
  //   header: "Answer Options",
  //   cell: ({ row }) => {
  //     return <div></div>;
  //   },
  // },
  {
    accessorKey: "correctAnswer",
    header: "Correct Answer",
  },
  {
    accessorKey: "timeLimit",
    header: "Time Limit",
  },
];

export const cards: Card[] = [
  {
    id: 0,
    type: "MCQ",
    text: "Is it always possible to convert a while loop into a for loop and vise versa?",
    answerOptions: [
      "Always possible to convert for loop --> while loop",
      "Always possible to convert while loop --> for loop",
      "NOT always possible to convert for loop --> while loop",
      "NOT always possible to convert while loop --> for loop",
      "NOT possible at all to convert loops either way",
    ],
    timeLimit: 60,
    correctAnswer: [0, 3],
  },
  {
    id: 1,
    type: "Type",
    text: "Assume that seq is a list. Write one line of code to sort seq in-place (ie. mutate the list).",
    timeLimit: 60,
    correctAnswer: ["seq.sort()"],
  },
  {
    id: 2,
    type: "MCQ",
    text: "You cannot index sets because ordinary sets do not preserve the order in which we insert the elements",
    answerOptions: ["True", "False"],
    timeLimit: 30,
    correctAnswer: ["True"],
  },
];
