"use client"

import Dexie, { type Table } from "dexie";
import { type Card } from "./columns";

export class MySubClassedDexie extends Dexie {
  cards!: Table<Card>;

  constructor() {
    super("myDatabase");
    this.version(1).stores({
      cards: "++id, type, text, answerOptions, timeLimit, correctAnswer",
    });
  }
}

export const db = new MySubClassedDexie();
