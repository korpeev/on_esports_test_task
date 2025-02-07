export interface GameStartInfo {
  id: string;
  is_running: boolean;
  name: string;
}

export interface Player {
  id: string;
  nickname: string;
  kills: number;
  deaths: number;
  assists: number;
  side: "T" | "CT";
  isDead: boolean;
  mvp: number;
}

export interface Players {
  t: {
    score: number;
    players: Player[];
  };
  ct: {
    score: number;
    players: Player[];
  };
}

export enum EventType {
  ROUND_START = "round-start",
  ROUND_END = "round-end",
  PLAYER_KILL = "kills",
  PLAYER_DEATH = "deaths",
  PLAYER_ASSIST = "assists",
  MVP = "mvp",
}

export type GameEventData = {
  message: string;
  producer: Player | null;
  consumer: Player | null;
};

export interface GameEvent {
  type: EventType;
  data: GameEventData;
  timestamp: Date;
}

type EventMessagesKey =
  | EventType.PLAYER_KILL
  | EventType.PLAYER_ASSIST
  | EventType.PLAYER_DEATH;
type EventMessagesValue = (
  producer: Player | null,
  consumer: Player | null,
) => string;
export type EventMessages = Record<EventMessagesKey, EventMessagesValue>;
