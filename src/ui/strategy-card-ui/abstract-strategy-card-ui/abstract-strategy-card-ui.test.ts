import { AbstractStrategyCardUI } from "./abstract-strategy-card-ui";

class MyAbstractStrategyCardUI extends AbstractStrategyCardUI {}

it("constructor", () => {
  new MyAbstractStrategyCardUI("name", 1);
});
