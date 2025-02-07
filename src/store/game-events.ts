import { EventType, GameEvent, Player } from "@/types";
import { createStore, sample } from "effector";
import * as gameRoundModel from "./game-round";
import * as gameInitModel from "./game-init";
import { not } from "patronum";
import {
  calculateMVP,
  generateEvents,
  generateUserEvent,
  updatePlayerStats,
  updateWinScore,
} from "@/store/libs";

const $events = createStore<GameEvent[]>([]);

sample({
  clock: gameRoundModel.roundStarted,
  source: { round: gameRoundModel.$round, events: $events },
  filter: not(gameRoundModel.$gameIsOver),
  fn: ({ round, events }) => [
    ...events,
    generateEvents(EventType.ROUND_START, {
      message: `${round} round started`,
      consumer: null,
      producer: null,
    }),
  ],
  target: $events,
});

sample({
  clock: gameRoundModel.roundEnded,
  source: { round: gameRoundModel.$round, events: $events },
  filter: not(gameRoundModel.$gameIsOver),
  fn: ({ round, events }) => [
    ...events,
    generateEvents(EventType.ROUND_END, {
      message: `${round} round ended`,
      consumer: null,
      producer: null,
    }),
  ],
  target: $events,
});

sample({
  clock: gameRoundModel.roundEnded,
  source: gameInitModel.$players,
  fn: players => ({
    t: {
      score: players.t.score,
      players: players.t.players.map(p => ({ ...p, isDead: false })),
    },
    ct: {
      score: players.ct.score,
      players: players.ct.players.map(p => ({ ...p, isDead: false })),
    },
  }),
  target: gameInitModel.$players,
});

sample({
  clock: gameRoundModel.$roundTimer,
  source: {
    events: $events,
    players: gameInitModel.$players,
    gameOver: gameRoundModel.$gameIsOver,
  },
  filter: ({ gameOver }) => Math.random() > 0.2 && !gameOver,
  fn: generateUserEvent,
  target: $events,
});

sample({
  clock: gameRoundModel.$roundTimer,
  filter:
    $events.map(event => event.length > 0) &&
    gameRoundModel.$gameIsOver.map(s => !s),
  source: {
    event: $events.map(state => state[state.length - 1]),
    players: gameInitModel.$players,
  },
  fn: ({ event, players }) => updatePlayerStats({ event, players }),
  target: gameInitModel.$players,
});

sample({
  clock: gameRoundModel.roundEnded,
  source: gameInitModel.$players,
  fn: updateWinScore,
  target: gameInitModel.$players,
});

const $tPlayersIsDead = gameInitModel.$players.map(state =>
  state.t.players.every(p => p.isDead),
);
const $ctPlayersIsDead = gameInitModel.$players.map(state =>
  state.ct.players.every(p => p.isDead),
);

sample({
  clock: $tPlayersIsDead,
  source: gameInitModel.$players,
  filter:
    gameRoundModel.$roundTimer.map(t => t > 0) &&
    gameRoundModel.$round.map(r => r > 1),
  fn: players => {
    return {
      ...players,
      ct: {
        ...players.ct,
        score: players.ct.score + 1,
      },
    };
  },
  target: gameInitModel.$players,
});

sample({
  clock: $ctPlayersIsDead,
  source: gameInitModel.$players,
  filter:
    gameRoundModel.$roundTimer.map(t => t > 0) &&
    gameRoundModel.$round.map(r => r > 1),
  fn: players => {
    return {
      ...players,
      t: {
        ...players.t,
        score: players.t.score + 1,
      },
    };
  },
  target: gameInitModel.$players,
});

const mvpPlayerReceived = sample({
  clock: gameRoundModel.$gameIsOver,
  source: gameInitModel.$players,
  filter: (_, isOver) => isOver,
  fn: calculateMVP,
});

sample({
  clock: mvpPlayerReceived,
  source: $events,
  filter: (_, player): player is Player => !!player,
  fn: (events, player) => [
    ...events,
    generateEvents(EventType.MVP, {
      message: `MVP player on game: ${player?.nickname}`,
      consumer: null,
      producer: null,
    }),
  ],
  target: $events,
});

const winnerReceived = sample({
  clock: gameRoundModel.$gameIsOver,
  source: gameInitModel.$players,
  filter: (_, isOver) => isOver,
  fn: players => {
    return players.ct.score === players.t.score
      ? "TIE"
      : players.ct.score > players.t.score
        ? "WINNER: CT SIDE"
        : "WINNER: T SIDE";
  },
});

sample({
  clock: winnerReceived,
  source: $events,
  fn: (events, message) => [
    ...events,
    generateEvents(EventType.MVP, {
      message,
      consumer: null,
      producer: null,
    }),
  ],
  target: $events,
});

export { $events };
