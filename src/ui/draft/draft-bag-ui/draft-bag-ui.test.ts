import { DraftBagUI } from "./draft-bag-ui";

it("default settings", () => {
  const scale: number = 1;
  const draftBagUi = new DraftBagUI(scale);
  expect(draftBagUi.getGenerateSlicesParams()).toEqual({
    minAlphaWormholes: 2,
    minBetaWormholes: 2,
    minLegendary: 2,
    sliceMakeups: [["red", "red", "high", "med", "low"]],
    sliceShape: ["<0,0,-0>", "<1,0,-1>", "<2,0,-2>", "<3,0,-3>", "<4,0,-4>"],
  });

  expect(draftBagUi.getNumFactions()).toBe(2);
  expect(draftBagUi.getUseFactionsOnTable()).toBe(false);
});
