import { CombatAttrs } from "./combat-attrs";

it("constructor (defaults)", () => {
  const combatAttrs = new CombatAttrs({
    hit: 1,
  });
  expect(combatAttrs.getDice()).toBe(1);
  expect(combatAttrs.getHit()).toBe(1);
  expect(combatAttrs.getExtraDice()).toBe(0);
  expect(combatAttrs.getCrit()).toBe(undefined);
  expect(combatAttrs.getCritCount()).toBe(0);
  expect(combatAttrs.getRerollMisses()).toBe(false);
  expect(combatAttrs.getRange()).toBe(0);
});

it("constructor (all)", () => {
  const combatAttrs = new CombatAttrs({
    dice: 2,
    hit: 3,
    extraDice: 4,
    crit: 5,
    critCount: 6,
    rerollMisses: true,
    range: 7,
  });
  expect(combatAttrs.getDice()).toBe(2);
  expect(combatAttrs.getHit()).toBe(3);
  expect(combatAttrs.getExtraDice()).toBe(4);
  expect(combatAttrs.getCrit()).toBe(5);
  expect(combatAttrs.getCritCount()).toBe(6);
  expect(combatAttrs.getRerollMisses()).toBe(true);
  expect(combatAttrs.getRange()).toBe(7);
});

it("setters", () => {
  const combatAttrs = new CombatAttrs({
    hit: 1,
  });
  combatAttrs
    .setDice(2)
    .setHit(3)
    .setExtraDice(4)
    .setCrit(5)
    .setCritCount(6)
    .setRerollMisses(true)
    .setRange(7);
  expect(combatAttrs.getDice()).toBe(2);
  expect(combatAttrs.getHit()).toBe(3);
  expect(combatAttrs.getExtraDice()).toBe(4);
  expect(combatAttrs.getCrit()).toBe(5);
  expect(combatAttrs.getCritCount()).toBe(6);
  expect(combatAttrs.getRerollMisses()).toBe(true);
  expect(combatAttrs.getRange()).toBe(7);
});

it("override", () => {
  const combatAttrs = new CombatAttrs({
    hit: 1,
  });
  combatAttrs.applyOverride({
    dice: 2,
    hit: 3,
    extraDice: 4,
    crit: 5,
    critCount: 6,
    rerollMisses: true,
    range: 7,
  });
  expect(combatAttrs.getDice()).toBe(2);
  expect(combatAttrs.getHit()).toBe(3);
  expect(combatAttrs.getExtraDice()).toBe(4);
  expect(combatAttrs.getCrit()).toBe(5);
  expect(combatAttrs.getCritCount()).toBe(6);
  expect(combatAttrs.getRerollMisses()).toBe(true);
  expect(combatAttrs.getRange()).toBe(7);
});

it("add", () => {
  const combatAttrs = new CombatAttrs({
    dice: 20,
    hit: 30,
    extraDice: 40,
    crit: 5,
    critCount: 6,
    rerollMisses: true,
    range: 7,
  });
  expect(combatAttrs.getDice()).toBe(20);
  expect(combatAttrs.getHit()).toBe(30);
  expect(combatAttrs.getExtraDice()).toBe(40);

  combatAttrs.addDice(1);
  expect(combatAttrs.getDice()).toBe(21);
  expect(combatAttrs.getHit()).toBe(30);
  expect(combatAttrs.getExtraDice()).toBe(40);

  combatAttrs.addExtraDice(1);
  expect(combatAttrs.getDice()).toBe(21);
  expect(combatAttrs.getHit()).toBe(30);
  expect(combatAttrs.getExtraDice()).toBe(41);

  combatAttrs.addHit(1);
  expect(combatAttrs.getDice()).toBe(21);
  expect(combatAttrs.getHit()).toBe(31);
  expect(combatAttrs.getExtraDice()).toBe(41);
});
