import { Player, Vector } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  mockGlobalEvents,
  MockPlayer,
} from "ttpg-mock";
import {
  ACTION_TOGGLE_COMBAT,
  ToggleCombatWindow,
} from "./toggle-combat-window";
import { System } from "../../lib/system-lib/system/system";
import { PlayerSeatType } from "../../lib/player-lib/player-seats/player-seats";
import { CombatRoll } from "../../lib/combat-lib/combat-roll/combat-roll";

it("constructor/init/event", () => {
  const toggleCombatWindow = new ToggleCombatWindow();
  toggleCombatWindow.init();

  const player: Player = new MockPlayer();
  const actionName: string = ACTION_TOGGLE_COMBAT;
  mockGlobalEvents._customActionAsPlayer(player, actionName);
});

it("event", () => {
  const toggleCombatWindow = new ToggleCombatWindow();
  toggleCombatWindow.init();

  MockGameObject.simple("tile.system:base/18");
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  if (!system) {
    throw new Error("System not found");
  }

  // Add a different player's unit.
  MockGameObject.simple("unit:base/fighter", { owningPlayerSlot: 11 });

  const player: Player = new MockPlayer({ slot: 10 });
  TI4.events.onSystemActivated.trigger(system, player);
  TI4.events.onSystemActivated.trigger(system, player); // repeat to close old
});

it("adj PDS2 players", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const checkPlayerSlots: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((playerSeat: PlayerSeatType): number => {
      return playerSeat.playerSlot;
    });
  expect(checkPlayerSlots).toEqual([10]);
  MockCard.simple("card.technology.unit-upgrade:base/pds-2");

  const toggleCombatWindow = new ToggleCombatWindow();
  toggleCombatWindow.init();
  expect(toggleCombatWindow._isAttached(10)).toBe(false);

  MockGameObject.simple("tile.system:base/18");
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  if (!system) {
    throw new Error("System not found");
  }

  // Add a PDS2 unit in an adjacent system.
  const pos: Vector = TI4.hex.toPosition("<1,0,-1>");
  MockGameObject.simple("tile.system:base/19", { position: pos });
  const system19: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(19);
  if (!system19) {
    throw new Error("System19 not found");
  }
  expect(TI4.hex.fromPosition(system19.getObj().getPosition())).toBe(
    "<1,0,-1>"
  );

  MockGameObject.simple("unit:base/pds", {
    owningPlayerSlot: 10,
    position: pos,
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: 12,
    rollingPlayerSlot: 10,
  });
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("pds")
      .getSpaceCannonOrThrow()
      .getRange()
  ).toBe(1);
  expect(combatRoll.self.hasUnitAdj("pds")).toBe(true);
  expect(toggleCombatWindow._hasAdjPds2(system, 10)).toBe(true);

  const adjPds2PlayerSlots: Array<number> =
    toggleCombatWindow._getAdjPds2PlayerSlots(system);
  expect(adjPds2PlayerSlots).toEqual([10]);

  const player: Player = new MockPlayer({ slot: 11 });
  TI4.events.onSystemActivated.trigger(system, player);
  expect(toggleCombatWindow._isAttached(10)).toBe(true);
});
