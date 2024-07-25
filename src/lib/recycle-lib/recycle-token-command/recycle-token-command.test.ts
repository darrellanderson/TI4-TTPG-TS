import { Container, GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
import { MockContainer, MockGameObject } from "ttpg-mock";
import { RecycleTokenCommand } from "./recycle-token-command";

it("recycle", () => {
  const token: GameObject = new MockGameObject({
    id: "my-token-id",
    templateMetadata: "token:base/command",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.token:base/command",
    owningPlayerSlot: 1,
  });

  const recycle: GarbageHandler = new RecycleTokenCommand();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(true);
  expect(container.getItems().map((x) => x.getId())).toEqual(["my-token-id"]);
});

it("recycle (container owner mismatch)", () => {
  const token: GameObject = new MockGameObject({
    id: "my-token-id",
    templateMetadata: "token:base/command",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.token:base/command",
    owningPlayerSlot: 2,
  });

  const recycle: GarbageHandler = new RecycleTokenCommand();
  expect(recycle.canRecycle(token)).toBe(true);
  expect(recycle.recycle(token)).toBe(false);
  expect(container.getItems().map((x) => x.getId())).toEqual([]);
});
