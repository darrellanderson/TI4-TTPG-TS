import { GameObject } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";
import { UnitModifierActiveIdle } from "./unit-modifier-active-idle";

it("static set/is active", () => {
  const obj: GameObject = new MockGameObject();
  expect(UnitModifierActiveIdle.isActive(obj)).toBe(false);

  UnitModifierActiveIdle.setActive(obj, true);
  expect(UnitModifierActiveIdle.isActive(obj)).toBe(true);

  UnitModifierActiveIdle.setActive(obj, false);
  expect(UnitModifierActiveIdle.isActive(obj)).toBe(false);
});
