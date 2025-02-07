import { Overlay } from "./components/overlay";
import { gameInit } from "@/store/game-init.ts";

gameInit();
function App() {
  return <Overlay />;
}

export default App;
