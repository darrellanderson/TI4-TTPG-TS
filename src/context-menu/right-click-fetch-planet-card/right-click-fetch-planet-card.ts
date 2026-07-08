import {
  Card,
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import { IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";

export const ACTION_FETCH_PLANET_CARD: string = "*Fetch planet card";

export class RightClickFetchPlanetCard implements IGlobal {
  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    this._maybeAddFetch(obj);
  };

  private readonly _onCardMadeSingletonHandler = (card: Card): void => {
    this._maybeAddFetch(card);
  };

  private readonly _onCardMakeDeckHandler = (card: Card): void => {
    card.removeCustomAction(ACTION_FETCH_PLANET_CARD);
    card.onCustomAction.remove(this._onCustomActionHandler);
  };

  private readonly _onCustomActionHandler = (
    object: GameObject,
    player: Player,
    identifier: string,
  ): void => {
    if (identifier === ACTION_FETCH_PLANET_CARD && object instanceof Card) {
      this._fetch(object, player.getSlot());
    }
  };

  init(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddFetch(obj);
    }
    globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      this._onCardMadeSingletonHandler,
    );
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(
      this._onCardMakeDeckHandler,
    );
  }

  _maybeAddFetch(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (
      obj instanceof Card &&
      (nsid.startsWith("card.planet:") ||
        nsid.startsWith("card.legendary-planet:"))
    ) {
      obj.removeCustomAction(ACTION_FETCH_PLANET_CARD);
      obj.addCustomAction(ACTION_FETCH_PLANET_CARD);
      obj.onCustomAction.remove(this._onCustomActionHandler);
      obj.onCustomAction.add(this._onCustomActionHandler);
    }
  }

  _fetch(card: Card, playerSlot: number): void {
    TI4.events.onFetchPlanetCardRequest.trigger(card, playerSlot);
  }
}
