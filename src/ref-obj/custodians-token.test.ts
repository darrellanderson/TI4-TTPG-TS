import { GameObject, Player } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject, MockPlayer } from "ttpg-mock";

import { createFromObject, CustodiansToken } from "./custodians-token";

it("constructor", () => {
  const obj: GameObject = new MockGameObject();
  new CustodiansToken(obj);
});

it("trigger action", () => {
  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({ owningPlayerSlot: 10 });

  const obj: MockGameObject = new MockGameObject();
  new CustodiansToken(obj);
  const player: Player = new MockPlayer({ slot: 10 });
  obj._customActionAsPlayer(player, "*Score");
});

it("score", () => {
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: playerSlot,
  });
  new MockCardHolder({ owningPlayerSlot: playerSlot });

  const obj: MockGameObject = new MockGameObject();
  const custodiansToken: CustodiansToken = new CustodiansToken(obj);

  custodiansToken.score(playerSlot);
});

it("createFromObject", () => {
  const obj: GameObject = new MockGameObject();
  createFromObject(obj, "yep");
});
