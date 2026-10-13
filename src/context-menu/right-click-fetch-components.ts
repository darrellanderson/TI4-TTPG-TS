import { Card, GameObject, Player, Vector } from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  CardUtil,
  DeletedItemsContainer,
} from "ttpg-darrell";

const ACTION_FETCH_COMPONENTS = "*Fetch Components";

type DeckAndCardsNsidType = {
  deckNsidPrefix: string;
  cardNsids: Array<string>;
};

/**
 * Fetched related components to this card.
 * (This belongs in the main mod)
 */
export class RightClickFetchComponents extends AbstractRightClickCard {
  private readonly _fetchDeckAndCards: Array<DeckAndCardsNsidType> = [];
  private readonly _fetchGameObjects: Array<string> = [];
  private _removeClickedObjAfterFetch: boolean = false;

  constructor(cardNsid: string) {
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string,
    ): void => {
      if (identifier === ACTION_FETCH_COMPONENTS) {
        this._fetchComponents(object, player);
      }
    };

    super(cardNsid, ACTION_FETCH_COMPONENTS, customActionHandler);
  }

  addFetchCard(deckNsidPrefix: string, cardNsids: Array<string>): this {
    this._fetchDeckAndCards.push({ deckNsidPrefix, cardNsids });
    return this;
  }

  addFetchGameObject(objNsid: string): this {
    this._fetchGameObjects.push(objNsid);
    return this;
  }

  setRemoveClickedObjAfterFetch(remove: boolean): this {
    this._removeClickedObjAfterFetch = remove;
    return this;
  }

  _fetchComponents(clickedObj: GameObject, player: Player): void {
    if (clickedObj instanceof Card && clickedObj.isInHolder()) {
      Broadcast.broadcastOne(
        player,
        "Cannot fetch components while the card is in a holder.",
        Broadcast.ERROR,
      );
      return;
    }

    const clickedPos: Vector = clickedObj.getPosition();
    const spawnPos: Vector = clickedPos.add([0, 0, 10]);
    const fetched: Array<GameObject> = [];

    // Fetch cards.
    for (const deckAndCards of this._fetchDeckAndCards) {
      console.log(
        `RightClickFetchComponents: fetching deck prefix ${deckAndCards.deckNsidPrefix}, cards ${deckAndCards.cardNsids.join(", ")}`,
      );
      const card: Card = this._spawnDeckAndExtractCards(
        deckAndCards.deckNsidPrefix,
        deckAndCards.cardNsids,
        spawnPos,
      );
      console.log(`RightClickFetchComponents: |card|=${card.getStackSize()}`);
      fetched.push(card);
      spawnPos.z += 3;
    }

    // Fetch game obejcts.
    for (const objNsid of this._fetchGameObjects) {
      console.log(`RightClickFetchComponents: fetching game object ${objNsid}`);
      const obj: GameObject = this._spawnGameObject(objNsid, spawnPos);
      fetched.push(obj);
      spawnPos.z += 3;
    }

    // Maybe remove clicked object.
    if (this._removeClickedObjAfterFetch) {
      console.log(`RightClickFetchComponents: removing clicked object`);
      DeletedItemsContainer.destroyWithoutCopying(clickedObj);
    }

    // Position objects in a spread.
    this._layoutObjects(clickedPos, fetched);
  }

  _layoutObjects(clickPos: Vector, objs: Array<GameObject>): void {
    const deltaX: number = clickPos.x < 0 ? 3 : -3;
    const deltaY: number = 3;
    const p0: Vector = clickPos.subtract([
      0,
      (deltaY * (objs.length - 1)) / 2,
      0,
    ]);
    objs.forEach((obj, i) => {
      const pos: Vector = p0.add([deltaX, deltaY * i, 5]);
      obj.setPosition(pos);
      if (obj instanceof Card) {
        obj.setRotation([0, 0, 180]);
      }

      obj.snapToGround();
    });
  }

  _spawnDeckAndExtractCards(
    deckNsidPrefix: string,
    cardNsids: Array<string>,
    pos: Vector,
  ): Card {
    const deck: Card = TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow(
      deckNsidPrefix,
      pos,
    );
    const origDeckSize: number = deck.getStackSize();

    // "card" might be a deck if more than one card extracted.
    const card: Card | undefined = new CardUtil().filterCards(
      deck,
      (candidateCardNsid: string): boolean => {
        return cardNsids.includes(candidateCardNsid);
      },
    );
    if (!card) {
      throw new Error(
        `No cards with NSIDs "${cardNsids.join(", ")}" not found in deck "${deckNsidPrefix}"`,
      );
    } else if (card.getStackSize() < cardNsids.length) {
      throw new Error(
        `Not all cards with NSIDs "${cardNsids.join(", ")}" were found in deck "${deckNsidPrefix}"`,
      );
    }

    if (origDeckSize > card.getStackSize()) {
      DeletedItemsContainer.destroyWithoutCopying(deck);
    }
    return card;
  }

  _spawnGameObject(objNsid: string, pos: Vector): GameObject {
    return TI4.spawn.spawnOrThrow(objNsid, pos);
  }
}
