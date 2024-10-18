import { Vector } from "@tabletop-playground/api";
import { MockGameObject, MockSnapPoint } from "ttpg-mock";

import { LayoutStrategyCards } from "./layout-strategy-cards";

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutStrategyCards().getLayout().doLayoutAtPoint(pos, yaw);
});

it("_placeStrategyCard", () => {
  const strategyCard = new MockGameObject();
  const snapPoint = new MockSnapPoint();
  new LayoutStrategyCards()._placeStrategyCard(strategyCard, snapPoint);
});
