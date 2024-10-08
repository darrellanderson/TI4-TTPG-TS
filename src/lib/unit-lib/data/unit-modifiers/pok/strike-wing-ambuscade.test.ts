import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.promissory:pok/strike-wing-ambuscade";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Strike Wing Ambuscade"
  );
});

it("default", () => {
  placeGameObjects({
    selfUnits: new Map([
      ["destroyer", 1],
      ["dreadnought", 1],
      ["pds", 1],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
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
  expect(antiFighterBarrage.getExtraDice()).toBe(0);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getExtraDice()).toBe(0);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getExtraDice()).toBe(0);
});

it("modifier (antiFighterBarrage)", () => {
  placeGameObjects({
    self: ["card.promissory:pok/strike-wing-ambuscade"],
    selfUnits: new Map([
      ["destroyer", 1],
      ["dreadnought", 1],
      ["pds", 1],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Strike Wing Ambuscade"]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getExtraDice()).toBe(1);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getExtraDice()).toBe(0);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getExtraDice()).toBe(0);
});

it("modifier (bombardment)", () => {
  placeGameObjects({
    self: ["card.promissory:pok/strike-wing-ambuscade"],
    selfUnits: new Map([
      ["destroyer", 1],
      ["dreadnought", 1],
      ["pds", 1],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Strike Wing Ambuscade"]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getExtraDice()).toBe(0);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getExtraDice()).toBe(1);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getExtraDice()).toBe(0);
});

it("modifier (spaceCannonDefense)", () => {
  placeGameObjects({
    self: ["card.promissory:pok/strike-wing-ambuscade"],
    selfUnits: new Map([
      ["destroyer", 1],
      ["dreadnought", 1],
      ["pds", 1],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonDefense",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Strike Wing Ambuscade"]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getExtraDice()).toBe(0);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getExtraDice()).toBe(0);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getExtraDice()).toBe(1);
});

it("modifier (spaceCannonOffense)", () => {
  placeGameObjects({
    self: ["card.promissory:pok/strike-wing-ambuscade"],
    selfUnits: new Map([
      ["destroyer", 1],
      ["dreadnought", 1],
      ["pds", 1],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Strike Wing Ambuscade"]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getExtraDice()).toBe(0);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getExtraDice()).toBe(0);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getExtraDice()).toBe(1);
});
