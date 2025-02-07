import React, { useState } from "react";
import { useUnit } from "effector-react";
import { GameInfo } from "../game-info";
import { PlayerStats } from "../player-stats";
import { EventChat } from "../event-chat";
import { $processing } from "@/store/game-init.ts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import "./style.css";

export const Overlay: React.FC = () => {
  const [showStats, setShowStats] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const loading = useUnit($processing);

  return (
    <div className="overlay fade-in">
      {loading && <Spinner />}
      {!loading && (
        <>
          <div className="overlay-content">
            <GameInfo />
            <div className="button-container">
              <Button onClick={() => setShowStats(!showStats)}>
                {showStats ? "Hide" : "Show"} Player Stats
              </Button>
              <Button onClick={() => setShowChat(!showChat)}>
                {showChat ? "Hide" : "Show"} Event Chat
              </Button>
            </div>
            <div className="overlay-player-stats">
              {showStats && <PlayerStats />}
            </div>
          </div>
          {showChat && <EventChat />}
        </>
      )}
    </div>
  );
};
