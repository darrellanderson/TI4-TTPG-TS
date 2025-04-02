import { PlayerSlot } from "ttpg-darrell";
import { OnTurnStateChanged } from "./on-turn-state-changed";

it("constructor/init/destroy", () => {
  const onTurnStateChanged = new OnTurnStateChanged();
  onTurnStateChanged.init();
  onTurnStateChanged.destroy();
});

it("all players passed", () => {
  // Uses global onTurnStateChanged
  const order: Array<PlayerSlot> = [10, 11, 12];
  const direction = "forward";
  const current: PlayerSlot = 10;
  TI4.turnOrder.setTurnOrder(order, direction, current);

  expect(TI4.turnOrder.getPassed(10)).toBe(false);
  expect(TI4.turnOrder.getPassed(11)).toBe(false);
  expect(TI4.turnOrder.getPassed(12)).toBe(false);
  TI4.turnOrder.setPassed(10, true);
  expect(TI4.turnOrder.getPassed(10)).toBe(true);
  expect(TI4.turnOrder.getPassed(11)).toBe(false);
  expect(TI4.turnOrder.getPassed(12)).toBe(false);
  TI4.turnOrder.setPassed(11, true); // all passed, resets passed
  expect(TI4.turnOrder.getPassed(10)).toBe(true);
  expect(TI4.turnOrder.getPassed(11)).toBe(true);
  expect(TI4.turnOrder.getPassed(12)).toBe(false);
  TI4.turnOrder.setPassed(12, true);
  expect(TI4.turnOrder.getPassed(10)).toBe(false);
  expect(TI4.turnOrder.getPassed(11)).toBe(false);
  expect(TI4.turnOrder.getPassed(12)).toBe(false);
});
