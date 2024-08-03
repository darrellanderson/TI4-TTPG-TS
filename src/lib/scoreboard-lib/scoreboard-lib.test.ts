import { GameObject, Vector } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject, Rotator } from "ttpg-mock";

import { ScoreboardLib } from "./scoreboard-lib";

it("constructor", () => {
  new ScoreboardLib();
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

  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const playerSlotToControlTokens: Map<
    number,
    Array<GameObject>
  > = scoreboardLib._getPlayerSlotToAtopControlTokens();
  expect(playerSlotToControlTokens.size).toBe(1);

  const tokens: Array<GameObject> | undefined =
    playerSlotToControlTokens.get(1);
  expect(tokens?.map((token) => token.getId())).toEqual(["on"]);
});

it("_getLocalCenter", () => {
  MockGameObject.simple("token:base/scoreboard");
  MockGameObject.simple("token.control:base/sol", {
    id: "on",
    owningPlayerSlot: 1,
  });
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const localCenter: Vector | undefined = scoreboardLib._getLocalCenter(5);
  expect(localCenter).toBeDefined();
  expect(localCenter?.toString()).toBe("(X=0.2,Y=0.116,Z=0)");
});

it("_getLocalCenter (missing scoreboard)", () => {
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const localCenter: Vector | undefined = scoreboardLib._getLocalCenter(5);
  expect(localCenter).toBeUndefined();
});

it("getControlTokenRotation", () => {
  MockGameObject.simple("token:base/scoreboard");
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const rot: Rotator | undefined = scoreboardLib.getControlTokenRotation();
  expect(rot).toBeDefined();
  expect(rot?.toString()).toBe("(P=0,Y=0,R=0)");
});

it("getControlTokenRotation (missing scoreboard)", () => {
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const rot: Rotator | undefined = scoreboardLib.getControlTokenRotation();
  expect(rot).toBeUndefined();
});

it("posToScore", () => {
  MockGameObject.simple("token:base/scoreboard");
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const score: number | undefined = scoreboardLib.posToScore(
    new Vector(0, 0, 0)
  );
  expect(score).toBe(5);
});

it("posToScore (missing scoreboard)", () => {
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const score: number | undefined = scoreboardLib.posToScore(
    new Vector(0, 0, 0)
  );
  expect(score).toBeUndefined();
});

it("scoreToPos", () => {
  new MockCardHolder({ owningPlayerSlot: 1 });
  MockGameObject.simple("token:base/scoreboard");
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const pos: Vector | undefined = scoreboardLib.scoreToPos(5, 1);
  expect(pos).toBeDefined();
});

it("scoreToPos (missing scoreboard)", () => {
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const pos: Vector | undefined = scoreboardLib.scoreToPos(5, 1);
  expect(pos).toBeUndefined();
});

it("scoreToPos (missing seat)", () => {
  MockGameObject.simple("token:base/scoreboard");
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const pos: Vector | undefined = scoreboardLib.scoreToPos(5, 1);
  expect(pos).toBeDefined();
  expect(pos?.toString()).toBe("(X=0.2,Y=0.116,Z=0)");
});

it("scoreToPos (flipped scoreboard)", () => {
  new MockCardHolder({ owningPlayerSlot: 1 });
  MockGameObject.simple("token:base/scoreboard", { rotation: [0, 0, 180] });
  const scoreboardLib: ScoreboardLib = new ScoreboardLib();
  const pos: Vector | undefined = scoreboardLib.scoreToPos(5, 1);
  expect(pos).toBeDefined();
});
