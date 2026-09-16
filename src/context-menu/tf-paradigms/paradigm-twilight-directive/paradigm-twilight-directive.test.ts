import { Player } from "@tabletop-playground/api";
import { MockCard, MockPlayer } from "ttpg-mock";
import { ParadigmTwilightDirective } from "./paradigm-twilight-directive";

it("constructor, init", () => {
  new ParadigmTwilightDirective().init();
});

it("right click", () => {
  new ParadigmTwilightDirective().init();
  const card: MockCard = MockCard.simple(
    "card.tf-paradigm:twilights-fall/twilight-directive"
  );
  process.flushTicks(); // card event delayed a frame

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, "*Twilight Directive");
});
