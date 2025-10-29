import { Card, SnapPoint } from "@tabletop-playground/api";
import { DeletedItemsContainer, Find } from "ttpg-darrell";

export class TFSetupDecks {
  _find: Find = new Find();

  _removeActionDeck(): void {
    const deck: Card | undefined = this._find.findDeckOrDiscard("deck-action");
    if (deck) {
      DeletedItemsContainer.destroyWithoutCopying(deck);
    }
  }

  _removeAgendaDeck(): void {
    const deck: Card | undefined = this._find.findDeckOrDiscard("deck-agenda");
    if (deck) {
      DeletedItemsContainer.destroyWithoutCopying(deck);
    }
  }

  _addDeck(cardNsidPrefix: string, snapPointTag: string): void {
    const deck: Card =
      TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow(cardNsidPrefix);

    const snapPoint: SnapPoint | undefined =
      this._find.findSnapPointByTag(snapPointTag);
    if (!snapPoint) {
      throw new Error(`Snap point not found "${snapPointTag}"`);
    }

    deck.setPosition(snapPoint.getGlobalPosition().add([0, 0, 10]));
    deck.snapToGround();
  }

  setup(): void {
    this._removeActionDeck();
    this._removeAgendaDeck();

    this._addDeck("card.tf-action:", "deck-action");
    this._addDeck("card.tf-edict:", "deck-agenda");

    this._addDeck("card.tf-genome:", "deck-tf-genome");
    this._addDeck("card.tf-unit-upgrade:", "deck-tf-unit-upgrade");
    this._addDeck("card.tf-ability:", "deck-tf-ability");
    this._addDeck("card.tf-paradigm:", "deck-tf-paradigm");
  }
}
