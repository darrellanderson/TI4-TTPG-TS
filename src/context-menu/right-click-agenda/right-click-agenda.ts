import { Card, GameObject, Player } from "@tabletop-playground/api";
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
      this._addAgendaDeckDescription(ACTION_PLACE_TOP);
    } else if (identifier === ACTION_PLACE_BOTTOM) {
      this._place(false, object);
      this._addAgendaDeckDescription(ACTION_PLACE_BOTTOM);
    }
  };

  private readonly _onStrategyCardPlayed = (
    strategyCard: GameObject,
    _player: Player
  ): void => {
    const nsid: string = NSID.get(strategyCard);
    if (nsid.startsWith("tile.strategy-card:") && nsid.includes("/politics")) {
      this._clearAgendaDeckDescription();
    }
  };

  _getAgendaDeck(): Card | undefined {
    const deckSnapPointTag: string = "deck-agenda";
    const discardSnapPointTag: string = "discard-agenda";
    const shuffleDiscard: boolean = true;
    const deck: Card | undefined = this._find.findDeckOrDiscard(
      deckSnapPointTag,
      discardSnapPointTag,
      shuffleDiscard
    );
    return deck;
  }

  _clearAgendaDeckDescription(): void {
    const deck: Card | undefined = this._getAgendaDeck();
    if (deck) {
      deck.setDescription("");
    }
  }

  _addAgendaDeckDescription(value: string): void {
    const deck: Card | undefined = this._getAgendaDeck();
    if (deck) {
      const oldDesc: string = deck.getDescription();
      deck.setDescription(oldDesc + "\n" + value);
    }
  }

  init(): void {
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      this._onSingletonCardCreated
    );
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(
      this._onSingletonCardMadeDeck
    );
    TI4.events.onStrategyCardPlayed.add(this._onStrategyCardPlayed);
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
