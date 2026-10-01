import { GameObject, Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";
import {
  ParadigmIntelligenceUnshackled,
  NSID_CARD,
} from "./paradigm-intelligence-unshackled";
import { UnitPlastic } from "../../../lib/unit-lib/unit-plastic/unit-plastic";
import { HexType } from "ttpg-darrell";

it("constructor/init", () => {
  new ParadigmIntelligenceUnshackled().init();
});

it("existing object, new object", () => {
  MockGameObject.simple(NSID_CARD); // existing
  new ParadigmIntelligenceUnshackled().init();
  MockGameObject.simple(NSID_CARD); // new
});

it("event", () => {
  new ParadigmIntelligenceUnshackled().init();
  const card: MockGameObject = MockGameObject.simple(NSID_CARD);
  const player: Player = new MockPlayer({ slot: 1 });
  card._customActionAsPlayer(player, "*Roll Intelligence Unshackled (hits on 5)");
});

it("_boom", () => {
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("unit:base/destroyer", { owningPlayerSlot: 1 });
  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 2 });
  const card: GameObject = MockGameObject.simple(NSID_CARD);

  const paradigm = new ParadigmIntelligenceUnshackled();
  paradigm.init();

  const plastics: Array<UnitPlastic> =
    paradigm._getPlasticInHex("<0,0,0>");
  expect(plastics.length).toBe(2);

  const player: Player = new MockPlayer({ slot: 1 });
  paradigm._boom(card, player, 5);
});

it("_getPlasticInHex", () => {
  MockGameObject.simple("tile.system:base/1");
  const unitObj: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: 1,
  });

  const paradigm = new ParadigmIntelligenceUnshackled();
  const plastics: Array<UnitPlastic> =
    paradigm._getPlasticInHex("<0,0,0>");
  expect(plastics.length).toBe(1);
  expect(
    plastics.map((plastic: UnitPlastic): string => plastic.getObj().getId())
  ).toEqual([unitObj.getId()]);
});

it("_getTargetPlastics", () => {
  MockGameObject.simple("tile.system:base/1");
  const _unitObj1: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: 1,
  });
  const unitObj2: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: 2,
  });

  const paradigm = new ParadigmIntelligenceUnshackled();
  const plastics: Array<UnitPlastic> =
    paradigm._getPlasticInHex("<0,0,0>");
  const targetPlastics: Array<UnitPlastic> =
    paradigm._getTargetPlastics(1, plastics);
  expect(targetPlastics.length).toBe(1);
  expect(
    targetPlastics.map((plastic: UnitPlastic): string =>
      plastic.getObj().getId()
    )
  ).toEqual([unitObj2.getId()]);
});

it("_isShip", () => {
  const paradigm = new ParadigmIntelligenceUnshackled();
  expect(paradigm._isShip("fighter")).toBe(true);
  expect(paradigm._isShip("infantry")).toBe(false);
});

it("_getHitValue", () => {
  const hex: HexType = "<0,0,0>";
  const playerSlot: number = 1;
  const unitModifiers: Array<string> = [];

  const paradigm = new ParadigmIntelligenceUnshackled();
  expect(
    paradigm._getHitValue(
      hex,
      playerSlot,
      "fighter",
      unitModifiers
    )
  ).toBe(9);
  expect(
    paradigm._getHitValue(
      hex,
      playerSlot,
      "infantry",
      unitModifiers
    )
  ).toBe(8);
});

it("_getAreaToPlastics", () => {
  MockGameObject.simple("tile.system:base/1");
  const spaceObj: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: 1,
  });
  const groundObj: GameObject = MockGameObject.simple("unit:base/infantry", {
    owningPlayerSlot: 1,
  });

  const paradigm = new ParadigmIntelligenceUnshackled();
  const plastics: Array<UnitPlastic> =
    paradigm._getPlasticInHex("<0,0,0>");
  const areaToPlastics: Map<
    string,
    Array<UnitPlastic>
  > = paradigm._getAreaToPlastics(plastics);
  expect(areaToPlastics.size).toBe(2);
  expect(
    areaToPlastics.get("Space")?.map((plastic) => plastic.getObj().getId())
  ).toEqual([spaceObj.getId()]);
  expect(
    areaToPlastics.get("Jord")?.map((plastic) => plastic.getObj().getId())
  ).toEqual([groundObj.getId()]);
});

it("_rollBoom", () => {
  MockGameObject.simple("tile.system:base/1");
  const spaceObj: MockGameObject = MockGameObject.simple(
    "unit:base/destroyer",
    {
      owningPlayerSlot: 1,
    }
  );
  const groundObj: MockGameObject = MockGameObject.simple(
    "unit:base/infantry",
    {
      owningPlayerSlot: 1,
    }
  );

  const paradigm = new ParadigmIntelligenceUnshackled();
  const plastics: Array<UnitPlastic> =
    paradigm._getPlasticInHex("<0,0,0>");
  const areaToPlastics: Map<
    string,
    Array<UnitPlastic>
  > = paradigm._getAreaToPlastics(plastics);
  paradigm._rollBoom(areaToPlastics, 8);

  const player: Player = new MockPlayer();
  spaceObj._releaseAsPlayer(player, false);
  groundObj._releaseAsPlayer(player, false);
});

it("_applyBoomResult", () => {
  const obj: GameObject = new MockGameObject();
  const rollValues: Array<number> = [1, 2, 3];
  const hitValue: number = 2;

  const paradigm = new ParadigmIntelligenceUnshackled();
  paradigm._applyBoomResult(obj, rollValues, hitValue);
});
