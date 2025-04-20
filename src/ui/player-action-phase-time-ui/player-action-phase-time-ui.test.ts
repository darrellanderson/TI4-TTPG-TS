import { PlayerActionPhaseTimeUI } from "./player-action-phase-time-ui";

it("constructor/destroy", () => {
  const scale: number = 1;
  const playerActionPhaseTimeUI: PlayerActionPhaseTimeUI =
    new PlayerActionPhaseTimeUI(scale);
  expect(playerActionPhaseTimeUI).toBeDefined();
  playerActionPhaseTimeUI.destroy();
});
