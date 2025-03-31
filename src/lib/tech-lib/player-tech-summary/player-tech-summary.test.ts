import { MockCard, MockCardHolder } from "ttpg-mock";
import { PlayerTechSummary } from "./player-tech-summary";

it("constructor", () => {
  const playerSlot: number = 10;
  new PlayerTechSummary(playerSlot);
});

it("isOwned, getOwnedCount", () => {
  const playerSlot: number = 10;
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });
  MockCard.simple("card.technology.blue:base/antimass-deflectors");
  MockCard.simple("card.technology.blue:base/gravity-drive");

  const summary: PlayerTechSummary = new PlayerTechSummary(playerSlot);

  // Check if a known tech is owned.
  expect(summary.isOwned("card.technology.blue:base/antimass-deflectors")).toBe(
    true
  );
  expect(summary.isOwned("card.technology.blue:base/gravity-drive")).toBe(true);
  expect(summary.isOwned("card.technology.blue:base/fleet-logistics")).toBe(
    false
  );

  // Check owned count for different colors.
  expect(summary.getOwnedCount("blue")).toBe(2);
  expect(summary.getOwnedCount("green")).toBe(0);
  expect(summary.getOwnedCount("red")).toBe(0);
  expect(summary.getOwnedCount("yellow")).toBe(0);
});
