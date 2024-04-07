"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { LuTextCursorInput } from "react-icons/lu";
import { RiCheckboxMultipleFill } from "react-icons/ri";
import { FaInfoCircle } from "react-icons/fa";

// TODO #code-cleanup this card type shit up lol - I'm trying to satisfy both Zod and Typescript without having to change multiple things when adding new card types
// Being used for card dropdown options
export const CARD_TYPE = [
  "MCQ",
  "Type",
  "Slide",
  // ... new card types here (and then add them below...)
];
// Used to render card dropdown options
export const CARD_RENDER: Record<CardType, React.ReactNode> = {
  MCQ: (
    <span className="flex items-center gap-2">
      <RiCheckboxMultipleFill /> Multiple Choice Question
    </span>
  ),
  Type: (
    <span className="flex items-center gap-2">
      <LuTextCursorInput />
      Type-it-out
    </span>
  ),
  Slide: (
    <span className="flex items-center gap-2">
      <FaInfoCircle /> Information Slide
    </span>
  ),
};
// For card "type" field validation
export const ZodCardTypeEnum = z.enum(
  CARD_TYPE as unknown as readonly [string, ...string[]],
);
export const MUST_HAVE_ANSWER_CARD_TYPES: CardType[] = ["MCQ", "Type"];
// For TypeScript
export type CardType = z.infer<typeof ZodCardTypeEnum>;

export type Card = {
  id: string;
  type: CardType;
  text: string;
  answerOptions?: string[];
  timeLimit?: number;
  correctAnswer?: string[] | number[];
};

export const columns: ColumnDef<Card>[] = [
  {
    accessorKey: "text",
    header: "Question/Text",
  },
  {
    accessorKey: "answerOptions",
    header: "Answer Options",
    cell: ({ row }) => {
      return <div></div>;
    },
  },
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
    id: "728ed52f",
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
    id: "1210jf02",
    type: "Type",
    text: "Assume that seq is a list. Write one line of code to sort seq in-place (ie. mutate the list).",
    timeLimit: 60,
    correctAnswer: ["seq.sort()"],
  },
  {
    id: "489e1d42",
    type: "MCQ",
    text: "You cannot index sets because ordinary sets do not preserve the order in which we insert the elements",
    answerOptions: ["True", "False"],
    timeLimit: 30,
    correctAnswer: ["True"],
  },
];
