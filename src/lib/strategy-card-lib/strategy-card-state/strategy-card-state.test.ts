import { StrategyCardState } from "./strategy-card-state";

it("constructor", () => {
  const strategyCardState = new StrategyCardState();
  expect(strategyCardState).toBeDefined();
});

it("add/active/remove", () => {
  const strategyCardState = new StrategyCardState();
  strategyCardState.addNsid(0, "nsid1");
  strategyCardState.addNsid(0, "nsid2");
  expect(strategyCardState.activeNsids(0)).toEqual(["nsid1", "nsid2"]);
  strategyCardState.removeNsid(0, "nsid1");
  expect(strategyCardState.activeNsids(0)).toEqual(["nsid2"]);
  strategyCardState.removeNsid(0, "nsid2");
  expect(strategyCardState.activeNsids(0)).toEqual([]);
});
