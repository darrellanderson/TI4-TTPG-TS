import { CardHolder, Player } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockPlayer,
  mockWorld,
} from "ttpg-mock";
import {
  AbstractSoAta,
  ACTION_REPORT_ACTION_CARDS,
  ACTION_REPORT_PROMISSORY_NOTES,
  ACTION_REPORT_SECRET_OBJECTIVES,
  ReportCardType,
} from "./abstract-so-ata";
import { Find, PlayerSlot } from "ttpg-darrell";

const MY_NSID: string = "card:source/my-so-ata";
class MySoAta extends AbstractSoAta {
  constructor() {
    super(MY_NSID);
  }
}

it("constructor/init", () => {
  new MySoAta().init();
});

it("events", () => {
  new MySoAta().init();

  // Singleton card created.
  const card1: MockCard = MockCard.simple(MY_NSID);
  const card2: MockCard = MockCard.simple("what:source/name");
  process.flushTicks();

  // Singleton card made deck.
  const toFront: boolean | undefined = undefined;
  const offset: number | undefined = undefined;
  const animate: boolean | undefined = undefined;
  const flipped: boolean | undefined = undefined;
  const player: Player = new MockPlayer();
  card1._addCardsAsPlayer(card2, toFront, offset, animate, flipped, player);
  process.flushTicks();
});

it("_onCustomAction", () => {
  new MySoAta().init(); // must happen before creating the card

  const card: MockCard = MockCard.simple(MY_NSID);
  process.flushTicks();

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, ACTION_REPORT_ACTION_CARDS);
});

it("_getReportCardType", () => {
  const mySoAta = new MySoAta();
  expect(mySoAta._getReportCardType(ACTION_REPORT_ACTION_CARDS)).toBe("action");
  expect(mySoAta._getReportCardType(ACTION_REPORT_PROMISSORY_NOTES)).toBe(
    "promissory"
  );
  expect(mySoAta._getReportCardType(ACTION_REPORT_SECRET_OBJECTIVES)).toBe(
    "secret"
  );
  expect(mySoAta._getReportCardType("~~unknown~~")).toBeUndefined();
});

it("_getCards", () => {
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
            metadata: "card.promissory:base/my-promissory",
            name: "My Promissory",
          }),
        ],
      }),
      new MockCard({
        cardDetails: [
          new MockCardDetails({
            metadata: "card.objective.secret:base/my-secret",
            name: "My Secret",
          }),
        ],
      }),
    ],
  });

  const cardHolder: CardHolder | undefined = new Find().findCardHolderBySlot(
    10
  );
  expect(cardHolder).toBeDefined();

  const mySoAta = new MySoAta();

  let reportCardType: ReportCardType;
  let cardNames: Array<string>;
  const playerSlot: PlayerSlot = 10;

  reportCardType = "action";
  cardNames = mySoAta._getCards(reportCardType, playerSlot);
  expect(cardNames).toEqual(["My Action"]);

  reportCardType = "promissory";
  cardNames = mySoAta._getCards(reportCardType, playerSlot);
  expect(cardNames).toEqual(["My Promissory"]);

  reportCardType = "secret";
  cardNames = mySoAta._getCards(reportCardType, playerSlot);
  expect(cardNames).toEqual(["My Secret"]);
});

it("_doReport", () => {
  const mySoAta = new MySoAta();

  const reportCardType: ReportCardType = "action";
  const clickingPlayerSlot: PlayerSlot = 10;
  const reportToPlayerSlot: PlayerSlot = 11;
  const cardNames: Array<string> = [];

  const player: Player = new MockPlayer({ slot: reportToPlayerSlot });
  mockWorld._addPlayer(player);

  mySoAta._doReport(
    reportCardType,
    clickingPlayerSlot,
    reportToPlayerSlot,
    cardNames
  );
});
