import { EventType, GameEvent, GameEventData, Player, Players } from "@/types";
import { EVENT_MESSAGES, EVENT_NAMES } from "../constants.ts";

type GenerateUserEventPayload = {
  events: GameEvent[];
  players: Players;
};

type UpdatePlayerStatsPayload = {
  event: GameEvent;
  players: Players;
};

const generateRandomIndex = (index: number) =>
  Math.floor(Math.random() * index);

const updateRandomPlayerStatsByField = (
  player: Player,
  players: Player[],
  field:
    | EventType.PLAYER_KILL
    | EventType.PLAYER_DEATH
    | EventType.PLAYER_ASSIST,
) => {
  return players.map(targetPlayer => {
    if (targetPlayer.id === player.id) {
      return {
        ...player,
        isDead: field === EventType.PLAYER_DEATH || player.isDead,
        [field]: (player[field] || 0) + 1,
      };
    }
    return targetPlayer;
  });
};

const getPairPlayer = (players: Players) => {
  const playerRandomIndex = generateRandomIndex(players.ct.players.length - 1);
  const playerCT = players.ct.players[playerRandomIndex];
  const playerT = players.t.players[playerRandomIndex];

  return {
    playerCT,
    playerT,
  };
};

export const generateEvents = (type: EventType, data: GameEventData) => ({
  type,
  data,
  timestamp: new Date(),
});

export const generateUserEvent = ({
  events,
  players,
}: GenerateUserEventPayload) => {
  const eventRandomIndex = generateRandomIndex(EVENT_NAMES.length - 1);
  const { playerCT, playerT } = getPairPlayer(players);
  const eventProducer = Math.random() > 0.5 ? playerCT : playerT;
  const eventConsumer = eventProducer.side === "CT" ? playerT : playerCT;

  if (eventProducer.isDead || eventConsumer.isDead) return events;

  const currentEventType = EVENT_NAMES[eventRandomIndex];
  const message = EVENT_MESSAGES[currentEventType](
    eventProducer,
    eventConsumer,
  );

  const newEvents = [
    ...events,
    generateEvents(currentEventType, {
      message,
      consumer: eventConsumer,
      producer: eventProducer,
    }),
  ];

  if (currentEventType === EventType.PLAYER_ASSIST) {
    const allyPlayers =
      eventProducer.side === "CT" ? players.ct.players : players.t.players;
    const killer =
      allyPlayers.find(p => p.id !== eventProducer.id && !p.isDead) ||
      eventProducer;

    if (!killer.isDead) {
      const killMessage = EVENT_MESSAGES[EventType.PLAYER_KILL](
        killer,
        eventConsumer,
      );
      newEvents.push(
        generateEvents(EventType.PLAYER_KILL, {
          message: killMessage,
          consumer: eventConsumer,
          producer: killer,
        }),
      );
    }
  }

  return newEvents;
};

export const updatePlayerStats = ({
  event,
  players,
}: UpdatePlayerStatsPayload): Players => {
  if (
    !event ||
    !event.data.producer ||
    !event.data.consumer ||
    event.data.consumer.isDead
  )
    return players;

  const { producer, consumer } = event.data;
  const { ct, t } = players;
  const statField =
    event.type === EventType.PLAYER_KILL
      ? EventType.PLAYER_KILL
      : EventType.PLAYER_ASSIST;

  return {
    ct: {
      score: players.ct.score,
      players:
        producer.side === "CT"
          ? updateRandomPlayerStatsByField(producer, ct.players, statField)
          : updateRandomPlayerStatsByField(
              consumer,
              ct.players,
              EventType.PLAYER_DEATH,
            ),
    },
    t: {
      score: players.t.score,
      players:
        producer.side === "T"
          ? updateRandomPlayerStatsByField(producer, t.players, statField)
          : updateRandomPlayerStatsByField(
              consumer,
              t.players,
              EventType.PLAYER_DEATH,
            ),
    },
  };
};

export const updateWinScore = (players: Players) => {
  const { ct, t } = players;

  const TAlivePlayers = t.players.filter(p => !p.isDead);
  const CTAlivePlayers = ct.players.filter(p => !p.isDead);

  return {
    ct: {
      ...ct,
      score:
        CTAlivePlayers.length >= TAlivePlayers.length ? ct.score + 1 : ct.score,
    },
    t: {
      ...t,
      score:
        TAlivePlayers.length > CTAlivePlayers.length ? t.score + 1 : t.score,
    },
  };
};

export const calculateMVP = (players: Players): Player | null => {
  if (!players.t.players.length && !players.ct.players.length) {
    return null;
  }

  const winnerTeamPlayers =
    players.t.score > players.ct.score
      ? players.t.players
      : players.t.score < players.ct.score
        ? players.ct.players
        : [...players.t.players, ...players.ct.players]; // Если ничья, учитываем всех игроков

  if (!winnerTeamPlayers.length) return null;

  const playerScores = winnerTeamPlayers.map(player => {
    const score = player.kills * 2 + player.assists - (player.deaths + 1); // Чтобы не получить отрицательное число
    return { ...player, score };
  });

  return playerScores.reduce((prev, current) =>
    current.score > prev.score ? current : prev,
  );
};
