import { GameObject } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

import { InitiativeEntry, InitiativeOrder } from "./initiative-order";

it("static getStrategyCardNsidNameFirst", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  const nameFirst: string | undefined =
    InitiativeOrder.getStrategyCardNsidNameFirst(obj);
  expect(nameFirst).toBe("leadership");
});

it("static getStrategyCardNsidNameFirst (not strategy card)", () => {
  const obj: GameObject = MockGameObject.simple("other:base/other");
  const nameFirst: string | undefined =
    InitiativeOrder.getStrategyCardNsidNameFirst(obj);
  expect(nameFirst).toBeUndefined();
});

it("static getStrategyCardNsidNameFirst (invalid nsid)", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/@@invalid!!"
  );
  const nameFirst: string | undefined =
    InitiativeOrder.getStrategyCardNsidNameFirst(obj);
  expect(nameFirst).toBeUndefined();
});

it("static getStrategyCardNsidNameFirst (unknown name)", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/__unknown__"
  );
  const nameFirst: string | undefined =
    InitiativeOrder.getStrategyCardNsidNameFirst(obj);
  expect(nameFirst).toBeUndefined();
});

it("constructor", () => {
  new InitiativeOrder();
});

it("_isAtopStrategyCardMat", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  MockGameObject.simple("mat:base/strategy");
  const initiativeOrder: InitiativeOrder = new InitiativeOrder();
  const atop: boolean = initiativeOrder._isAtopStrategyCardMat(obj);
  expect(atop).toBe(true);
});

it("_isAtopStrategyCardMat (missing mat)", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  const initiativeOrder: InitiativeOrder = new InitiativeOrder();
  const atop: boolean = initiativeOrder._isAtopStrategyCardMat(obj);
  expect(atop).toBe(false);
});

it("_isAtopStrategyCardMat (off mat)", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership",
    { position: [100, 0, 0] }
  );
  MockGameObject.simple("mat:base/strategy");
  const initiativeOrder: InitiativeOrder = new InitiativeOrder();
  const atop: boolean = initiativeOrder._isAtopStrategyCardMat(obj);
  expect(atop).toBe(false);
});

it("get", () => {
  MockGameObject.simple("mat:base/strategy");
  MockGameObject.simple("tile.strategy:base/leadership"); // on mat
  MockGameObject.simple("tile.strategy:base/diplomacy", {
    position: [100, 0, 0],
  });
  new MockCardHolder({ owningPlayerSlot: 1, position: [100, 0, 0] });

  const initiativeOrder: InitiativeOrder = new InitiativeOrder();
  const entries: Array<InitiativeEntry> = initiativeOrder.get();
  expect(entries.length).toBe(1);
  expect(entries[0]?.playerSlot).toBe(1);
  expect(entries[0]?.initiative).toBe(2);
});

it("get (naalu zero)", () => {
  MockGameObject.simple("token:base/naalu-zero", {
    position: [100, 0, 0],
  });
  new MockCardHolder({ owningPlayerSlot: 1, position: [100, 0, 0] });

  const initiativeOrder: InitiativeOrder = new InitiativeOrder();
  const entries: Array<InitiativeEntry> = initiativeOrder.get();
  expect(entries.length).toBe(1);
  expect(entries[0]?.playerSlot).toBe(1);
  expect(entries[0]?.initiative).toBe(0);
});
