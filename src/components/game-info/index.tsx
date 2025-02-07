import { useUnit } from "effector-react";
import * as gameRoundModel from "@/store/game-round.ts";
import * as gameInitModel from "@/store/game-init.ts";
import "./style.css";

export const GameInfo = () => {
  const [round, timer, isOver, gameInfo, players] = useUnit([
    gameRoundModel.$round,
    gameRoundModel.$roundTimer,
    gameRoundModel.$gameIsOver,
    gameInitModel.$gameStartInfo,
    gameInitModel.$players,
  ]);
  return (
    <div className="game-info fade-in">
      <div className={"game-info-title"}>{gameInfo?.name}</div>
      {isOver && <div className="game-info-title">Game is ended</div>}
      {!isOver && (
        <div className={`round-timer ${timer <= 3 ? "pulse" : ""}`}>
          round: {round} time: {timer}s
        </div>
      )}
      <div className="score">
        CT: {players.ct.score} - T: {players.t.score}
      </div>
    </div>
  );
};
