import {
  createEffect,
  createEvent,
  createStore,
  sample,
  combine,
} from "effector";
import { api } from "@/service/api";
import { GameStartInfo, Players } from "@/types";
import { pending } from "patronum";
import { PLAYERS_INITIAL_STATE } from "@/store/constants.ts";

const gameInit = createEvent();

const $gameStartInfo = createStore<GameStartInfo | null>(null);
const $players = createStore<Players>(PLAYERS_INITIAL_STATE);
const $gameIsReady = combine(
  $players,
  $gameStartInfo,
  (players, gameStartInfo) => {
    return (
      !!players.ct.players.length &&
      !!players.t.players.length &&
      !!gameStartInfo
    );
  },
);

const fetchGameStartInfoFx = createEffect<void, GameStartInfo>(async () => {
  return await api.getGameInfo();
});

const fetchPlayerFx = createEffect(async () => {
  return await api.getPlayers();
});

sample({
  clock: gameInit,
  target: [fetchGameStartInfoFx, fetchPlayerFx],
});

sample({
  clock: fetchGameStartInfoFx.doneData,
  target: $gameStartInfo,
});

sample({
  clock: fetchPlayerFx.doneData,
  target: $players,
});

const $processing = pending([fetchGameStartInfoFx, fetchPlayerFx]);

export { $gameStartInfo, $players, gameInit, $gameIsReady, $processing };
