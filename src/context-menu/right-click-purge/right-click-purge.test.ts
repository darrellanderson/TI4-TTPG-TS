import { Card, GameObject, Player } from "@tabletop-playground/api";
import { PURGE_ACTION_NAME, RightClickPurge } from "./right-click-purge";
import { MockCard, MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";

it("static _isPurgeable", () => {
  const objYes: GameObject = MockGameObject.simple("type:source/name|purge");
  const objNo: GameObject = MockGameObject.simple("type:source/name");
  expect(RightClickPurge._isPurgeable(objYes)).toBe(true);
  expect(RightClickPurge._isPurgeable(objNo)).toBe(false);
});

it("constructor/init", () => {
  new MockGameObject();
  new RightClickPurge().init();
});

it("purge", () => {
  const obj: GameObject = MockGameObject.simple("type:source/name|purge");
  new MockContainer({ templateMetadata: "container:base/purged" });
  new RightClickPurge()._purge(obj);
});

it("_onObjectCreatedHandler", () => {
  new RightClickPurge().init();
  MockGameObject.simple("type:source/name|purge");
});

it("_onCardMadeSingletonHandler", () => {
  new RightClickPurge().init();
  MockCard.simple("type:source/name|purge");
});

it("_onCardMakeDeckHandler", () => {
  new RightClickPurge().init();
  const card1: Card = MockCard.simple("type:source/name|purge");
  const card2: Card = MockCard.simple("type:source/name|purge");
  card1.addCards(card2);
});

it("_onCustomActionHandler", () => {
  new RightClickPurge().init();
  const obj: MockGameObject = MockGameObject.simple("type:source/name|purge");
  const player: Player = new MockPlayer();
  obj._customActionAsPlayer(player, PURGE_ACTION_NAME);
});
