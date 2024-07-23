import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.action:codex.ordinian/blitz";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Blitz");
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

  const carrier: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("carrier")!;
  const carrierBombardment: CombatAttrs | undefined = carrier.getBombardment();
  expect(carrierBombardment).toBeUndefined();
});

it("modifier", () => {
  placeGameObjects({ self: ["card.action:codex.ordinian/blitz"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Blitz"]);

  const carrier: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("carrier")!;
  const carrierBombardment: CombatAttrs = carrier.getBombardmentOrThrow();
  expect(carrierBombardment.getHit()).toBe(6);
});
