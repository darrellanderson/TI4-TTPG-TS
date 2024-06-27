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
});

it("constructor (all)", () => {
  const combatAttrs = new CombatAttrs({
    dice: 2,
    hit: 3,
    extraDice: 4,
    crit: 5,
    critCount: 6,
    rerollMisses: true,
  });
  expect(combatAttrs.getDice()).toBe(2);
  expect(combatAttrs.getHit()).toBe(3);
  expect(combatAttrs.getExtraDice()).toBe(4);
  expect(combatAttrs.getCrit()).toBe(5);
  expect(combatAttrs.getCritCount()).toBe(6);
  expect(combatAttrs.getRerollMisses()).toBe(true);
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
    .setRerollMisses(true);
  expect(combatAttrs.getDice()).toBe(2);
  expect(combatAttrs.getHit()).toBe(3);
  expect(combatAttrs.getExtraDice()).toBe(4);
  expect(combatAttrs.getCrit()).toBe(5);
  expect(combatAttrs.getCritCount()).toBe(6);
  expect(combatAttrs.getRerollMisses()).toBe(true);
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
  });
  expect(combatAttrs.getDice()).toBe(2);
  expect(combatAttrs.getHit()).toBe(3);
  expect(combatAttrs.getExtraDice()).toBe(4);
  expect(combatAttrs.getCrit()).toBe(5);
  expect(combatAttrs.getCritCount()).toBe(6);
  expect(combatAttrs.getRerollMisses()).toBe(true);
});
