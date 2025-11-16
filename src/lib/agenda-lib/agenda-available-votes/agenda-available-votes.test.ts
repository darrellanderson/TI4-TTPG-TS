import { Card } from "@tabletop-playground/api";
import { CardUtil, PlayerSlot } from "ttpg-darrell";
import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";
import { AgendaAvailableVotes } from "./agenda-available-votes";

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid).setPosition([100, 0, 0]);
    }
  }
});

it("constructor", () => {
  new AgendaAvailableVotes();
});

it("getPlayerSlotToPerPlanetBonus (empty)", () => {
  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlotToPerPlanetBonus: Map<PlayerSlot, number> =
    agendaAvailableVotes._getPlayerSlotToPerPlanetBonus();
  expect(playerSlotToPerPlanetBonus.size).toBe(0);
});

it("getPlayerSlotToPerPlanetBonus (xxcha commander)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.leader.commander:pok/elder-qanoj");

  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlotToPerPlanetBonus: Map<PlayerSlot, number> =
    agendaAvailableVotes._getPlayerSlotToPerPlanetBonus();
  expect(playerSlotToPerPlanetBonus.size).toBe(1);
  expect(playerSlotToPerPlanetBonus.get(10)).toBe(1);
});

it("getPlayerSlotToPerPlanetBonus (xxcha alliance)", () => {
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
  MockCard.simple("card.leader.commander:pok/elder-qanoj", {
    position: [0, 1, 0],
  });
  MockCard.simple("card.alliance:pok/xxcha", { position: [0, -1, 0] });

  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlotToPerPlanetBonus: Map<PlayerSlot, number> =
    agendaAvailableVotes._getPlayerSlotToPerPlanetBonus();
  expect(playerSlotToPerPlanetBonus.size).toBe(2);
  expect(playerSlotToPerPlanetBonus.get(10)).toBe(1);
  expect(playerSlotToPerPlanetBonus.get(11)).toBe(1);
});

it("isRepresentativeGovernment (false)", () => {
  const agendaAvailableVotes = new AgendaAvailableVotes();
  expect(agendaAvailableVotes._isRepresentativeGovernment()).toBe(false);
});

it("isRepresentativeGovernment (true)", () => {
  MockCard.simple("card.agenda:pok/representative-government");
  const agendaAvailableVotes = new AgendaAvailableVotes();
  expect(agendaAvailableVotes._isRepresentativeGovernment()).toBe(true);
});

it("_getXxekirGromOmegaPlayerSlots (empty)", () => {
  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlots = agendaAvailableVotes._getXxekirGromOmegaPlayerSlots();
  expect(playerSlots.size).toBe(0);
});

it("_getXxekirGromOmegaPlayerSlots (xxekir)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.leader.hero:codex.vigil/xxekir-grom.omega");
  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlots = agendaAvailableVotes._getXxekirGromOmegaPlayerSlots();
  expect(playerSlots.size).toBe(1);
  expect(playerSlots.has(10)).toBe(true);
});

it("_getFaceUpPlanetCards", () => {
  const planetCard: Card = MockCard.simple("card.planet:base/mecatol-rex");
  const agendaAvailableVotes = new AgendaAvailableVotes();
  const faceUpPlanetCards = agendaAvailableVotes._getFaceUpPlanetCards();
  expect(faceUpPlanetCards.length).toBe(1);
  expect(faceUpPlanetCards[0]).toBe(planetCard);
});

it("getPlayerSlotToAvailableVotes (empty)", () => {
  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlotToAvailableVotes: Map<PlayerSlot, number> =
    agendaAvailableVotes.getPlayerSlotToAvailableVotes();
  expect(playerSlotToAvailableVotes.size).toBe(0);
});

it("getPlayerSlotToAvailableVotes (normal)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });

  MockCard.simple("card.planet:base/mecatol-rex"); // 1/6
  MockCard.simple("card.planet:base/zohbat"); // 3/1

  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlotToAvailableVotes: Map<PlayerSlot, number> =
    agendaAvailableVotes.getPlayerSlotToAvailableVotes();
  expect(playerSlotToAvailableVotes.size).toBe(2);
  expect(playerSlotToAvailableVotes.get(10)).toBe(7);
  expect(playerSlotToAvailableVotes.get(11)).toBe(0);
});

it("getPlayerSlotToAvailableVotes (per-planet bonus)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.leader.commander:pok/elder-qanoj");

  const planetCard: Card = MockCard.simple("card.planet:base/zohbat"); // 3/1
  expect(new CardUtil().isLooseCard(planetCard, false)).toBe(true);

  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlotToAvailableVotes: Map<PlayerSlot, number> =
    agendaAvailableVotes.getPlayerSlotToAvailableVotes();
  expect(playerSlotToAvailableVotes.size).toBe(1);
  expect(playerSlotToAvailableVotes.get(10)).toBe(2);
});

it("getPlayerSlotToAvailableVotes (representative government)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.agenda:pok/representative-government");
  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlotToAvailableVotes: Map<PlayerSlot, number> =
    agendaAvailableVotes.getPlayerSlotToAvailableVotes();
  expect(playerSlotToAvailableVotes.size).toBe(1);
  expect(playerSlotToAvailableVotes.get(10)).toBe(1);
});

it("getPlayerSlotToAvailableVotes (card.leader.hero:codex.vigil/xxekir)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.leader.hero:codex.vigil/xxekir-grom.omega");

  const planetCard: Card = MockCard.simple("card.planet:base/zohbat"); // 3/1
  expect(new CardUtil().isLooseCard(planetCard, false)).toBe(true);

  const agendaAvailableVotes = new AgendaAvailableVotes();
  const playerSlotToAvailableVotes: Map<PlayerSlot, number> =
    agendaAvailableVotes.getPlayerSlotToAvailableVotes();
  expect(playerSlotToAvailableVotes.size).toBe(1);
  expect(playerSlotToAvailableVotes.get(10)).toBe(4);
});

it("_getPlayerSlotToTriadVotes", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const agendaAvailableVotes = new AgendaAvailableVotes();
  let playerSlotToTriadVotes: Map<PlayerSlot, number>;

  playerSlotToTriadVotes = agendaAvailableVotes._getPlayerSlotToTriadVotes();
  expect(playerSlotToTriadVotes.size).toBe(0);
  expect(playerSlotToTriadVotes.get(10)).toBeUndefined();

  MockCard.simple("card.relic:thunders-edge/the-triad");
  MockCard.simple("card.breakthrough:thunders-edge/archons-gift");

  playerSlotToTriadVotes = agendaAvailableVotes._getPlayerSlotToTriadVotes();
  expect(playerSlotToTriadVotes.size).toBe(1);
  expect(playerSlotToTriadVotes.get(10)).toBe(3);

  MockCard.simple("card.exploration.cultural:pok/cultural-relic-fragment");
  MockCard.simple("card.exploration.cultural:pok/cultural-relic-fragment");
  MockCard.simple("card.exploration.cultural:pok/cultural-relic-fragment");
  MockCard.simple("card.exploration.frontier:pok/unknown-relic-fragment");
  MockCard.simple("card.exploration.hazardous:pok/hazardous-relic-fragment");
  MockCard.simple("card.exploration.industrial:pok/industrial-relic-fragment");

  playerSlotToTriadVotes = agendaAvailableVotes._getPlayerSlotToTriadVotes();
  expect(playerSlotToTriadVotes.size).toBe(1);
  expect(playerSlotToTriadVotes.get(10)).toBe(7);
});
