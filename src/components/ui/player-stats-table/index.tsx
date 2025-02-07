import { Player } from "@/types";
import "./style.css";

interface PlayerStatsTableProps {
  players: Player[];
}

export const PlayerStatsTable = ({ players }: PlayerStatsTableProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>K</th>
          <th>D</th>
          <th>A</th>
        </tr>
      </thead>
      <tbody>
        {players.map(player => (
          <tr key={player.id} className={player.isDead ? "dead" : ""}>
            <td>{player.nickname}</td>
            <td>{player.kills}</td>
            <td>{player.deaths}</td>
            <td>{player.assists}</td>
          </tr>
        ))}
        <tr>
          <td />
          <td />
          <td />
          <td />
        </tr>
      </tbody>
    </table>
  );
};
