import { Card, GameObject, Player } from "@tabletop-playground/api";
import { PURGE_ACTION_NAME, RightClickPurge } from "./right-click-purge";
import { MockCard, MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";

it("static _isPurgeable", () => {
  const relicFragmentYes: GameObject = MockGameObject.simple(
    "card.exploration.cultural:pok/cultural-relic-fragment.1"
  );
  const heroYes: GameObject = MockGameObject.simple(
    "card.leader.hero:codex.vigil/xxekir-grom"
  );
  const heroNo: GameObject = MockGameObject.simple(
    "card.leader.hero:codex.vigil/xxekir-grom.omega"
  );
  expect(RightClickPurge._isPurgeable(relicFragmentYes)).toBe(true);
  expect(RightClickPurge._isPurgeable(heroYes)).toBe(true);
  expect(RightClickPurge._isPurgeable(heroNo)).toBe(false);
});

it("constructor/init", () => {
  new MockGameObject();
  new RightClickPurge().init();
});

it("purge (game object)", () => {
  const obj: GameObject = MockGameObject.simple(
    "card.exploration.cultural:pok/cultural-relic-fragment.1"
  );
  const playerSlot: number = 10;
  new MockContainer({ templateMetadata: "container:base/purged" });
  new RightClickPurge()._purge(obj, playerSlot);
});

it("purge (card)", () => {
  const card: Card = MockCard.simple(
    "card.exploration.cultural:pok/cultural-relic-fragment.1"
  );
  const playerSlot: number = 10;
  new MockContainer({ templateMetadata: "container:base/purged" });
  new RightClickPurge()._purge(card, playerSlot);
});

it("_onObjectCreatedHandler", () => {
  new RightClickPurge().init();
  MockGameObject.simple(
    "card.exploration.cultural:pok/cultural-relic-fragment.1"
  );
});

it("_onCardMadeSingletonHandler", () => {
  new RightClickPurge().init();
  MockCard.simple("card.exploration.cultural:pok/cultural-relic-fragment.1");
});

it("_onCardMakeDeckHandler", () => {
  new RightClickPurge().init();
  const card1: Card = MockCard.simple(
    "card.exploration.cultural:pok/cultural-relic-fragment.1"
  );
  const card2: Card = MockCard.simple(
    "card.exploration.cultural:pok/cultural-relic-fragment.2"
  );
  card1.addCards(card2);
});

it("_onCustomActionHandler", () => {
  new RightClickPurge().init();
  const obj: MockGameObject = MockGameObject.simple(
    "card.exploration.cultural:pok/cultural-relic-fragment.1"
  );
  const player: Player = new MockPlayer();
  obj._customActionAsPlayer(player, PURGE_ACTION_NAME);
});
