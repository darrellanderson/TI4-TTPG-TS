import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { Faction } from "../../../../faction-lib/faction/faction";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";

it("registry", () => {
  const nsid = "card.promissory:base/tekklar-legion";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Tekklar Legion"
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

it("modifier (opponent)", () => {
  const norrFaction: Faction = new (class extends Faction {
    getNsid(): NsidNameSchemaType {
      return "faction:base/norr";
    }
  })();
  placeGameObjects({ opponent: ["card.promissory:base/tekklar-legion"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
    overrideSelfFaction: norrFaction,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Tekklar Legion"]);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const groundCombat: CombatAttrs = infantry.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(9);
});
