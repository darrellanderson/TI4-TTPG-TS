import {
  CombatRoll,
  CombatRollParams,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.technology:base/antimass-deflectors";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("x", () => {
  throw new Error("Test not implemented");
});
