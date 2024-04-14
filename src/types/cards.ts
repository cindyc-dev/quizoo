import { z } from "zod";

// Being used for card dropdown options
export const CARD_TYPE = [
  "MCQ",
  "Type",
  "Slide",
  // ... new card types here (and then add them below...)
];

// For card "type" field validation
export const ZodCardTypeEnum = z.enum(
  CARD_TYPE as unknown as readonly [string, ...string[]],
);

export const MUST_HAVE_ANSWER_CARD_TYPES: CardType[] = ["MCQ", "Type"];

// For TypeScript
export type CardType = z.infer<typeof ZodCardTypeEnum>;

export interface Card {
  id?: number;
  type: CardType;
  text: string;
  answerOptions?: string[];
  timeLimit?: number;
  correctAnswer?: string[] | number[];
}

export const DEFAULT_CARD: Card = {
  type: "MCQ",
  text: "",
  answerOptions: [""],
  timeLimit: 30,
  correctAnswer: [],
};
