import { Card, GameObject, world } from "@tabletop-playground/api";
import {
  CardUtil,
  DeletedItemsContainer,
  NSID,
  ParsedNSID,
} from "ttpg-darrell";

/**
 * Remove content based on source or NSID.
 */
export class RemoveByNsidOrSource {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _removeSources: Set<string> = new Set();
  private readonly _removeNsids: Set<string> = new Set();

  private readonly _shouldRemove = (nsid: string): boolean => {
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    let remove: boolean = this._removeNsids.has(nsid);
    if (parsed && !remove) {
      const source = parsed.sourceParts.join(".");
      remove = this._removeSources.has(source);
    }
    return remove;
  };

  /**
   * Add a source to remove.
   * @param source Source to remove.
   */
  addSource(source: string): this {
    this._removeSources.add(source);
    return this;
  }

  /**
   * Add an NSID to remove.
   * @param nsid NSID to remove.
   */
  addNsid(nsid: string): this {
    this._removeNsids.add(nsid);
    return this;
  }

  hasSource(source: string): boolean {
    return this._removeSources.has(source);
  }

  hasNsid(nsid: string): boolean {
    return this._removeNsids.has(nsid);
  }

  removeOne(obj: GameObject) {
    // Cards.
    if (obj instanceof Card) {
      // Cards.
      const dele: Card | undefined = this._cardUtil.filterCards(
        obj,
        this._shouldRemove
      );
      if (dele) {
        DeletedItemsContainer.destroyWithoutCopying(dele);
      }
    } else {
      // Basic objects.
      const nsid: string = NSID.get(obj);
      if (this._shouldRemove(nsid)) {
        DeletedItemsContainer.destroyWithoutCopying(obj);
      }
    }
  }

  removeAll(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this.removeOne(obj);
    }
  }
}
