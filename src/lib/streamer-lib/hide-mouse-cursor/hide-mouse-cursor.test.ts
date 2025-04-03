import { Player } from "@tabletop-playground/api";
import { HideMouseCursor } from "./hide-mouse-cursor";
import { MockPlayer, MockStaticObject } from "ttpg-mock";

it("constructor", () => {
  new MockStaticObject({ templateMetadata: "table:base/table" });
  const hideMouseCursor = new HideMouseCursor("@test/test");
  hideMouseCursor.init();
});

it("events", () => {
  const hideMouseCursor = new HideMouseCursor("@test/test");
  hideMouseCursor.init();
  hideMouseCursor._updateZoneHandler();
});

it("add/has/remove", () => {
  const hideMouseCursor = new HideMouseCursor("@test/test");
  hideMouseCursor.init();

  const player: Player = new MockPlayer({ name: "my-name" });
  hideMouseCursor.addHideCursor(player);
  expect(hideMouseCursor.hasHideCursor(player)).toBe(true);

  const loadFromState = new HideMouseCursor("@test/test");
  loadFromState.init();
  expect(loadFromState.hasHideCursor(player)).toBe(true);

  hideMouseCursor.removeHideCursor(player);
  expect(hideMouseCursor.hasHideCursor(player)).toBe(false);
});
