import { MockContainer, MockGameObject } from "ttpg-mock";
import { ReturnCommandTokens } from "./return-command-tokens";

it("constructor", () => {
  new ReturnCommandTokens();
});

it("returnOnePlayersCommandTokens", () => {
  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: 1,
  });

  MockGameObject.simple("tile.system:base/1", { position: [10, 0, 0] });
  const onMap = MockGameObject.simple("token.command:base/sol", {
    owningPlayerSlot: 1,
    position: [10, 0, 0],
  });
  const otherPlayers = MockGameObject.simple("token.command:base/sol", {
    owningPlayerSlot: 2,
    position: [10, 0, 0],
  });

  const offMap = MockGameObject.simple("token.command:base/sol", {
    owningPlayerSlot: 1,
    position: [50, 0, 0],
  });

  expect(onMap.getPosition().toString()).toBe("(X=10,Y=0,Z=0)");
  expect(onMap.getContainer()).toBeUndefined();
  expect(otherPlayers.getPosition().toString()).toBe("(X=10,Y=0,Z=0)");
  expect(otherPlayers.getContainer()).toBeUndefined();
  expect(offMap.getPosition().toString()).toBe("(X=50,Y=0,Z=0)");
  expect(offMap.getContainer()).toBeUndefined();

  const returnCommandTokens = new ReturnCommandTokens();
  returnCommandTokens.returnOnePlayersCommandTokens(1);

  expect(onMap.getContainer()).toBeDefined();
  expect(otherPlayers.getPosition().toString()).toBe("(X=10,Y=0,Z=0)");
  expect(otherPlayers.getContainer()).toBeUndefined();
  expect(offMap.getPosition().toString()).toBe("(X=50,Y=0,Z=0)");
  expect(offMap.getContainer()).toBeUndefined();
});

it("returnAllCommandTokens", () => {
  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: 1,
  });

  MockGameObject.simple("tile.system:base/1", { position: [10, 0, 0] });
  const onMap = MockGameObject.simple("token.command:base/sol", {
    owningPlayerSlot: 1,
    position: [10, 0, 0],
  });

  const offMap = MockGameObject.simple("token.command:base/sol", {
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
