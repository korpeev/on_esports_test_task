import { EventMessages, EventType } from "@/types";

export const ROUNDS_TO_WIN = 3;
export const ROUND_TIMER = 10;
export const EVENT_NAMES = [
  EventType.PLAYER_ASSIST,
  EventType.PLAYER_KILL,
  EventType.PLAYER_DEATH,
] as const;

export const EVENT_MESSAGES: EventMessages = {
  [EventType.PLAYER_KILL]: (producer, consumer) =>
    `${producer?.nickname} kill ${consumer?.nickname}`,
  [EventType.PLAYER_ASSIST]: (producer, consumer) =>
    `${producer?.nickname} assist by kill ${consumer?.nickname}`,
  [EventType.PLAYER_DEATH]: (producer, consumer) =>
    `${producer?.nickname} dead by ${consumer?.nickname}`,
};

export const PLAYERS_INITIAL_STATE = {
  t: {
    score: 0,
    players: [],
  },
  ct: {
    score: 0,
    players: [],
  },
};
