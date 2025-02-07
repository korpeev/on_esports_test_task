import { useUnit } from "effector-react";
import { $players } from "@/store/game-init.ts";
import { PlayerStatsTable } from "@/components/ui/player-stats-table";
import "./style.css";

export const PlayerStats = () => {
  const players = useUnit($players);

  return (
    <div className="player-stats fade-in">
      <h3>Player Stats</h3>
      <div className="player-stats-container">
        <div className="player-stats-column">
          <span>CT: {players.ct.score}</span>
          <PlayerStatsTable players={players.ct.players} />
        </div>
        <div className="player-stats-column">
          <span>T: {players.t.score}</span>
          <PlayerStatsTable players={players.t.players} />
        </div>
      </div>
    </div>
  );
};
