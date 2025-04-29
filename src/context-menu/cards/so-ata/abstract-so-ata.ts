import { Card, GameObject, Player } from "@tabletop-playground/api";
import { IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";

export const ACTION_REPORT_ACTION_CARDS: string = "*So Ata: Action Cards";
export const ACTION_REPORT_PROMISSORY_NOTES: string =
  "*So Ata: Promissory Notes";
export const ACTION_REPORT_SECRET_OBJECTIVES: string =
  "*So Ata: Secret Objectives";

/**
 * Yssaril commander "card.leader.commander:pok/so-ata"
 * or alliance: "card.alliance:pok/yssaril"
 * "After another player activates a system that contains your units: You may
 * look at that player's action cards, promissory notes, or secret objectives."
 */
export abstract class AbstractSoAta implements IGlobal {
  private readonly _cardNsid: string;

  private readonly _onSingletonCardCreated = (
    card: Card,
    _player?: Player
  ): void => {
    const nsid: string = NSID.get(card);
    if (nsid === this._cardNsid) {
      card.onCustomAction.remove(this._onCustomAction);
      card.onCustomAction.add(this._onCustomAction);
    }
  };

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string
  ): void => {};

  constructor(cardNsid: string) {
    this._cardNsid = cardNsid;
  }

  init(): void {
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      (card: Card, player?: Player): void => {}
    );
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(
      (card: Card, oldNsid: string, player?: Player): void => {}
    );
  }
}
