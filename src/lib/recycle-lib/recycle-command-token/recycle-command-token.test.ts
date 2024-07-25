import { MockGameObject } from "ttpg-mock";
import { RecycleCommandToken } from "./recycle-command-token";
import { GameObject } from "@tabletop-playground/api";

it("constructor", () => {
  new RecycleCommandToken();
});

it("recycle", () => {
  const token: GameObject = new MockGameObject({
    templateMetadata: "token:base/command",
  });
});
