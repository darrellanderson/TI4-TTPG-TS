import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { Faction } from "../../../../faction-lib/faction/faction";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitModifier } from "../../../unit-modifier/unit-modifier";

it("registry", () => {
  const nsid = "card.promissory:base/tekklar-legion";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Tekklar Legion",
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const groundCombat: CombatAttrs = infantry.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(8);
});

it("modifier (self)", () => {
  placeGameObjects({ self: ["card.promissory:base/tekklar-legion"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Tekklar Legion"]);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const groundCombat: CombatAttrs = infantry.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(7);
});

it("modifier (self, bad roll type)", () => {
  placeGameObjects({ self: ["card.promissory:base/tekklar-legion"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat", // only applies to ground combat
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const groundCombat: CombatAttrs = infantry.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(8);
});

it("modifier (opponent)", () => {
  const norrFaction: Faction | undefined =
    TI4.factionRegistry.getByNsid("faction:base/norr");
  expect(norrFaction?.getName()).toBe("Sardakk N'orr");
  expect(norrFaction?.getNsid()).toBe("faction:base/norr");
  expect(norrFaction?.getPromissoryNsids()).toEqual([
    "card.promissory:base/tekklar-legion",
  ]);

  const modifier: UnitModifier | undefined = TI4.unitModifierRegistry.getByNsid(
    "card.promissory:base/tekklar-legion",
  );
  expect(modifier?.getName()).toBe("Tekklar Legion");
  expect(modifier?.getOwner()).toBe("any");

  placeGameObjects({
    opponent: ["card.promissory:base/tekklar-legion"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
    overrideSelfFaction: norrFaction,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([
    "Tekklar Legion",
    "Unrelenting",
  ]);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const groundCombat: CombatAttrs = infantry.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(8); // -1 from tekklar, but still +1 from unrelenting
});
