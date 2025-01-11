import { Card, Player } from "@tabletop-playground/api";
import { MockCard, MockCardHolder, MockPlayer } from "ttpg-mock";

it("event", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("token:base/speaker");

  const agendaCard: Card = MockCard.simple("card.agenda:my-source/my-name");
  const player: Player = new MockPlayer();
  TI4.events.onAgendaCard.trigger(agendaCard, player);
});
