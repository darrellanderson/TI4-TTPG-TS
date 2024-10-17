import { GameObject, Vector } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject, Rotator } from "ttpg-mock";

import { Scoreboard } from "./scoreboard";

it("constructor", () => {
  new Scoreboard();
});

it("_getPlayerSlotToAtopControlTokens", () => {
  MockGameObject.simple("token:base/scoreboard");
  MockGameObject.simple("token.control:base/sol", {
    id: "on",
    owningPlayerSlot: 1,
  });
  MockGameObject.simple("token.control:base/sol", {
    id: "off",
    owningPlayerSlot: 1,
    position: [20, 0, 0],
  });

  const scoreboardLib: Scoreboard = new Scoreboard();
  const playerSlotToControlTokens: Map<
    number,
    Array<GameObject>
  > = scoreboardLib._getPlayerSlotToAtopControlTokens();
  expect(playerSlotToControlTokens.size).toBe(1);

  const tokens: Array<GameObject> | undefined =
    playerSlotToControlTokens.get(1);
  expect(tokens?.map((token) => token.getId())).toEqual(["on"]);
});

it("getPlayerSlotToLeadControlToken", () => {
  // "atop" needs the model size to reflect scoreToPos results.
  MockGameObject.simple("token:base/scoreboard", { _modelSize: [100, 100, 1] });
  const scoreboardLib: Scoreboard = new Scoreboard();
  MockGameObject.simple("token.control:base/sol", {
    id: "one",
    owningPlayerSlot: 1,
    position: scoreboardLib.scoreToPos(1, 1),
  });
  MockGameObject.simple("token.control:base/sol", {
    id: "three",
    owningPlayerSlot: 1,
    position: scoreboardLib.scoreToPos(3, 1),
  });
  MockGameObject.simple("token.control:base/sol", {
    id: "two",
    owningPlayerSlot: 1,
    position: scoreboardLib.scoreToPos(2, 1),
  });

  const playerSlotToToken: Map<number, GameObject> =
    scoreboardLib.getPlayerSlotToLeadControlToken();
  expect(playerSlotToToken.size).toBe(1);
  expect(playerSlotToToken.get(1)?.getId()).toBe("three");

  const token: GameObject | undefined = scoreboardLib.getLeadControlToken(1);
  expect(token?.getId()).toBe("three");
});

it("_getLocalCenter", () => {
  MockGameObject.simple("token:base/scoreboard");
  MockGameObject.simple("token.control:base/sol", {
    id: "on",
    owningPlayerSlot: 1,
  });
  const scoreboardLib: Scoreboard = new Scoreboard();
  const localCenter: Vector | undefined = scoreboardLib._getLocalCenter(5);
  expect(localCenter).toBeDefined();
  expect(localCenter?.toString()).toBe("(X=0.2,Y=0.116,Z=0)");
});

it("_getLocalCenter (missing scoreboard)", () => {
  const scoreboardLib: Scoreboard = new Scoreboard();
  const localCenter: Vector | undefined = scoreboardLib._getLocalCenter(5);
  expect(localCenter).toBeUndefined();
});

it("getControlTokenRotation", () => {
  MockGameObject.simple("token:base/scoreboard");
  const scoreboardLib: Scoreboard = new Scoreboard();
  const rot: Rotator | undefined = scoreboardLib.getControlTokenRotation();
  expect(rot).toBeDefined();
  expect(rot?.toString()).toBe("(P=0,Y=0,R=0)");
});

it("getControlTokenRotation (missing scoreboard)", () => {
  const scoreboardLib: Scoreboard = new Scoreboard();
  const rot: Rotator | undefined = scoreboardLib.getControlTokenRotation();
  expect(rot).toBeUndefined();
});

it("posToScore", () => {
  MockGameObject.simple("token:base/scoreboard");
  const scoreboardLib: Scoreboard = new Scoreboard();
  const score: number | undefined = scoreboardLib.posToScore(
    new Vector(0, 0, 0)
  );
  expect(score).toBe(5);
});

it("posToScore (missing scoreboard)", () => {
  const scoreboardLib: Scoreboard = new Scoreboard();
  const score: number | undefined = scoreboardLib.posToScore(
    new Vector(0, 0, 0)
  );
  expect(score).toBeUndefined();
});

it("scoreToPos", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });
  MockGameObject.simple("token:base/scoreboard");
  const scoreboardLib: Scoreboard = new Scoreboard();
  const pos: Vector | undefined = scoreboardLib.scoreToPos(5, 1);
  expect(pos?.toString()).toBe("(X=0.2,Y=0.866,Z=0)");
});

it("scoreToPos (missing scoreboard)", () => {
  const scoreboardLib: Scoreboard = new Scoreboard();
  const pos: Vector | undefined = scoreboardLib.scoreToPos(5, 1);
  expect(pos).toBeUndefined();
});

it("scoreToPos (missing seat)", () => {
  MockGameObject.simple("token:base/scoreboard");
  const scoreboardLib: Scoreboard = new Scoreboard();
  const pos: Vector | undefined = scoreboardLib.scoreToPos(5, 1);
  expect(pos).toBeDefined();
  expect(pos?.toString()).toBe("(X=0.2,Y=0.116,Z=0)");
});

it("scoreToPos (flipped scoreboard)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 2,
  });
  MockGameObject.simple("token:base/scoreboard", { rotation: [0, 0, 180] });
  const scoreboardLib: Scoreboard = new Scoreboard();
  const pos: Vector | undefined = scoreboardLib.scoreToPos(5, 1);
  expect(pos?.toString()).toBe("(X=0.2,Y=-4.832,Z=0)");
  scoreboardLib.scoreToPos(5, 2);
});

it("getPlayerSlotToScore", () => {
  MockGameObject.simple("token:base/scoreboard");
  MockGameObject.simple("token.control:base/sol", {
    owningPlayerSlot: 1,
    position: [0, 0, 0],
  });
  const scoreboardLib: Scoreboard = new Scoreboard();
  const playerSlotToScore: Map<number, number> =
    scoreboardLib.getPlayerSlotToScore();
  expect(playerSlotToScore.size).toBe(1);
  expect(playerSlotToScore.get(1)).toBe(5);
});
