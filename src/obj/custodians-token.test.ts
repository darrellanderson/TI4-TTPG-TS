import {
  Container,
  GameObject,
  MockContainer,
  MockGameObject,
  MockPlayer,
} from "ttpg-mock";
import { CustodiansToken } from "./custodians-token";
import { Player } from "@tabletop-playground/api";

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

  expect(container.getNumItems()).toBe(0);
});
