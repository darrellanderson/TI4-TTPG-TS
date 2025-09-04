import { Container, GameObject, Player } from "@tabletop-playground/api";
import { MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";

import { createFromObject, CustodiansToken } from "./custodians-token";

it("constructor", () => {
  const obj: GameObject = new MockGameObject();
  new CustodiansToken(obj);
});

it("trigger action", () => {
  const obj: MockGameObject = new MockGameObject();
  new CustodiansToken(obj);
  const player: Player = new MockPlayer();
  obj._customActionAsPlayer(player, "*Score");
});

it("score", () => {
  const playerSlot: number = 3;
  const obj: MockGameObject = new MockGameObject();
  const custodiansToken: CustodiansToken = new CustodiansToken(obj);

  const controlToken: GameObject = new MockGameObject({
    templateMetadata: "token.control:base/sol",
    owningPlayerSlot: playerSlot,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.token.control:base/generic",
    owningPlayerSlot: playerSlot,
    items: [controlToken],
  });

  expect(container.getNumItems()).toBe(1);

  custodiansToken.score(playerSlot);

  expect(container.getNumItems()).toBe(1);
});

it("createFromObject", () => {
  const obj: GameObject = new MockGameObject();
  createFromObject(obj, "yep");
});
