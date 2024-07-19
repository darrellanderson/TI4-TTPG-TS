import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry (commander)", () => {
  const nsid = "card.leader.commander:pok/ta-zern";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Ta Zern");
});

it("registry (alliance)", () => {
  const nsid = "card.alliance:pok/jolnar";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Ta Zern");
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

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getRerollMisses()).toBe(false);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getRerollMisses()).toBe(false);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getRerollMisses()).toBe(false);
});

it("modifier (antiFighterBarrage)", () => {
  placeGameObjects({ self: ["card.leader.commander:pok/ta-zern"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Ta Zern"]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getRerollMisses()).toBe(true);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getRerollMisses()).toBe(true);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getRerollMisses()).toBe(true);
});

it("modifier (bombardment)", () => {
  placeGameObjects({ self: ["card.leader.commander:pok/ta-zern"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Ta Zern"]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getRerollMisses()).toBe(true);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getRerollMisses()).toBe(true);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getRerollMisses()).toBe(true);
});

it("modifier (spaceCannonDefense)", () => {
  placeGameObjects({ self: ["card.leader.commander:pok/ta-zern"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonDefense",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Ta Zern"]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getRerollMisses()).toBe(true);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getRerollMisses()).toBe(true);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getRerollMisses()).toBe(true);
});

it("modifier (spaceCannonOffense)", () => {
  placeGameObjects({ self: ["card.leader.commander:pok/ta-zern"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Ta Zern"]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getRerollMisses()).toBe(true);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getRerollMisses()).toBe(true);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getRerollMisses()).toBe(true);
});
