import { CombatAttrs } from "./combat-attrs";
import { UnitAttrs } from "./unit-attrs";

it("constructor", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    unitCount: 1,
  });
  expect(unitAttrs.getName()).toBe("my-name");
  expect(unitAttrs.getUnit()).toBe("infantry");
  expect(unitAttrs.getUnitCount()).toBe(1);

  // defaults
  expect(unitAttrs.getCost()).toBe(undefined);
  expect(unitAttrs.getProducePerCost()).toBe(1);
  expect(unitAttrs.getDisablePlanetaryShield()).toBe(false);
  expect(unitAttrs.getPlanetaryShild()).toBe(false);
  expect(unitAttrs.getSustainDamage()).toBe(false);
  expect(unitAttrs.isGround()).toBe(false);
  expect(unitAttrs.isShip()).toBe(false);

  expect(unitAttrs.getAntiFighterBarrage()).toBe(undefined);
  expect(unitAttrs.getBombardment()).toBe(undefined);
  expect(unitAttrs.getSpaceCombat()).toBe(undefined);
  expect(unitAttrs.getSpaceCannon()).toBe(undefined);
  expect(unitAttrs.getGroundCombat()).toBe(undefined);
});

it("constructor (with combat attrs)", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    antiFighterBarrage: {
      hit: 1,
    },
    bombardment: {
      hit: 2,
    },
    spaceCombat: {
      hit: 3,
    },
    spaceCannon: {
      hit: 4,
    },
    groundCombat: {
      hit: 5,
    },
  });
  expect(unitAttrs.getAntiFighterBarrage()?.getHit()).toBe(1);
  expect(unitAttrs.getBombardment()?.getHit()).toBe(2);
  expect(unitAttrs.getSpaceCombat()?.getHit()).toBe(3);
  expect(unitAttrs.getSpaceCannon()?.getHit()).toBe(4);
  expect(unitAttrs.getGroundCombat()?.getHit()).toBe(5);
});

it("cost", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    cost: 1,
  });
  expect(unitAttrs.getCost()).toBe(1);

  unitAttrs.setCost(2);
  expect(unitAttrs.getCost()).toBe(2);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    cost: 3,
  });
  expect(unitAttrs.getCost()).toBe(3);
});

it("producePerCost", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    producePerCost: 2,
  });
  expect(unitAttrs.getProducePerCost()).toBe(2);

  unitAttrs.setProducePerCost(3);
  expect(unitAttrs.getProducePerCost()).toBe(3);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    producePerCost: 4,
  });
  expect(unitAttrs.getProducePerCost()).toBe(4);
});

it("isShip", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    isShip: true,
  });
  expect(unitAttrs.isShip()).toBe(true);

  unitAttrs.setIsShip(false);
  expect(unitAttrs.isShip()).toBe(false);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    isShip: true,
  });
  expect(unitAttrs.isShip()).toBe(true);
});

it("isGround", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    isGround: true,
  });
  expect(unitAttrs.isGround()).toBe(true);

  unitAttrs.setIsGround(false);
  expect(unitAttrs.isGround()).toBe(false);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    isGround: true,
  });
  expect(unitAttrs.isGround()).toBe(true);
});

it("sustaindDamage", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    sustainDamage: true,
  });
  expect(unitAttrs.getSustainDamage()).toBe(true);

  unitAttrs.setSustainDamage(false);
  expect(unitAttrs.getSustainDamage()).toBe(false);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    sustainDamage: true,
  });
  expect(unitAttrs.getSustainDamage()).toBe(true);
});

it("planetaryShield", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    planetaryShield: true,
  });
  expect(unitAttrs.getPlanetaryShild()).toBe(true);

  unitAttrs.setPlanetaryShield(false);
  expect(unitAttrs.getPlanetaryShild()).toBe(false);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    planetaryShield: true,
  });
  expect(unitAttrs.getPlanetaryShild()).toBe(true);
});

it("disablePlanetaryShield", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    disablePlanetaryShield: true,
  });
  expect(unitAttrs.getDisablePlanetaryShield()).toBe(true);

  unitAttrs.setDisablePlanetaryShield(false);
  expect(unitAttrs.getDisablePlanetaryShield()).toBe(false);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    disablePlanetaryShield: true,
  });
  expect(unitAttrs.getDisablePlanetaryShield()).toBe(true);
});

it("antiFighterBarrage", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
  });
  expect(unitAttrs.getAntiFighterBarrage()).toBe(undefined);

  // Overrride missing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    antiFighterBarrage: {
      hit: 1,
    },
  });
  expect(unitAttrs.getAntiFighterBarrage()?.getHit()).toBe(1);

  // Replace with set.
  const combatAttrs = new CombatAttrs({
    hit: 2,
  });
  unitAttrs.setAntiFighterBarrage(combatAttrs);
  expect(unitAttrs.getAntiFighterBarrage()?.getHit()).toBe(2);

  // Overrride existing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    antiFighterBarrage: {
      hit: 3,
    },
  });
  expect(unitAttrs.getAntiFighterBarrage()?.getHit()).toBe(3);
});

it("bombardment", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
  });
  expect(unitAttrs.getBombardment()).toBe(undefined);

  // Overrride missing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    bombardment: {
      hit: 1,
    },
  });
  expect(unitAttrs.getBombardment()?.getHit()).toBe(1);

  // Replace with set.
  const combatAttrs = new CombatAttrs({
    hit: 2,
  });
  unitAttrs.setBombardment(combatAttrs);
  expect(unitAttrs.getBombardment()?.getHit()).toBe(2);

  // Overrride existing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    bombardment: {
      hit: 3,
    },
  });
  expect(unitAttrs.getBombardment()?.getHit()).toBe(3);
});

it("spaceCannon", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
  });
  expect(unitAttrs.getSpaceCannon()).toBe(undefined);

  // Overrride missing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    spaceCannon: {
      hit: 1,
    },
  });
  expect(unitAttrs.getSpaceCannon()?.getHit()).toBe(1);

  // Replace with set.
  const combatAttrs = new CombatAttrs({
    hit: 2,
  });
  unitAttrs.setSpaceCannon(combatAttrs);
  expect(unitAttrs.getSpaceCannon()?.getHit()).toBe(2);

  // Overrride existing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    spaceCannon: {
      hit: 3,
    },
  });
  expect(unitAttrs.getSpaceCannon()?.getHit()).toBe(3);
});

it("spaceCombat", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
  });
  expect(unitAttrs.getSpaceCombat()).toBe(undefined);

  // Overrride missing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    spaceCombat: {
      hit: 1,
    },
  });
  expect(unitAttrs.getSpaceCombat()?.getHit()).toBe(1);

  // Replace with set.
  const combatAttrs = new CombatAttrs({
    hit: 2,
  });
  unitAttrs.setSpaceCombat(combatAttrs);
  expect(unitAttrs.getSpaceCombat()?.getHit()).toBe(2);

  // Overrride existing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    spaceCombat: {
      hit: 3,
    },
  });
  expect(unitAttrs.getSpaceCombat()?.getHit()).toBe(3);
});

it("groundCombat", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
  });
  expect(unitAttrs.getGroundCombat()).toBe(undefined);

  // Overrride missing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    groundCombat: {
      hit: 1,
    },
  });
  expect(unitAttrs.getGroundCombat()?.getHit()).toBe(1);

  // Replace with set.
  const combatAttrs = new CombatAttrs({
    hit: 2,
  });
  unitAttrs.setGroundCombat(combatAttrs);
  expect(unitAttrs.getGroundCombat()?.getHit()).toBe(2);

  // Overrride existing combat attrs.
  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    groundCombat: {
      hit: 3,
    },
  });
  expect(unitAttrs.getGroundCombat()?.getHit()).toBe(3);
});
