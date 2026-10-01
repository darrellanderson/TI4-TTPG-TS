import {
  Card,
  CardHolder,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockPlayer,
  mockWorld,
} from "ttpg-mock";
import {
  MAGEON_IMPLANTS_ACTION,
  MAGEON_IMPLANTS_NSID,
  RightClickMageonImplants,
} from "./right-click-mageon-implants";
import { Find, PlayerSlot } from "ttpg-darrell";

it("constructor/init", () => {
  new RightClickMageonImplants().init();
});

it("_onCustomAction", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const seatIndex: number = 0;
  const playerSlot: PlayerSlot =
    TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
  expect(playerSlot).toEqual(10);

  const colorName: string | undefined =
    TI4.playerColor.getSlotColorName(playerSlot);
  expect(colorName).toEqual("green");

  new RightClickMageonImplants().init();

  const card: MockCard = MockCard.simple(MAGEON_IMPLANTS_NSID);
  MockCard.simple(MAGEON_IMPLANTS_NSID); // second card to reset action names
  process.flushTicks();

  const object: GameObject | undefined = world.getObjectById(card.getId());
  expect(object).toBe(card);

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, MAGEON_IMPLANTS_ACTION);
});

it("getActionCardNames", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    cards: [
      new MockCard({
        cardDetails: [
          new MockCardDetails({
            metadata: "card.action:base/my-action",
            name: "My Action",
          }),
        ],
      }),
      new MockCard({
        cardDetails: [
          new MockCardDetails({
            metadata: "card.agenda:base/my-agenda",
            name: "My Agenda",
          }),
        ],
      }),
    ],
  });

  const cardHolder: CardHolder | undefined = new Find().findCardHolderBySlot(
    10
  );
  expect(cardHolder).toBeDefined();

  const rightClickMageonImplants: RightClickMageonImplants =
    new RightClickMageonImplants();
  const actionCardNames: Array<string> =
    rightClickMageonImplants.getActionCardNames(10);
  expect(actionCardNames).toEqual(["My Action"]);
});

it("reportActionCardNames", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const rightClickMageonImplants: RightClickMageonImplants =
    new RightClickMageonImplants();

  const card: Card = MockCard.simple(MAGEON_IMPLANTS_NSID);

  const pos: Vector = card.getPosition();
  const mageonOwnerSlot: PlayerSlot = new Find().closestOwnedCardHolderOwner(
    pos
  );
  expect(mageonOwnerSlot).toEqual(10);

  const clickingPlayerSlot: PlayerSlot = 10;
  const reportToPlayerSlot: PlayerSlot = 11;
  const actionCardNames: Array<string> = ["a"];

  const reportToPlayer: Player = new MockPlayer({ slot: reportToPlayerSlot });
  mockWorld._addPlayer(reportToPlayer);

  rightClickMageonImplants.reportActionCardNames(
    clickingPlayerSlot,
    reportToPlayerSlot,
    actionCardNames
  );
});
