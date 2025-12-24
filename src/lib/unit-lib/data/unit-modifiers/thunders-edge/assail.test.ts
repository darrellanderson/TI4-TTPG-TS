import { Card, world } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { MockCard, MockGameObject } from "ttpg-mock";
import { CARD_NSID_ASSAIL, isPuppeted } from "./assail";
import {
  CombatRoll,
  CombatRollParams,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
it("registry", () => {
  const nsid: string = CARD_NSID_ASSAIL;
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("isPuppeted", () => {
  const opponentPlayerSlot: number = 1;

  expect(isPuppeted(CARD_NSID_ASSAIL, opponentPlayerSlot)).toBe(false);
  MockCard.simple(CARD_NSID_ASSAIL);
  expect(isPuppeted(CARD_NSID_ASSAIL, opponentPlayerSlot)).toBe(false);
  MockGameObject.simple("token.control:base/faction1", {
    owningPlayerSlot: opponentPlayerSlot,
  });
  expect(isPuppeted(CARD_NSID_ASSAIL, opponentPlayerSlot)).toBe(true);
  expect(isPuppeted(CARD_NSID_ASSAIL, opponentPlayerSlot)).toBe(true); // cached
});

it("modifier", () => {
  let combatRoll: CombatRoll;
  const combatParams: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("fighter")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(9);

  placeGameObjects({
    self: [CARD_NSID_ASSAIL, "token.control:base/opponent-faction"],
  });
  expect(isPuppeted(CARD_NSID_ASSAIL, OPPONENT)).toBe(false); // control token not owned yet

  // Update owner for control token.
  for (const obj of world.getAllObjects()) {
    const nsid: string = NSID.get(obj);
    if (nsid === "token.control:base/opponent-faction") {
      obj.setOwningPlayerSlot(OPPONENT);
    }
    if (nsid === CARD_NSID_ASSAIL) {
      if (obj instanceof Card) {
        expect(obj.isFaceUp()).toBe(true);
      }
    }
  }
  expect(isPuppeted(CARD_NSID_ASSAIL, OPPONENT)).toBe(true);

  combatRoll = CombatRoll.createCooked(combatParams);
  const rollType: CombatRollType = combatRoll.getRollType();
  expect(rollType === "spaceCombat" || rollType === "groundCombat").toBe(true);
  expect(isPuppeted(CARD_NSID_ASSAIL, combatRoll.opponent.playerSlot)).toBe(
    true
  );
  expect(combatRoll.getUnitModifierNames()).toEqual(["Assail"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("fighter")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(8);
});
