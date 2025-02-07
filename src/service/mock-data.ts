import { faker } from "@faker-js/faker";
import { GameStartInfo, Player, Players } from "@/types";

const generateGameInfoStart = (): GameStartInfo => {
  return {
    id: faker.database.mongodbObjectId(),
    is_running: !!faker.helpers.rangeToNumber({ min: 0, max: 1 }),
    name: "CS 2",
  };
};

const generatePlayer = (side: "T" | "CT"): Player => ({
  id: faker.database.mongodbObjectId(),
  nickname: faker.internet.username(),
  kills: 0,
  assists: 0,
  deaths: 0,
  side,
  isDead: false,
  mvp: 0,
});

const generatePlayers = (): Players => {
  const ctPlayers = Array.from({ length: 5 }, () => generatePlayer("CT"));
  const tPlayers = Array.from({ length: 5 }, () => generatePlayer("T"));
  return {
    ct: {
      players: ctPlayers,
      score: 0,
    },
    t: {
      score: 0,
      players: tPlayers,
    },
  };
};

export { generateGameInfoStart, generatePlayers };
