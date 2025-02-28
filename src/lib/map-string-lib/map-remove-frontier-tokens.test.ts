import { GameObject } from "@tabletop-playground/api";
import { GarbageContainer } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";
import { RecycleTokenFrontier } from "../recycle-lib/handlers/token/recycle-token-frontier/recycle-token-frontier";
import { MapRemoveFrontierTokens } from "./map-remove-frontier-tokens";

it("remove", () => {
  MockGameObject.simple("tile.system:base/18");
  const token: GameObject = MockGameObject.simple(
    "token.attachment.system:pok/frontier"
  );

  GarbageContainer.addHandler(new RecycleTokenFrontier());

  expect(token.isValid()).toBe(true);
  new MapRemoveFrontierTokens().removeFrontierTokens();
  expect(token.isValid()).toBe(false);
});
