import { GameObject } from "@tabletop-playground/api";
import { MockContainer, MockGameObject } from "ttpg-mock";
import { AddCommandTokens } from "./add-command-tokens";

it("constructor", () => {
  new AddCommandTokens();
});

it("addCommandTokens", () => {
  const token1: GameObject = new MockGameObject({
    id: "token1",
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 1,
  });
  const token2: GameObject = new MockGameObject({
    id: "token2",
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 1,
  });
  const token3: GameObject = new MockGameObject({
    id: "token3",
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 1,
  });
  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: 1,
    items: [token1, token2, token3],
  });
  new MockGameObject({
    templateMetadata: "sheet:base/command",
    owningPlayerSlot: 1,
  });

  expect(token1.getContainer()).toBeDefined();
  expect(token2.getContainer()).toBeDefined();
  expect(token3.getContainer()).toBeDefined();

  const addCommandTokens: AddCommandTokens = new AddCommandTokens();
  const playerSlot: number = 1;
  const count: number = 2;
  expect(addCommandTokens.addCommandTokens(playerSlot, count)).toBe(true);

  expect(token1.getContainer()).toBeUndefined();
  expect(token2.getContainer()).toBeUndefined();
  expect(token3.getContainer()).toBeDefined();
  expect(token1.getPosition().toString()).toBe("(X=33,Y=16,Z=0)");
  expect(token2.getPosition().toString()).toBe("(X=33,Y=18,Z=0)");
});

it("addCommandTokens (no container)", () => {
  new MockGameObject({
    templateMetadata: "sheet:base/command",
    owningPlayerSlot: 1,
  });

  const addCommandTokens: AddCommandTokens = new AddCommandTokens();
  const playerSlot: number = 1;
  const count: number = 2;
  expect(addCommandTokens.addCommandTokens(playerSlot, count)).toBe(false);
});

it("addCommandTokens (no sheet)", () => {
  const token1: GameObject = new MockGameObject({
    id: "token1",
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 1,
  });
  const token2: GameObject = new MockGameObject({
    id: "token2",
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 1,
  });
  const token3: GameObject = new MockGameObject({
    id: "token3",
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 1,
  });
  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: 1,
    items: [token1, token2, token3],
  });

  expect(token1.getContainer()).toBeDefined();
  expect(token2.getContainer()).toBeDefined();
  expect(token3.getContainer()).toBeDefined();

  const addCommandTokens: AddCommandTokens = new AddCommandTokens();
  const playerSlot: number = 1;
  const count: number = 2;
  expect(addCommandTokens.addCommandTokens(playerSlot, count)).toBe(false);

  expect(token1.getContainer()).toBeDefined();
  expect(token2.getContainer()).toBeDefined();
  expect(token3.getContainer()).toBeDefined();
});

it("addCommandTokens (not enough tokens)", () => {
  const token1: GameObject = new MockGameObject({
    id: "token1",
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 1,
  });
  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: 1,
    items: [token1],
  });
  new MockGameObject({
    templateMetadata: "sheet:base/command",
    owningPlayerSlot: 1,
  });

  expect(token1.getContainer()).toBeDefined();

  const addCommandTokens: AddCommandTokens = new AddCommandTokens();
  const playerSlot: number = 1;
  const count: number = 2;
  expect(addCommandTokens.addCommandTokens(playerSlot, count)).toBe(false);

  expect(token1.getContainer()).toBeUndefined();
  expect(token1.getPosition().toString()).toBe("(X=33,Y=16,Z=0)");
});
