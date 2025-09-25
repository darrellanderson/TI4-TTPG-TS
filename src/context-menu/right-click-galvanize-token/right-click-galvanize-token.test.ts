import { GameObject, Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";
import {
  ACTION_BOOM,
  NSID_BOOM_TOKEN,
  RightClickGalvanizeToken,
} from "./right-click-galvanize-token";
import { UnitPlastic } from "../../lib/unit-lib/unit-plastic/unit-plastic";
import { HexType } from "ttpg-darrell";

it("constructor/init", () => {
  new RightClickGalvanizeToken().init();
});

it("existing object, new object", () => {
  MockGameObject.simple(NSID_BOOM_TOKEN); // existing
  new RightClickGalvanizeToken().init();
  MockGameObject.simple(NSID_BOOM_TOKEN); // new
});

it("event", () => {
  new RightClickGalvanizeToken().init();
  const boomToken: MockGameObject = MockGameObject.simple(NSID_BOOM_TOKEN);
  const player: Player = new MockPlayer({ slot: 1 });
  boomToken._customActionAsPlayer(player, ACTION_BOOM);
});

it("_boom", () => {
  MockGameObject.simple("tile.system:base/1");
  MockGameObject.simple("unit:base/destroyer", { owningPlayerSlot: 1 });
  MockGameObject.simple("unit:base/carrier", { owningPlayerSlot: 2 });
  const galvanizeToken: GameObject = MockGameObject.simple(
    "token:thunders-edge/galvanize"
  );

  const rightClickGalvanizeToken = new RightClickGalvanizeToken();
  rightClickGalvanizeToken.init();

  const plastics: Array<UnitPlastic> =
    rightClickGalvanizeToken._getPlasticInHex("<0,0,0>");
  expect(plastics.length).toBe(3);

  const galvanizedPlastic: UnitPlastic | undefined =
    rightClickGalvanizeToken._getGalvanizedPlastic(galvanizeToken, plastics);
  expect(galvanizedPlastic?.getUnit()).toEqual("destroyer");

  const player: Player = new MockPlayer({ slot: 1 });
  rightClickGalvanizeToken._boom(galvanizeToken, player);
});

it("_getPlasticInHex, _getGalvanizedPlastic", () => {
  MockGameObject.simple("tile.system:base/1");
  const unitObj: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: 1,
  });
  const galvanizeToken: GameObject = MockGameObject.simple(
    "token:thunders-edge/galvanize"
  );

  const rightClickGalvanizeToken = new RightClickGalvanizeToken();
  const plastics: Array<UnitPlastic> =
    rightClickGalvanizeToken._getPlasticInHex("<0,0,0>");
  expect(plastics.length).toBe(2);
  expect(
    plastics.map((plastic: UnitPlastic): string => plastic.getObj().getId())
  ).toEqual([unitObj.getId(), galvanizeToken.getId()]);

  const galvanizedPlastic: UnitPlastic | undefined =
    rightClickGalvanizeToken._getGalvanizedPlastic(galvanizeToken, plastics);
  expect(galvanizedPlastic).toBeDefined();
  expect(galvanizedPlastic?.getObj().getId()).toEqual(unitObj.getId());
});

it("_getTargetPlastics", () => {
  MockGameObject.simple("tile.system:base/1");
  const _unitObj1: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: 1,
  });
  const unitObj2: GameObject = MockGameObject.simple("unit:base/destroyer", {
    owningPlayerSlot: 2,
  });

  const rightClickGalvanizeToken = new RightClickGalvanizeToken();
  const plastics: Array<UnitPlastic> =
    rightClickGalvanizeToken._getPlasticInHex("<0,0,0>");
  const targetPlastics: Array<UnitPlastic> =
    rightClickGalvanizeToken._getTargetPlastics(1, plastics);
  expect(targetPlastics.length).toBe(1);
  expect(
    targetPlastics.map((plastic: UnitPlastic): string =>
      plastic.getObj().getId()
    )
  ).toEqual([unitObj2.getId()]);
});

it("_isShip", () => {
  const rightClickGalvanizeToken = new RightClickGalvanizeToken();
  expect(rightClickGalvanizeToken._isShip("fighter")).toBe(true);
  expect(rightClickGalvanizeToken._isShip("infantry")).toBe(false);
});

it("_getHitValue", () => {
  const hex: HexType = "<0,0,0>";
  const playerSlot: number = 1;
  const unitModifiers: Array<string> = [];

  const rightClickGalvanizeToken = new RightClickGalvanizeToken();
  expect(
    rightClickGalvanizeToken._getHitValue(
      hex,
      playerSlot,
      "fighter",
      unitModifiers
    )
  ).toBe(9);
  expect(
    rightClickGalvanizeToken._getHitValue(
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

  const rightClickGalvanizeToken = new RightClickGalvanizeToken();
  const plastics: Array<UnitPlastic> =
    rightClickGalvanizeToken._getPlasticInHex("<0,0,0>");
  const areaToPlastics: Map<
    string,
    Array<UnitPlastic>
  > = rightClickGalvanizeToken._getAreaToPlastics(plastics);
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

  const rightClickGalvanizeToken = new RightClickGalvanizeToken();
  const plastics: Array<UnitPlastic> =
    rightClickGalvanizeToken._getPlasticInHex("<0,0,0>");
  const areaToPlastics: Map<
    string,
    Array<UnitPlastic>
  > = rightClickGalvanizeToken._getAreaToPlastics(plastics);
  rightClickGalvanizeToken._rollBoom(areaToPlastics, 8);

  const player: Player = new MockPlayer();
  spaceObj._releaseAsPlayer(player, false);
  groundObj._releaseAsPlayer(player, false);
});

it("_applyBoomResult", () => {
  const obj: GameObject = new MockGameObject();
  const rollValues: Array<number> = [1, 2, 3];
  const hitValue: number = 2;

  const rightClickGalvanizeToken = new RightClickGalvanizeToken();
  rightClickGalvanizeToken._applyBoomResult(obj, rollValues, hitValue);
});
