import { PlayerSlot } from "ttpg-darrell";
import { AbstractStrategyCardBody } from "./abstract-strategy-card-body";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

class MyAbstractStrategyCardBody extends AbstractStrategyCardBody {
  getStrategyCardName(): string {
    return "MyName";
  }
  getStrategyCardNumber(): number {
    return 1;
  }
  getBody(_scale: number): AbstractUI | undefined {
    return undefined;
  }
  getReport(): string | undefined {
    return undefined;
  }
  constructor(strategyCardsState: StrategyCardsState, playerSlot: number) {
    super(strategyCardsState, 1, playerSlot);
  }
}

it("constructor, simple getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: PlayerSlot = 10;
  const body = new MyAbstractStrategyCardBody(strategyCardsState, playerSlot);
  expect(body.isPlayingPlayer()).toBe(false);
  expect(body.getPlayerSlot()).toBe(10);
  expect(body.getStrategyCardName()).toBe("MyName");
  expect(body.getStrategyCardNumber()).toBe(1);
  expect(body.getBody(1)).toBeUndefined();
  expect(body.getReport()).toBeUndefined();
});

it("get/set state", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: PlayerSlot = 10;
  const body = new MyAbstractStrategyCardBody(strategyCardsState, playerSlot);
  expect(body.getState()).toBeUndefined();
  body.setState("test");
  expect(body.getState()).toBe("test");
});
