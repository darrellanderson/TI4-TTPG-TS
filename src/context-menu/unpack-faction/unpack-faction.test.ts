import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
} from "ttpg-mock";
import {
  ACTION_REMOVE,
  ACTION_UNPACK,
  UnpackFactionContextMenuItem,
} from "./unpack-faction";
import { GameObject, Player } from "@tabletop-playground/api";

it("_getFaction (bad)", () => {
  const obj: GameObject = MockGameObject.simple("bad-nsid");
  const ufcmi = new UnpackFactionContextMenuItem();
  expect(() => {
    ufcmi._getFaction(obj);
  }).toThrow();
});

it("init, make singleton, make deck", () => {
  new UnpackFactionContextMenuItem().init();

  const card1: MockCard = MockCard.simple(
    "card.faction-reference:base/arborec"
  );
  const card2: MockCard = MockCard.simple("card.faction-reference:base/sol");

  process.flushTicks(); // let singleton card created event run

  const toFront: boolean = false;
  const offset: number = 0;
  const animate: boolean = false;
  const flipped: boolean = false;
  const player: Player = new MockPlayer();
  card1._addCardsAsPlayer(card2, toFront, offset, animate, flipped, player);

  process.flushTicks(); // let deck created event run
});

it("trigger unpack", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const player: Player = new MockPlayer();
  new UnpackFactionContextMenuItem().init();
  const card: MockCard = MockCard.simple("card.faction-reference:base/arborec");

  process.flushTicks(); // let singleton card created event run

  expect(() => {
    card._customActionAsPlayer(player, ACTION_UNPACK);
  }).toThrow(
    // Need a lot more setup to fully test, that's done in the unpack lib.
    "Cannot find container with nsid: container.token.command:base/generic"
  );
});

it("trigger remove", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const player: Player = new MockPlayer();
  new UnpackFactionContextMenuItem().init();
  const card: MockCard = MockCard.simple("card.faction-reference:base/arborec");

  process.flushTicks(); // let singleton card created event run

  expect(() => {
    card._customActionAsPlayer(player, ACTION_REMOVE);
  }).toThrow(
    // Need a lot more setup to fully test, that's done in the unpack lib.
    "Cannot find container with nsid: container.token.command:base/generic"
  );
});
