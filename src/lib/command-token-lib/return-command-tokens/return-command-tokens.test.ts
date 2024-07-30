import { MockContainer, MockGameObject } from "ttpg-mock";
import { ReturnCommandTokens } from "./return-command-tokens";

it("constructor", () => {
  new ReturnCommandTokens();
});

it("returnAllCommandTokens", () => {
  new MockContainer({
    templateMetadata: "container.token:base/command",
    owningPlayerSlot: 1,
  });

  MockGameObject.simple("tile.system:base/1", { position: [10, 0, 0] });
  const onMap = MockGameObject.simple("token:base/command", {
    owningPlayerSlot: 1,
    position: [10, 0, 0],
  });

  const offMap = MockGameObject.simple("token:base/command", {
    owningPlayerSlot: 1,
    position: [50, 0, 0],
  });

  expect(onMap.getPosition().toString()).toBe("(X=10,Y=0,Z=0)");
  expect(onMap.getContainer()).toBeUndefined();
  expect(offMap.getPosition().toString()).toBe("(X=50,Y=0,Z=0)");
  expect(offMap.getContainer()).toBeUndefined();

  const returnCommandTokens = new ReturnCommandTokens();
  returnCommandTokens.returnAllCommandTokens();

  expect(onMap.getContainer()).toBeDefined();
  expect(offMap.getPosition().toString()).toBe("(X=50,Y=0,Z=0)");
  expect(offMap.getContainer()).toBeUndefined();
});
