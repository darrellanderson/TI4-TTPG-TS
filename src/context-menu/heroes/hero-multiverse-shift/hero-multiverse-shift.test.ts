import { Player } from "@tabletop-playground/api";
import { MockCard, MockPlayer } from "ttpg-mock";
import { HeroMultiverseShift } from "./hero-multiverse-shift";

it("constructor, init", () => {
  new HeroMultiverseShift().init();
});

it("right click", () => {
  new HeroMultiverseShift().init();
  const card: MockCard = MockCard.simple(
    "card.leader.hero:pok/conservator-procyon"
  );
  process.flushTicks(); // card event delayed a frame

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Multiverse Shift");
});
