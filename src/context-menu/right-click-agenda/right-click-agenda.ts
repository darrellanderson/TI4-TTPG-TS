import { Card, Player } from "@tabletop-playground/api";
import { Find, IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";

export const ACTION_PLACE_TOP: string = "*Place Agenda Top";
export const ACTION_PLACE_BOTTOM: string = "*Place Agenda Bottom";

export class RightClickAgenda implements IGlobal {
  private readonly _find: Find = new Find();

  private readonly _onSingletonCardCreated = (
    card: Card,
    _player?: Player
  ): void => {
    const nsid: string = NSID.get(card);
    if (nsid.startsWith("card.agenda:")) {
      card.addCustomAction(ACTION_PLACE_TOP);
      card.addCustomAction(ACTION_PLACE_BOTTOM);
      card.onCustomAction.add(this._onCustomAction);
    }
  };

  private readonly _onSingletonCardMadeDeck = (
    card: Card,
    oldNsid: string,
    _player?: Player
  ): void => {
    if (oldNsid.startsWith("card.agenda:")) {
      card.removeCustomAction(ACTION_PLACE_TOP);
      card.removeCustomAction(ACTION_PLACE_BOTTOM);
      card.onCustomAction.remove(this._onCustomAction);
    }
  };

  private readonly _onCustomAction = (
    object: Card,
    _player: Player,
    identifier: string
  ) => {
    if (identifier === ACTION_PLACE_TOP) {
      this._place(true, object);
    } else if (identifier === ACTION_PLACE_BOTTOM) {
      this._place(false, object);
    }
  };

  init(): void {
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      this._onSingletonCardCreated
    );
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(
      this._onSingletonCardMadeDeck
    );
  }

  _place(isTop: boolean, card: Card): void {
    const deckSnapPointTag: string = "deck-agenda";
    const deck: Card | undefined =
      this._find.findDeckOrDiscard(deckSnapPointTag);

    if (deck) {
      const offset: number = 0;
      const animate: boolean = true;
      const flipped: boolean = false;
      deck.addCards(card, !isTop, offset, animate, flipped);
    }
  }
}
