import { Player, world } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer, mockWorld } from "ttpg-mock";

import { AutoStreamerCamera } from "./auto-streamer-camera";
import { System } from "../../system-lib/system/system";
import { TurnOrder } from "ttpg-darrell";

it("constructor/destroy", () => {
  new AutoStreamerCamera("@test/test").destroy();
});

it("events", () => {
  const playerSlot: number = 10;
  const player: Player = new MockPlayer({ slot: playerSlot });
  mockWorld._addPlayer(player);
  expect(world.getPlayerBySlot(10)).toBe(player);

  const autoStreamerCamera: AutoStreamerCamera = new AutoStreamerCamera(
    "@test/test"
  ); // register event listeners

  MockGameObject.simple("token:base/scoreboard"); // to find scoring area
  MockGameObject.simple("tile.system:base/18"); // so system exists

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  if (!system) {
    throw new Error("System not found");
  }

  autoStreamerCamera.addStreamerPlayerSlot(playerSlot);
  expect(autoStreamerCamera.hasStreamerPlayerSlot(playerSlot)).toBe(true);

  const loadedFromState: AutoStreamerCamera = new AutoStreamerCamera(
    "@test/test"
  );
  expect(loadedFromState.hasStreamerPlayerSlot(playerSlot)).toBe(true);

  let eventCount: number = 0;
  TI4.events.onAllPlayersPassed.add(() => {
    eventCount++;
  });

  TI4.events.onAllPlayersPassed.trigger();
  TI4.events.onSystemActivated.trigger(system, player);
  TurnOrder.onTurnStateChanged.trigger(TI4.turnOrder);

  expect(eventCount).toBe(1);

  autoStreamerCamera.removeStreamerPlayerSlot(playerSlot);
  expect(autoStreamerCamera.hasStreamerPlayerSlot(playerSlot)).toBe(false);
  autoStreamerCamera.destroy();
});
