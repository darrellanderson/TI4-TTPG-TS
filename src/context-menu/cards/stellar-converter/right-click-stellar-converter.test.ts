import { MockCard, MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";

import { Container, GameObject, Player } from "@tabletop-playground/api";
import {
  ACTION_FETCH_STELLAR_CONVERTER,
  RightClickStellarConverter,
  STELLAR_CONVERTER_NSID,
  STELLAR_CONVERTER_TOKEN_NSID,
} from "./right-click-stellar-converter";

it("constructor/init", () => {
  new RightClickStellarConverter().init();
});

it("custom action", () => {
  const token: GameObject = MockGameObject.simple(STELLAR_CONVERTER_TOKEN_NSID);
  const container: Container = new MockContainer({ items: [token] });

  expect(container.getItems()).toContain(token);

  new RightClickStellarConverter().init();

  const card: MockCard = MockCard.simple(STELLAR_CONVERTER_NSID);
  process.flushTicks();

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, ACTION_FETCH_STELLAR_CONVERTER);

  expect(container.getItems()).not.toContain(token);
});
