import {
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockPlayer,
  MockSnapPoint,
} from "ttpg-mock";
import { RightClickExplore } from "./right-click-explore";
import { Card, GameObject, Player } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

it("constructor", () => {
  new MockGameObject(); // so there is an object in the world
  new RightClickExplore().init();
});

it("trigger custom action (system)", () => {
  const rightClickExplore = new RightClickExplore();
  const player: Player = new MockPlayer();
  const system: MockGameObject = MockGameObject.simple("tile.system:base/19");

  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.exploration.industrial:pok/my-name-1",
      }),
      new MockCardDetails({
        metadata: "card.exploration.industrial:pok/my-name-2",
      }),
    ],
  });
  const _mat: GameObject = MockGameObject.simple("mat.deck:pok/exploration", {
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-exploration-industrial"],
        snappedObject: deck,
      }),
    ],
  });
  expect(NSID.getDeck(deck)).toEqual([
    "card.exploration.industrial:pok/my-name-1",
    "card.exploration.industrial:pok/my-name-2",
  ]);
  expect(deck.getStackSize()).toBe(2);
  const found: Card | undefined =
    rightClickExplore._getExploreDeck("industrial");
  expect(found).toBe(deck);

  system._customActionAsPlayer(player, "*Explore Wellon (industrial)");
  expect(NSID.getDeck(deck)).toEqual([
    "card.exploration.industrial:pok/my-name-1",
  ]);

  // Again, one card left.
  system._customActionAsPlayer(player, "*Explore Wellon (industrial)");
});

it("trigger custom action (frontier)", () => {
  const player: Player = new MockPlayer();
  const token: MockGameObject = MockGameObject.simple(
    "token.attachment.system:pok/frontier"
  );

  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.exploration.frontier:pok/my-name-1",
      }),
      new MockCardDetails({
        metadata: "card.exploration.frontier:pok/my-name-2",
      }),
    ],
  });
  const _mat: GameObject = MockGameObject.simple("mat.deck:pok/exploration", {
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-exploration-frontier"],
        snappedObject: deck,
      }),
    ],
  });

  token._customActionAsPlayer(player, "*Explore Frontier");
  token._customActionAsPlayer(player, "*Explore Frontier"); // again
});
