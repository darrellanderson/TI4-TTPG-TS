import { Container, GameObject } from "@tabletop-playground/api";
import { MockContainer, MockGameObject } from "ttpg-mock";

import { PlaceControlTokenOnCard } from "./place-control-token-on-card";

it("constructor", () => {
  new PlaceControlTokenOnCard();
});

it("_getControlToken", () => {
  const controlToken: GameObject = new MockGameObject({
    templateMetadata: "token.control:base/sol",
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.token.control:base/generic",
    owningPlayerSlot: 3,
    items: [controlToken],
  });
  expect(container.getNumItems()).toBe(1);

  const placeControlTokenOnCard: PlaceControlTokenOnCard =
    new PlaceControlTokenOnCard();
  const found: GameObject | undefined =
    placeControlTokenOnCard._getControlToken(3);
  expect(found?.getId()).toBe(controlToken.getId());
});
