import { Card, CardHolder, GameObject } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardHolder,
  MockContainer,
  MockGameObject,
} from "ttpg-mock";
import { AddCommandTokens } from "./add-command-tokens";

it("constructor", () => {
  new AddCommandTokens();
});

it("getPlayerSlotToCommandTokenCount", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
    position: [10, 0, 0],
  });
  const slotToCount: Map<number, number> =
    new AddCommandTokens().getPlayerSlotToCommandTokenCount();
  expect(slotToCount.get(1)).toBe(2);
});

it("getPlayerSlotToCommandTokenCount (versatile, hyper-metabolism, cybernetic-enhancements)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
    position: [10, 0, 0],
  });
  new MockGameObject({
    templateMetadata: "sheet.faction:base/sol", // versatile
    position: [10, 0, 0],
    owningPlayerSlot: 1,
  });
  MockCard.simple("card.technology.green:base/hyper-metabolism", {
    position: [10, 0, 0],
  });
  const cyberneticEnhancements: Card = MockCard.simple(
    "card.promissory:base/cybernetic-enhancements",
    {
      position: [10, 0, 0],
    }
  );

  const l1zixCardHolder: CardHolder = new MockCardHolder({
    owningPlayerSlot: 2,
    position: [20, 0, 0],
  });
  new MockGameObject({
    templateMetadata: "sheet.faction:base/l1z1x",
    position: [20, 0, 0],
    owningPlayerSlot: 2,
  });

  const slotToCount: Map<number, number> =
    new AddCommandTokens().getPlayerSlotToCommandTokenCount();
  expect(slotToCount.get(1)).toBe(5);
  expect(l1zixCardHolder.getCards().includes(cyberneticEnhancements)).toBe(
    true
  );
});

it("addAllCommandTokens", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
    position: [10, 0, 0],
  });
  new MockGameObject({
    templateMetadata: "sheet.faction:base/sol", // versatile
    position: [10, 0, 0],
    owningPlayerSlot: 1,
  });

  const tooFewTokens: Set<number> =
    new AddCommandTokens().addAllCommandTokens();
  expect(tooFewTokens.size).toBe(1);
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
  expect(token1.getPosition().toString()).toBe("(X=11.5,Y=-3,Z=0)");
  expect(token2.getPosition().toString()).toBe("(X=11.5,Y=-1,Z=0)");
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
  expect(token1.getPosition().toString()).toBe("(X=11.5,Y=-3,Z=0)");
});
