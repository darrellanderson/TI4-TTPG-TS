import { Player } from "@tabletop-playground/api";
import { MockCard, MockGameObject, MockPlayer } from "ttpg-mock";
import { HeroDimensionalAnchor } from "./hero-dimensional-anchor";

it("constructor, init", () => {
  new HeroDimensionalAnchor().init();
});

it("right click", () => {
  new HeroDimensionalAnchor().init();
  const card: MockCard = MockCard.simple(
    "card.leader.hero:pok/it-feeds-on-carrion"
  );
  process.flushTicks(); // card event delayed a frame

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Dimensional Anchor");
});

it("_getDimensionalTearHexes", () => {
  MockGameObject.simple(
    "token.attachment.system:pok/dimensional-tear.vuilraith"
  );
  const hero = new HeroDimensionalAnchor();
  const hexes = hero._getDimensionalTearHexes(true);
  expect(hexes.size).toBeGreaterThan(0);
});
