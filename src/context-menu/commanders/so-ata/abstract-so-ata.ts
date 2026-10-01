import {
  Card,
  CardHolder,
  Color,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  Find,
  IGlobal,
  NSID,
  OnCardBecameSingletonOrDeck,
  PlayerSlot,
} from "ttpg-darrell";

export const ACTION_REPORT_ACTION_CARDS: string =
  "*Tell Owning Player My Action Cards";
export const ACTION_REPORT_PROMISSORY_NOTES: string =
  "*Tell Owning Player My Promissory Notes";
export const ACTION_REPORT_SECRET_OBJECTIVES: string =
  "*Tell Owning Player My Secret Objectives";

export type ReportCardType = "action" | "promissory" | "secret";

/**
 * Yssaril commander "card.leader.commander:pok/so-ata"
 * or alliance: "card.alliance:pok/yssaril"
 * "After another player activates a system that contains your units: You may
 * look at that player's action cards, promissory notes, or secret objectives."
 */
export abstract class AbstractSoAta implements IGlobal {
  private readonly _find: Find = new Find();
  private readonly _cardNsid: string;

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string
  ): void => {
    const reportCardType: ReportCardType | undefined =
      this._getReportCardType(identifier);
    if (reportCardType) {
      const ownerPos: Vector = object.getPosition();
      const ownerSlot: PlayerSlot =
        this._find.closestOwnedCardHolderOwner(ownerPos);
      const clickingPlayerSlot: PlayerSlot = player.getSlot();
      const cardNames: Array<string> = this._getCards(
        reportCardType,
        clickingPlayerSlot
      );
      this._doReport(reportCardType, clickingPlayerSlot, ownerSlot, cardNames);
    }
  };

  constructor(cardNsid: string) {
    this._cardNsid = cardNsid;
  }

  init(): void {
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      (card: Card, _player?: Player): void => {
        const nsid: string = NSID.get(card);
        if (nsid === this._cardNsid) {
          card.onCustomAction.remove(this._onCustomAction);
          card.onCustomAction.add(this._onCustomAction);
          card.removeCustomAction(ACTION_REPORT_ACTION_CARDS);
          card.removeCustomAction(ACTION_REPORT_PROMISSORY_NOTES);
          card.removeCustomAction(ACTION_REPORT_SECRET_OBJECTIVES);
        }
      }
    );

    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(
      (card: Card, oldNsid: string, _player?: Player): void => {
        if (oldNsid === this._cardNsid) {
          card.onCustomAction.remove(this._onCustomAction);
          card.removeCustomAction(ACTION_REPORT_ACTION_CARDS);
          card.removeCustomAction(ACTION_REPORT_PROMISSORY_NOTES);
          card.removeCustomAction(ACTION_REPORT_SECRET_OBJECTIVES);
        }
      }
    );
  }

  _getReportCardType(customActionName: string): ReportCardType | undefined {
    if (customActionName === ACTION_REPORT_ACTION_CARDS) {
      return "action";
    } else if (customActionName === ACTION_REPORT_PROMISSORY_NOTES) {
      return "promissory";
    } else if (customActionName === ACTION_REPORT_SECRET_OBJECTIVES) {
      return "secret";
    }
    return undefined;
  }

  _getCards(
    reportCardType: ReportCardType,
    playerSlot: PlayerSlot
  ): Array<string> {
    const cardNames: Array<string> = [];

    const cardHolder: CardHolder | undefined =
      this._find.findCardHolderBySlot(playerSlot);
    if (cardHolder) {
      cardHolder.getCards().forEach((card: Card) => {
        const cardName: string = card.getCardDetails().name;
        const nsid: string = NSID.get(card);
        if (
          (reportCardType === "action" && nsid.startsWith("card.action:")) ||
          (reportCardType === "promissory" &&
            nsid.startsWith("card.promissory:")) ||
          (reportCardType === "secret" &&
            nsid.startsWith("card.objective.secret:"))
        ) {
          cardNames.push(cardName);
        }
      });
    }

    return cardNames;
  }

  _doReport(
    reportCardType: ReportCardType,
    clickingPlayerSlot: PlayerSlot,
    reportToPlayerSlot: PlayerSlot,
    cardNames: Array<string>
  ): void {
    const clickingPlayerName: string =
      TI4.playerName.getBySlot(clickingPlayerSlot);
    const clickingColor: Color = world.getSlotColor(clickingPlayerSlot);
    const reportToPlayerName: string =
      TI4.playerName.getBySlot(reportToPlayerSlot);

    const globalMsg: string = `So Ata: ${clickingPlayerName} told ${reportToPlayerName} their ${reportCardType} cards`;
    Broadcast.broadcastAll(globalMsg, clickingColor);

    const reportToPlayer: Player | undefined =
      world.getPlayerBySlot(reportToPlayerSlot);
    const msg: string = `So Ata: ${clickingPlayerName} reports ${reportCardType} cards: ${cardNames.join(", ")}`;
    if (reportToPlayer) {
      Broadcast.chatOne(reportToPlayer, msg, clickingColor);
    }
  }
}
