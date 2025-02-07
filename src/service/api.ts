import { wait } from "@/utils";
import { generateGameInfoStart, generatePlayers } from "@/service/mock-data.ts";
import { Players } from "@/types";

export const api = {
  async getGameInfo() {
    await wait(2000);
    return generateGameInfoStart();
  },

  async getPlayers(): Promise<Players> {
    await wait(2000);
    return generatePlayers();
  },
};
