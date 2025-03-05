import { Player } from "@tabletop-playground/api";
import { MockCard, MockPlayer } from "ttpg-mock";
import { HeroHelioCommandArray } from "./hero-helio-command-array";

it("constructor, init", () => {
  new HeroHelioCommandArray().init();
});

it("right click", () => {
  new HeroHelioCommandArray().init();
  const card: MockCard = MockCard.simple(
    "card.leader.hero:pok/jace-x-4th-air-legion"
  );
  process.flushTicks(); // card event delayed a frame

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Helio Command Array");
});
