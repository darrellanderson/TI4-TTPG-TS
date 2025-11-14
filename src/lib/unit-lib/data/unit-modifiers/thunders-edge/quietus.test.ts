import { GameObject } from "@tabletop-playground/api";
import { Find, HexType } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";
import { CombatRollParams, CombatRoll } from "../../../../combat-lib";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";
import { _getActiveBreachHexes, _getFlagshipHexes } from "./quietus";

it("registry", () => {
  const nsid: string = "unit:thunders-edge/quietus";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
  expect(TI4.factionRegistry.getByNsidName("rebellion")).toBeDefined();
});

it("modifier", () => {
  const combatParams: CombatRollParams = {
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  placeGameObjects({
    selfUnits: new Map<UnitType, number>([["destroyer", 1]]),
    opponent: ["sheet.faction:thunders-edge/rebellion"],
    opponentUnits: new Map<UnitType, number>([["flagship", 1]]),
  });

  const flagship: GameObject | undefined = new Find().findGameObject(
    "unit:base/flagship",
    OPPONENT,
    true
  );
  expect(flagship).toBeDefined();
  expect(TI4.factionRegistry.getByPlayerSlot(OPPONENT)?.getNsid()).toEqual(
    "faction:thunders-edge/rebellion"
  );
  const flagshipHexes: Set<HexType> = _getFlagshipHexes(OPPONENT);
  expect(flagshipHexes.size).toBe(1);
  expect(flagshipHexes.has("<0,0,0>")).toBeTruthy();

  MockGameObject.simple("token.attachment.system:thunders-edge/crimson-breach");
  const activeBreachHexes: Set<HexType> = _getActiveBreachHexes();
  expect(activeBreachHexes.size).toBe(1);
  expect(activeBreachHexes.has("<0,0,0>")).toBeTruthy();

  expect(
    Array.from(activeBreachHexes).some((hex) => flagshipHexes.has(hex))
  ).toBeTruthy();

  const combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getHex()).toEqual("<0,0,0>");
  expect(combatRoll.opponent.faction?.getNsid()).toEqual(
    "faction:thunders-edge/rebellion"
  );

  expect(combatRoll.getUnitModifierNames()).toEqual(["Quietus"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("destroyer")
      .getDisableAntiFighterBarrage()
  ).toBeTruthy();
});
