import { HexType } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { GameObject, Vector } from "@tabletop-playground/api";
import { _getAllGalvanizeTokens } from "./galvanize";
import { UnitPlastic } from "../../../unit-plastic/unit-plastic";

it("registry", () => {
  const nsid = "faction-ability:thunders-edge/galvanize";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Galvanize");
});

it("default", () => {
  placeGameObjects({ selfUnits: new Map([["fighter", 1]]) });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.self.getCount("fighter")).toBe(1);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getExtraDice()).toBe(0);
});

it("modifier", () => {
  placeGameObjects({
    self: ["faction-ability:thunders-edge/galvanize"],
    selfUnits: new Map([["fighter", 1]]),
  });

  const token: GameObject = MockGameObject.simple(
    "token:thunders-edge:galvanize"
  );

  const tokens: Array<GameObject> = _getAllGalvanizeTokens();
  expect(tokens).toEqual([token]);

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.self.getCount("fighter")).toBe(1);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Galvanize"]);

  const fighterPlastic: UnitPlastic | undefined =
    combatRoll.self.unitPlasticHex[0];
  if (!fighterPlastic) {
    throw new Error("Expected fighter plastic to be defined");
  }
  const fighterPos: Vector = fighterPlastic.getObj().getPosition();
  const fighterHex: HexType = TI4.hex.fromPosition(fighterPos);
  expect(fighterHex).toBe("<0,0,0>");

  const fighterUnitAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighterUnitAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getExtraDice()).toBe(1);
});
