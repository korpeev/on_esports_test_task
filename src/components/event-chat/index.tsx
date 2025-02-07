import { useUnit } from "effector-react";
import * as gameEventsModel from "@/store/game-events.ts";
import "./style.css";

export const EventChat = () => {
  const [events] = useUnit([gameEventsModel.$events]);

  return (
    <div className="event-chat fade-in">
      <h3>Game Events</h3>
      <div className="event-list">
        {events.map((event, index) => (
          <div key={index} className={`event-item ${event.type}`}>
            <span className="event-time">
              {event.timestamp.toLocaleTimeString()}
            </span>
            <span className="event-message">{event.data.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
