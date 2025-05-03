// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

import { GameObject } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";
import { UnitPlastic } from "../../../unit-lib/unit-plastic/unit-plastic";
import {
  ATTACHMENT_NSID_TO_TYPE_AND_CODE,
  EntityType,
  HexSummaryCodes,
} from "./hex-summary-codes";

it("constructor", () => {
  new HexSummaryCodes();
});

it("_planetIndex", () => {
  MockGameObject.simple("tile.system:base/18");
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject();
  const planetIndex: number | undefined = codes._getPlanetIndex(obj);
  expect(planetIndex).toBe(0);
});

it("_planetIndex (none)", () => {
  MockGameObject.simple("tile.system:base/40");
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject();
  const planetIndex: number = codes._getPlanetIndex(obj);
  expect(planetIndex).toBe(-1);
});

it("_planetIndex (no system tile)", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject();
  const planetIndex: number = codes._getPlanetIndex(obj);
  expect(planetIndex).toBe(-1);
});

it("colorCode", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/carrier",
    owningPlayerSlot: 10,
  });
  const code: string | undefined = codes._colorCode(obj);
  expect(code).toBe("G");
});

it("colorCode (unknown player slot)", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/carrier",
    owningPlayerSlot: 9,
  });
  const code: string | undefined = codes._colorCode(obj);
  expect(code).toBeUndefined();
});

it("unitCode", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/carrier",
  });
  const plastic: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  if (!plastic) {
    throw new Error("No plastic");
  }
  const code: string | undefined = codes._unitCode(plastic);
  expect(code).toBe("c");
});

it("unitCode (unknown unit)", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token.control:base/sol",
  }); // control tokens are counted as units (for control detection)
  const plastic: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  if (!plastic) {
    throw new Error("No plastic");
  }
  const code: string | undefined = codes._unitCode(plastic);
  expect(code).toBeUndefined();
});

it("tokenCode", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token.command:base/sol",
  });
  const code: string | undefined = codes._tokenCode(obj);
  expect(code).toBe("t");
});

it("tokenCode (invalid)", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token.~~invalid~~:base/sol",
  });
  const code: string | undefined = codes._tokenCode(obj);
  expect(code).toBeUndefined();
});

it("attachment", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token.attachment.system:pok/ion-storm",
  });
  const entity: EntityType | undefined = codes.attachmentEntity(obj);
  expect(entity?.code).toBe("n");
});

it("attachment (flippable, flipped)", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token.attachment.system:pok/ion-storm",
    rotation: [0, 0, 180],
  });
  const entity: EntityType | undefined = codes.attachmentEntity(obj);
  expect(entity?.code).toBe("N");
});

it("attachment (planet)", () => {
  MockGameObject.simple("tile.system:base/18");

  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token.attachment.planet:pok/demilitarized-zone",
  });
  const entity: EntityType | undefined = codes.attachmentEntity(obj);
  expect(entity).toEqual({
    count: 1,
    attachment: true,
    code: "z",
    planetIndex: 0,
    hex: "<0,0,0>",
  });
});

it("attachment (invalid)", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "type:source/invalid",
  });
  const entity: EntityType | undefined = codes.attachmentEntity(obj);
  expect(entity?.code).toBeUndefined();
});

it("unitEntity (infantry)", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: 10,
  });
  const plastic: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  if (!plastic) {
    throw new Error("No plastic");
  }
  const entity: EntityType | undefined = codes.unitEntity(plastic);
  expect(entity).toEqual({
    code: "i",
    colorCode: "G",
    count: 1,
    planetIndex: -1,
    hex: "<0,0,0>",
  });
});

it("unitEntity (mech)", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:pok/mech",
    owningPlayerSlot: 10,
  });
  const plastic: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  if (!plastic) {
    throw new Error("No plastic");
  }
  const entity: EntityType | undefined = codes.unitEntity(plastic);
  expect(entity).toEqual({
    code: "m",
    count: 1,
    colorCode: "G",
    planetIndex: -1,
    hex: "<0,0,0>",
  });
});

it("tokenEntity", () => {
  const codes: HexSummaryCodes = new HexSummaryCodes();
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token.command:pok/ul",
    owningPlayerSlot: 10,
  });
  const entity: EntityType | undefined = codes.tokenEntity(obj);
  expect(entity).toEqual({
    code: "t",
    count: 1,
    colorCode: "G",
    planetIndex: -1,
    token: true,
    hex: "<0,0,0>",
  });
});

it("attachment nsids exist", () => {
  // Scan templates for NSIDs.
  const templateNsids: Set<string> = new Set();
  const entries: readonly klawSync.Item[] = klawSync("assets/Templates/", {
    nodir: true,
    traverseAll: true,
    filter: (item) => {
      return item.path.endsWith(".json");
    },
  });
  const regex: RegExp = /"(token.*)"/;
  for (const entry of entries) {
    const data: Buffer = fs.readFileSync(entry.path);
    const lines: Array<string> = data.toString().split("\n");
    for (const line of lines) {
      const match: RegExpMatchArray | null = line.match(regex);
      const nsid: string | undefined = match?.[1];
      if (nsid) {
        templateNsids.add(nsid);
      }
    }
  }

  const nsids: Array<string> = [];
  nsids.push(...Object.keys(ATTACHMENT_NSID_TO_TYPE_AND_CODE));

  const missing: Array<string> = [];
  for (const nsid of nsids) {
    if (!templateNsids.has(nsid) && !templateNsids.has(nsid + ".1")) {
      missing.push(nsid);
    }
  }
  if (missing.length > 0) {
    console.log("missing", missing.join("\n"));
  }
  expect(missing).toHaveLength(0);
});
