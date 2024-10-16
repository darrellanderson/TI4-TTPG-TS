import { MockCard, MockCardDetails, MockPlayer } from "ttpg-mock";
import { ReportRemaining } from "./report-remaining";
import { Card, Player } from "@tabletop-playground/api";

it("init", () => {
  new ReportRemaining().init();
});

it("getCardNamesWithCountsMessage", () => {
  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({ name: "a" }),
      new MockCardDetails({ name: "b (7)" }), // strip off number
      new MockCardDetails({ name: "c" }),
      new MockCardDetails({ name: "a" }),
      new MockCardDetails({ name: "b" }),
    ],
  });

  const msg: string = new ReportRemaining().getCardNamesWithCountsMessage(deck);
  expect(msg).toBe("Remaining: a (2), b (2), c");
});

it("events", () => {
  const a: Card = MockCard.simple("card.action:base/a"); // existing card

  new ReportRemaining().init();

  const b: Card = MockCard.simple("card.action:base/b"); // new card
  b.addCards(a);
  process.flushTicks();
});

it("trigger action", () => {
  const card: MockCard = MockCard.simple("card.action:base/b");
  new ReportRemaining().init();

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Report Remaining");
});
