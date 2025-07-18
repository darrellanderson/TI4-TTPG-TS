import { Card, Player } from "@tabletop-playground/api";
import {
  AbstractMabanOmega,
  MABAN_OMEGA_ACTION_NAME,
} from "./abstract-maban-omega";
import {
  GameObject,
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
  MockSnapPoint,
} from "ttpg-mock";
import { PlayerSlot } from "ttpg-darrell";

const NSID: string = "card:source/my-name";

class MyMabanOmega extends AbstractMabanOmega {
  constructor() {
    super(NSID);
  }
}

it("constructor/init", () => {
  new MyMabanOmega().init();
});

it("isCommanderActive", () => {
  const card: Card = MockCard.simple(
    "card.leader.commander:codex.vigil/maban.omega"
  );

  const mabanOmega: MyMabanOmega = new MyMabanOmega();
  expect(mabanOmega.isCommanderActive()).toBe(true);

  card.flipOrUpright();
  expect(mabanOmega.isCommanderActive()).toBe(false);
});

it("isOwningPlayer", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-10, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [10, 0, 0],
  });
  const player: Player = new MockPlayer({ slot: 10 });
  const mabanOmega: MyMabanOmega = new MyMabanOmega();

  const card: Card = MockCard.simple(NSID);

  card.setPosition([-10, 0, 0]);
  expect(mabanOmega.isOwningPlayer(card, player)).toBe(true);

  card.setPosition([10, 0, 0]);
  expect(mabanOmega.isOwningPlayer(card, player)).toBe(false);
});

it("getNeighboringPlayerSlots", () => {
  TI4.config.setPlayerCount(4);

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, -1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [1, -1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
    position: [1, 1, 0],
  });

  const seats: Array<PlayerSlot> = TI4.playerSeats
    .getAllSeats()
    .map((playerSeat) => playerSeat.playerSlot);
  expect(seats).toEqual([10, 11, 12, 13]);

  const mabanOmega: MyMabanOmega = new MyMabanOmega();

  let player: Player;
  let neighboringPlayerSlots: Array<PlayerSlot>;

  player = new MockPlayer({ slot: 10 });
  neighboringPlayerSlots = mabanOmega.getNeighboringPlayerSlots(player);
  expect(neighboringPlayerSlots).toEqual([13, 11]);

  player = new MockPlayer({ slot: 11 });
  neighboringPlayerSlots = mabanOmega.getNeighboringPlayerSlots(player);
  expect(neighboringPlayerSlots).toEqual([10, 12]);

  player = new MockPlayer({ slot: 12 });
  neighboringPlayerSlots = mabanOmega.getNeighboringPlayerSlots(player);
  expect(neighboringPlayerSlots).toEqual([11, 13]);

  player = new MockPlayer({ slot: 13 });
  neighboringPlayerSlots = mabanOmega.getNeighboringPlayerSlots(player);
  expect(neighboringPlayerSlots).toEqual([12, 10]);
});

it("getPromissoryNotes", () => {
  const promissoryCard: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.promissory:base/my-promissory",
        name: "My Promissory",
      }),
    ],
  });
  const actionCard: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.action:base/my-action",
        name: "My Action",
      }),
    ],
  });

  const playerSlot: PlayerSlot = 10;
  const _cardHolder: MockCardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
    cards: [promissoryCard, actionCard],
  });

  const mabanOmega: MyMabanOmega = new MyMabanOmega();
  const promissoryNotes: Array<string> =
    mabanOmega.getPromissoryNotes(playerSlot);
  expect(promissoryNotes).toEqual(["My Promissory"]);
});

it("getAgendaDeckTopBottom", () => {
  const agendaDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.agenda:base/my-agenda-bottom",
        name: "My Agenda Bottom",
      }),
      new MockCardDetails({
        metadata: "card.agenda:base/my-agenda-top",
        name: "My Agenda Top",
      }),
    ],
  });

  const _mat: GameObject = new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-agenda"],
        snappedObject: agendaDeck,
      }),
    ],
  });

  const mabanOmega: MyMabanOmega = new MyMabanOmega();
  const agendaDeckTopBottom: { top: string; bottom: string } | undefined =
    mabanOmega.getAgendaDeckTopBottom();
  expect(agendaDeckTopBottom).toEqual({
    bottom: "My Agenda Bottom",
    top: "My Agenda Top",
  });
});

it("doMabanOmegaAction", () => {
  TI4.config.setPlayerCount(4);

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, -1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [1, -1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
    position: [1, 1, 0],
  });

  const mabanOmega: MyMabanOmega = new MyMabanOmega();
  mabanOmega.init();

  const mabanCard: Card = new MockCard({ position: [-1, 1, 0] });
  const player: Player = new MockPlayer({ slot: 10 });
  mabanOmega.doMabanOmegaAction(mabanCard, player);
});

it("custom action handler", () => {
  TI4.config.setPlayerCount(4);

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-1, 1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-1, -1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [1, -1, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
    position: [1, 1, 0],
  });

  const agendaDeck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.agenda:base/my-agenda-bottom",
        name: "My Agenda Bottom",
      }),
      new MockCardDetails({
        metadata: "card.agenda:base/my-agenda-top",
        name: "My Agenda Top",
      }),
    ],
  });

  const _mat: GameObject = new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-agenda"],
        snappedObject: agendaDeck,
      }),
    ],
  });

  // Active commander.
  MockCard.simple("card.leader.commander:codex.vigil/maban.omega");

  const mabanOmega: MyMabanOmega = new MyMabanOmega();
  mabanOmega.init();

  const mabanCard: MockCard = MockCard.simple(NSID);
  mabanCard.setPosition([-1, 1, 0]);
  process.flushTicks();

  const player: Player = new MockPlayer({ slot: 10 });
  mabanCard._customActionAsPlayer(player, MABAN_OMEGA_ACTION_NAME);
});

it("custom action handler - not owning player", () => {
  const mabanOmega: MyMabanOmega = new MyMabanOmega();
  mabanOmega.init();

  const mabanCard: MockCard = MockCard.simple(NSID);
  mabanCard.setPosition([-1, 1, 0]);
  process.flushTicks();

  const player: Player = new MockPlayer({ slot: 10 });
  mabanCard._customActionAsPlayer(player, MABAN_OMEGA_ACTION_NAME);
});

it("custom action handler - not owning player", () => {
  const mabanOmega: MyMabanOmega = new MyMabanOmega();
  mabanOmega.init();

  const mabanCard: MockCard = MockCard.simple(NSID);
  mabanCard.setPosition([-1, 1, 0]);
  process.flushTicks();

  const player: Player = new MockPlayer({ slot: 10 });
  mabanCard._customActionAsPlayer(player, MABAN_OMEGA_ACTION_NAME);
});

it("custom action handler - not active commander", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const mabanOmega: MyMabanOmega = new MyMabanOmega();
  mabanOmega.init();

  const mabanCard: MockCard = MockCard.simple(NSID);
  mabanCard.setPosition([-1, 1, 0]);
  process.flushTicks();

  const player: Player = new MockPlayer({ slot: 10 });
  mabanCard._customActionAsPlayer(player, MABAN_OMEGA_ACTION_NAME);
});
