import { MockGameObject } from "ttpg-mock";
import { AddToScore } from "./add-to-score";
import { GameObject } from "@tabletop-playground/api";
import { Scoreboard } from "../scoreboard/scoreboard";

it("addToScore", () => {
  // "atop" needs the model size to reflect scoreToPos results.
  MockGameObject.simple("token:base/scoreboard", { _modelSize: [100, 100, 1] });
  const token: GameObject = MockGameObject.simple("token.control:base/sol", {
    owningPlayerSlot: 1,
  });

  const scoreboardLib: Scoreboard = new Scoreboard();
  expect(scoreboardLib.posToScore(token.getPosition())).toBe(5);

  const addToScore: AddToScore = new AddToScore();
  const playerSlot: number = 1;
  const delta: number = 2;
  const success: boolean = addToScore.addToScore(playerSlot, delta);
  expect(success).toBe(true);

  expect(scoreboardLib.posToScore(token.getPosition())).toBe(7);
});

it("addToScore (no scoreboard)", () => {
  const addToScore: AddToScore = new AddToScore();
  const playerSlot: number = 1;
  const delta: number = 2;
  const success: boolean = addToScore.addToScore(playerSlot, delta);
  expect(success).toBe(false);
});
