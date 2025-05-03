import { HexType } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";
import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorHexSummary } from "./updator-hex-summary";
import { EntityType, HexSummaryCodes } from "./hex-summary-codes";
import { System } from "../../../system-lib/system/system";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorHexSummary;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorHexSummary().update(gameData);
  expect(gameData.hexSummary).toBeDefined();
});

it("_getAllEntityTypes", () => {
  MockGameObject.simple("tile.system:base/18");

  new MockGameObject({
    templateMetadata: "unit:base/carrier",
    owningPlayerSlot: 10,
  });
  new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: 11,
  });
  MockGameObject.simple("token.command:pok/ul");
  MockGameObject.simple("token.attachment.system:pok/ion-storm");

  const updator: UpdatorHexSummary = new UpdatorHexSummary();
  const entityTypes: Array<EntityType> = updator._getAllEntityTypes();

  expect(entityTypes).toEqual([
    { code: "c", colorCode: "G", count: 1, planetIndex: -1, hex: "<0,0,0>" },
    { code: "i", colorCode: "R", count: 1, planetIndex: 0, hex: "<0,0,0>" },
    {
      code: "t",
      colorCode: undefined,
      count: 1,
      planetIndex: 0,
      token: true,
      hex: "<0,0,0>",
    },
    { code: "n", count: 1, planetIndex: -1, attachment: true, hex: "<0,0,0>" },
  ]);
});

it("_mergeEntityTypes", () => {
  const updator: UpdatorHexSummary = new UpdatorHexSummary();
  const entityTypes = [
    { code: "A", colorCode: "red", planetIndex: 1, count: 1 },
    { code: "A", colorCode: "red", planetIndex: 1, count: 2 },
    { code: "B", colorCode: "blue", planetIndex: 2, count: 1 },
    { code: "B", colorCode: "blue", planetIndex: 2, count: 3 },
    { code: "C", colorCode: "green", planetIndex: 3, count: 1 },
  ];

  const merged = updator._mergeEntityTypes(entityTypes);

  expect(merged.length).toBe(3);
  expect(merged).toEqual([
    {
      code: "A",
      colorCode: "red",
      planetIndex: 1,
      count: 3,
    },
    {
      code: "B",
      colorCode: "blue",
      planetIndex: 2,
      count: 4,
    },
    {
      code: "C",
      colorCode: "green",
      planetIndex: 3,
      count: 1,
    },
  ]);
});

it("_encodeHex", () => {
  const updator: UpdatorHexSummary = new UpdatorHexSummary();
  const hex: HexType = "<1,2,-3>";
  const encoded: string = updator._encodeHex(hex);
  expect(encoded).toBe("+2+4");

  updator._encodeHex("<-1,-1,2>");
  updator._encodeHex("<1,-1,0>");
  updator._encodeHex("<-1,1,0>");
  updator._encodeHex("<1,1,-2>");
});

it("_encodeEntityTypes", () => {
  const updator: UpdatorHexSummary = new UpdatorHexSummary();
  const entityTypes: Array<EntityType> = [
    { code: "c", colorCode: "R", planetIndex: -1, count: 2 }, // unit
    { code: "c", colorCode: "W", planetIndex: -1, count: 2 }, // unit color change
    { code: "d", colorCode: "W", planetIndex: -1, count: 1 }, // unit count change
    { code: "a", planetIndex: 1, count: 1, attachment: true }, // attachment
  ];
  const encoded: string = updator._encodeEntityTypes(entityTypes);
  expect(encoded).toBe("R2cWd2c;*a");
});

it("encodeAll", () => {
  MockGameObject.simple("tile.system:base/18");
  MockGameObject.simple("tile.system:base/19", { position: [10, 0, 0] });
  MockGameObject.simple("unit:base/carrier");

  const codes: HexSummaryCodes = new HexSummaryCodes();
  const hexToSystem: Map<HexType, System> = codes.getHexToSystem();
  expect(hexToSystem.size).toBe(2);

  const updator: UpdatorHexSummary = new UpdatorHexSummary();

  const encoded = updator.encodeAll();
  expect(encoded).toBe("18+0+0c,19+0+2");
});
