import { GameObject } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";

import { InitiativeOrder } from "./initiative-order";

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
