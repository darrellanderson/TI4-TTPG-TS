import { Color } from "@tabletop-playground/api";
import { UnitAttrsSchemaType } from "../schema/unit-attrs-schema";
import { CombatAttrs } from "./combat-attrs";
import { UnitAttrs } from "./unit-attrs";

it("static schemaToNsid", () => {
  const nsid = UnitAttrs.schemaToNsid("my-source", {
    name: "my-name",
    unit: "carrier",
    nsidName: "my-nsid-name",
  });
  expect(nsid).toBe("card.technology.unit-upgrade:my-source/my-nsid-name");
});

it("static schemaToNsid (flagship)", () => {
  const nsid = UnitAttrs.schemaToNsid("my-source", {
    name: "my-name",
    unit: "flagship",
    nsidName: "my-nsid-name",
  });
  expect(nsid).toBe("flagship:my-source/my-nsid-name");
});

it("static schemaToNsid (flagship unit upgrade)", () => {
  const nsid = UnitAttrs.schemaToNsid("my-source", {
    name: "my-name-2",
    unit: "flagship",
    nsidName: "my-nsid-name-2",
  });
  expect(nsid).toBe("card.technology.unit-upgrade:my-source/my-nsid-name-2");
});

it("static schemaToNsid (mech)", () => {
  const nsid = UnitAttrs.schemaToNsid("my-source", {
    name: "my-name",
    unit: "mech",
    nsidName: "my-nsid-name",
  });
  expect(nsid).toBe("card.leader.mech:my-source/my-nsid-name");
});

it("static schemaToNsid (missing nsidName)", () => {
  expect(() => {
    const nsid = UnitAttrs.schemaToNsid("my-source", {
      name: "my-name",
      unit: "carrier",
    });
  }).toThrow();
});

it("static sortByOverrideOrder", () => {
  const attrs: Array<UnitAttrsSchemaType> = [
    { name: "my-name-b", unit: "carrier", nsidName: "b" },
    { name: "my-name-a", unit: "carrier", nsidName: "a" },
    { name: "my-name-c", unit: "carrier", nsidName: "c" },
    { name: "no-nsid-name", unit: "carrier" },
    { name: "no-nsid-name", unit: "carrier" },
  ];
  const sorted = UnitAttrs.sortByOverrideOrder(attrs);
  const nsidNames = sorted.map((attrs) => attrs.nsidName);
  expect(nsidNames).toEqual([undefined, undefined, "a", "b", "c"]);
});

it("constructor", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    componentCount: 1,
  });
  expect(unitAttrs.getName()).toBe("my-name");
  expect(unitAttrs.getUnit()).toBe("infantry");
  expect(unitAttrs.getComponentCount()).toBe(1);

  // defaults
  expect(unitAttrs.getCost()).toBe(undefined);
  expect(unitAttrs.getProducePerCost()).toBe(1);
  expect(
    unitAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits()
  ).toBe(0);
  expect(unitAttrs.getDiceColor().toHex()).toBe("000000FF");
  expect(unitAttrs.getDisablePlanetaryShield()).toBe(false);
  expect(unitAttrs.getDisableSpaceCannonOffense()).toBe(false);
  expect(unitAttrs.hasPlanetaryShild()).toBe(false);
  expect(unitAttrs.hasSustainDamage()).toBe(false);
  expect(unitAttrs.isGround()).toBe(false);
  expect(unitAttrs.isShip()).toBe(false);

  expect(unitAttrs.getAntiFighterBarrage()).toBe(undefined);
  expect(unitAttrs.getBombardment()).toBe(undefined);
  expect(unitAttrs.getSpaceCombat()).toBe(undefined);
  expect(unitAttrs.getSpaceCannon()).toBe(undefined);
  expect(unitAttrs.getGroundCombat()).toBe(undefined);

  expect(() => {
    unitAttrs.getAntiFighterBarrageOrThrow();
  }).toThrow();
  expect(() => {
    unitAttrs.getBombardmentOrThrow();
  }).toThrow();
  expect(() => {
    unitAttrs.getSpaceCombatOrThrow();
  }).toThrow();
  expect(() => {
    unitAttrs.getSpaceCannonOrThrow();
  }).toThrow();
  expect(() => {
    unitAttrs.getGroundCombatOrThrow();
  }).toThrow();
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

  expect(unitAttrs.getAntiFighterBarrageOrThrow().getHit()).toBe(1);
  expect(unitAttrs.getBombardmentOrThrow().getHit()).toBe(2);
  expect(unitAttrs.getSpaceCombatOrThrow().getHit()).toBe(3);
  expect(unitAttrs.getSpaceCannonOrThrow().getHit()).toBe(4);
  expect(unitAttrs.getGroundCombatOrThrow().getHit()).toBe(5);
});

it("cost", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    cost: 1,
  });
  expect(unitAttrs.getCost()).toBe(1);
  expect(unitAttrs.getName()).toBe("my-name");

  unitAttrs.setCost(2);
  expect(unitAttrs.getCost()).toBe(2);

  unitAttrs.applyOverride({
    name: "my-name-2",
    unit: "infantry",
    cost: 3,
  });
  expect(unitAttrs.getCost()).toBe(3);
  expect(unitAttrs.getName()).toBe("my-name-2");
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

it("produceQuantityDoesNotCountAgainstProductionLimits", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
  });
  expect(
    unitAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits()
  ).toBe(0);

  unitAttrs.setProduceQuantityDoesNotCountAgainstProductionLimits(3);
  expect(
    unitAttrs.getProduceQuantityDoesNotCountAgainstProductionLimits()
  ).toBe(3);
});

it("sharedProduceQuantityDoesNotCountAgainstProductionLimits", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
  });
  expect(
    unitAttrs.getSharedProduceQuantityDoesNotCountAgainstProductionLimits()
  ).toBe(0);

  unitAttrs.setSharedProduceQuantityDoesNotCountAgainstProductionLimits(3);
  expect(
    unitAttrs.getSharedProduceQuantityDoesNotCountAgainstProductionLimits()
  ).toBe(3);
});

it("diceColor", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    diceColor: "#ff0000",
  });
  const diceColor: Color | undefined = unitAttrs.getDiceColor();
  expect(diceColor?.toHex()).toBe("FF0000FF"); // RGBA

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    diceColor: "#00ff00",
  });
  expect(unitAttrs.getDiceColor()).toEqual({ a: 1, b: 0, g: 0, r: 1 });
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

it("hasSustaindDamage", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    hasSustainDamage: true,
  });
  expect(unitAttrs.hasSustainDamage()).toBe(true);

  unitAttrs.setHasSustainDamage(false);
  expect(unitAttrs.hasSustainDamage()).toBe(false);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    hasSustainDamage: true,
  });
  expect(unitAttrs.hasSustainDamage()).toBe(true);
});

it("hasPlanetaryShield", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    hasPlanetaryShield: true,
  });
  expect(unitAttrs.hasPlanetaryShild()).toBe(true);

  unitAttrs.setHasPlanetaryShield(false);
  expect(unitAttrs.hasPlanetaryShild()).toBe(false);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    hasPlanetaryShield: true,
  });
  expect(unitAttrs.hasPlanetaryShild()).toBe(true);
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

it("disableSpaceCannonOffense", () => {
  const unitAttrs = new UnitAttrs({
    name: "my-name",
    unit: "infantry",
    disableSpaceCannonOffense: true,
  });
  expect(unitAttrs.getDisableSpaceCannonOffense()).toBe(true);

  unitAttrs.setDisableSpaceCannonOffense(false);
  expect(unitAttrs.getDisableSpaceCannonOffense()).toBe(false);

  unitAttrs.applyOverride({
    name: "my-name",
    unit: "infantry",
    disableSpaceCannonOffense: true,
  });
  expect(unitAttrs.getDisableSpaceCannonOffense()).toBe(true);
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
