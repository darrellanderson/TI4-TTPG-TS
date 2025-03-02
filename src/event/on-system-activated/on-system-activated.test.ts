import { Player } from "@tabletop-playground/api";
import {
  MockCardHolder,
  MockGameObject,
  mockGlobalEvents,
  MockPlayer,
} from "ttpg-mock";
import { OnSystemActivated } from "./on-system-activated";
import { System } from "../../lib/system-lib/system/system";

it("constructor", () => {
  new OnSystemActivated();
});

it("trigger", () => {
  new MockGameObject(); // so an object is present for checking

  new MockGameObject({
    templateMetadata: "tile.system:base/18",
  });

  const commandToken = new MockGameObject({
    templateMetadata: "token.command:my-source/my-faction",
  });

  let triggerCount: number = 0;
  TI4.events.onSystemActivated.add((system, player) => {
    triggerCount++;
    expect(system.getSystemTileNumber()).toBe(18);
    expect(player.getName()).toBe("my-player");
  });

  expect(OnSystemActivated.getLastActivatedSystem()).toBeUndefined();
  expect(OnSystemActivated.getLastActivatingPlayerSlot()).toBeUndefined();
  expect(triggerCount).toBe(0);

  const player = new MockPlayer({ name: "my-player" });
  TI4.turnOrder.setCurrentTurn(player.getSlot());

  const thrown = false;
  commandToken._releaseAsPlayer(player, thrown);

  expect(OnSystemActivated.getLastActivatedSystem()).toBeDefined();
  expect(OnSystemActivated.getLastActivatingPlayerSlot()).toBe(
    player.getSlot()
  );
  expect(triggerCount).toBe(1);

  const now: number = Date.now();
  mockGlobalEvents._tick(0.1); // animation
  jest.useFakeTimers().setSystemTime(now + 100000);
  expect(Date.now()).toBeGreaterThanOrEqual(now + 100000);
  mockGlobalEvents._tick(0.1); // animation done

  // Create again from persistent state.
  new OnSystemActivated().init();
});

it("init after token created", () => {
  new MockGameObject({
    templateMetadata: "token.command:my-source/my-faction",
  });
  new OnSystemActivated().init();
});

it("activated by known player color", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const player: Player = new MockPlayer({ slot: 10 });

  new MockGameObject({
    templateMetadata: "tile.system:base/18",
  });
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  if (!system) {
    throw new Error("System not found");
  }

  new OnSystemActivated()._displayActiveSystem(system, player);
});
