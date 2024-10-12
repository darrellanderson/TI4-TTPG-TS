import { Container, GameObject, Player } from "@tabletop-playground/api";
import { MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";

import { RSwapSplitCombine } from "./r-swap-split-combine";

import { addObjectTemplatesToMockWorld } from "../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  new RSwapSplitCombine();
});

it("getPlasticContainer", () => {
  const container: Container = new MockContainer({
    templateMetadata: "container.unit:base/infantry",
    owningPlayerSlot: 3,
  });
  const player: Player = new MockPlayer({ slot: 3 });

  const r = new RSwapSplitCombine();
  const found: Container | undefined = r.getPlasticContainer(
    "infantry",
    player
  );

  expect(found).toBe(container);
});

it("get/put infantry", () => {
  const plastic: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: 3,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.unit:base/infantry",
    owningPlayerSlot: 3,
    items: [plastic],
  });
  const player: Player = new MockPlayer({ slot: 3 });
  const r = new RSwapSplitCombine();

  expect(container.getItems().includes(plastic)).toBe(true);

  const found: GameObject | undefined = r.getPlastic("infantry", player);
  expect(found).toBe(plastic);
  expect(container.getItems().includes(plastic)).toBe(false);

  r.putPlastic("infantry", player, plastic);
  expect(container.getItems().includes(plastic)).toBe(true);
});

it("get/put fighter", () => {
  const plastic: GameObject = new MockGameObject({
    templateMetadata: "unit:base/fighter",
    owningPlayerSlot: 3,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.unit:base/fighter",
    owningPlayerSlot: 3,
    items: [plastic],
  });
  const player: Player = new MockPlayer({ slot: 3 });
  const r = new RSwapSplitCombine();

  expect(container.getItems().includes(plastic)).toBe(true);

  const found: GameObject | undefined = r.getPlastic("fighter", player);
  expect(found).toBe(plastic);
  expect(container.getItems().includes(plastic)).toBe(false);

  r.putPlastic("fighter", player, plastic);
  expect(container.getItems().includes(plastic)).toBe(true);
});

it("swap infantry", () => {
  const plastic: MockGameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: 3,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.unit:base/infantry",
    owningPlayerSlot: 3,
    items: [plastic],
  });
  const player: Player = new MockPlayer({ slot: 3 });
  const token: MockGameObject = new MockGameObject({
    templateMetadata: "token:base/infantry-1",
  });
  new RSwapSplitCombine().init();

  expect(container.getItems().includes(plastic)).toBe(true);

  token._primaryActionAsPlayer(player);
  expect(container.getItems().includes(plastic)).toBe(false);

  plastic._primaryActionAsPlayer(player);
  expect(container.getItems().includes(plastic)).toBe(true);
});

it("swap fighter", () => {
  const plastic: MockGameObject = new MockGameObject({
    templateMetadata: "unit:base/fighter",
    owningPlayerSlot: 3,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container.unit:base/fighter",
    owningPlayerSlot: 3,
    items: [plastic],
  });
  const player: Player = new MockPlayer({ slot: 3 });
  const token: MockGameObject = new MockGameObject({
    templateMetadata: "token:base/fighter-1",
  });
  new RSwapSplitCombine().init();

  expect(container.getItems().includes(plastic)).toBe(true);

  token._primaryActionAsPlayer(player);
  expect(container.getItems().includes(plastic)).toBe(false);

  plastic._primaryActionAsPlayer(player);
  expect(container.getItems().includes(plastic)).toBe(true);
});
