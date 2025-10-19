import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";
import { AgendaTurnOrder } from "./agenda-turn-order";
import { GameObject } from "@tabletop-playground/api";

it("constructor", () => {
  new AgendaTurnOrder();
});

it("_getSpeakerTokenOrThrow (found)", () => {
  const speakerToken: GameObject = MockGameObject.simple("token:base/speaker");
  const agendaTurnOrder = new AgendaTurnOrder();
  const found: GameObject = agendaTurnOrder._getSpeakerTokenOrThrow();
  expect(found).toBe(speakerToken);
});

it("_getSpeakerTokenOrThrow (throw)", () => {
  const agendaTurnOrder = new AgendaTurnOrder();
  expect(() => agendaTurnOrder._getSpeakerTokenOrThrow()).toThrow(
    "missing speaker token"
  );
});

it("_getSpeakerTokenSeatIndexOrThrow (found)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("token:base/speaker");
  const agendaTurnOrder = new AgendaTurnOrder();
  const found: number = agendaTurnOrder._getSpeakerTokenSeatIndexOrThrow();
  expect(found).toBe(0);
});

it("_getSpeakerTokenSeatIndexOrThrow (missing card holder)", () => {
  MockGameObject.simple("token:base/speaker");
  const agendaTurnOrder = new AgendaTurnOrder();
  expect(() => {
    agendaTurnOrder._getSpeakerTokenSeatIndexOrThrow();
  }).toThrow();
});

it("_getZealPlayerSlots", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockGameObject.simple("sheet.faction:pok/argent");
  expect(TI4.factionRegistry.getPlayerSlotToFaction().size).toBe(1);

  const agendaTurnOrder = new AgendaTurnOrder();
  const found = agendaTurnOrder._getZealPlayerSlots();
  expect(found).toEqual([10]);
});

it("getWhensOrAftersOrder", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [0, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [0, -1, 0],
  });
  MockGameObject.simple("token:base/speaker", { position: [0, 1, 0] });
  const agendaTurnOrder = new AgendaTurnOrder();
  const found = agendaTurnOrder.getWhensOrAftersOrder();
  expect(found).toEqual([10, 11]);
});

it("getVotingOrder", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [0, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [0, -1, 0],
  });
  MockGameObject.simple("token:base/speaker", { position: [0, 1, 0] });
  const agendaTurnOrder = new AgendaTurnOrder();
  const found = agendaTurnOrder.getVotingOrder();
  expect(found).toEqual([11, 12, 10]);
});

it("getVotingOrder (reverse)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [0, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [0, -1, 0],
  });
  MockGameObject.simple("token:base/speaker", { position: [0, 1, 0] });
  MockGameObject.simple("card.action:codex.ordinian/hack-election");

  const agendaTurnOrder = new AgendaTurnOrder();
  const found = agendaTurnOrder.getVotingOrder();
  expect(found).toEqual([12, 11, 10]);
});

it("getVotingOrder (zeal)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [0, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [0, -1, 0],
  });
  MockGameObject.simple("token:base/speaker", { position: [0, 1, 0] });
  MockGameObject.simple("sheet.faction:pok/argent", { position: [0, 1, 0] });

  const agendaTurnOrder = new AgendaTurnOrder();
  const found = agendaTurnOrder.getVotingOrder();
  expect(found).toEqual([10, 11, 12]);
});

it("getVotingOrder (hack election)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [0, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [0, -1, 0],
  });
  MockGameObject.simple("token:base/speaker", { position: [0, 1, 0] });

  const agendaTurnOrder = new AgendaTurnOrder();
  let found = agendaTurnOrder.getVotingOrder();
  expect(found).toEqual([11, 12, 10]);

  MockCard.simple("card.action:thunders-edge/hack-election", {
    position: [-1, 0, 0],
  });

  found = agendaTurnOrder.getVotingOrder();
  expect(found).toEqual([12, 10, 11]);
});
