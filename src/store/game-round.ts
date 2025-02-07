import { createEvent, createStore, sample } from "effector";
import { ROUND_TIMER, ROUNDS_TO_WIN } from "@/store/constants.ts";
import { interval, not, delay } from "patronum";
import { $gameIsReady } from "@/store/game-init.ts";

const roundStarted = createEvent();
const roundEnded = createEvent();

const $roundTimer = createStore(ROUND_TIMER).reset(roundEnded);
const $round = createStore(0);

const $roundTimerIsOver = $roundTimer.map(timer => timer <= 0);
const $gameIsOver = $round.map(round => round === ROUNDS_TO_WIN);

sample({
  clock: roundStarted,
  source: $round,
  fn: round => round + 1,
  target: $round,
});

sample({
  clock: $gameIsReady,
  filter: isReady => isReady,
  target: roundStarted,
});

const { tick } = interval({
  start: roundStarted,
  stop: roundEnded,
  timeout: 1000,
});

sample({
  clock: tick,
  source: $roundTimer,
  fn: timer => timer - 1,
  target: $roundTimer,
});

sample({
  clock: $roundTimerIsOver,
  target: roundEnded,
});

delay({
  source: sample({
    clock: roundEnded,
    filter: not($gameIsOver),
  }),
  timeout: 500,
  target: roundStarted,
});

export { $roundTimer, $round, roundEnded, $gameIsOver, roundStarted };
