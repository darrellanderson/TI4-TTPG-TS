import { Card, world } from "@tabletop-playground/api";
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
  static createFromRegistry(useSources: Array<string>): RemoveByNsidOrSource {
    const removeByNsidOrSource: RemoveByNsidOrSource =
      new RemoveByNsidOrSource();

    const removeSources: Array<string> = TI4.removeRegistry
      .getAllSources()
      .filter((source: string): boolean => {
        return !useSources.includes(source);
      });
    for (const source of removeSources) {
      removeByNsidOrSource.addSource(source);
    }

    for (const source of useSources) {
      const nsids: Array<string> = TI4.removeRegistry.getRemoveBySource(source);
      for (const nsid of nsids) {
        removeByNsidOrSource.addNsid(nsid);
      }
    }
    return removeByNsidOrSource;
  }

  private readonly _removeSources: Set<string> = new Set();
  private readonly _removeNsids: Set<string> = new Set();

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

  remove(): void {
    const cardUtil: CardUtil = new CardUtil();

    const shouldRemove = (nsid: string): boolean => {
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      let remove: boolean = this._removeNsids.has(nsid);
      if (parsed && !remove) {
        const source = parsed.sourceParts.join(".");
        remove = this._removeSources.has(source);
      }
      return remove;
    };

    for (const obj of world.getAllObjects()) {
      // Cards.
      if (obj instanceof Card) {
        // Cards.
        const dele: Card | undefined = cardUtil.filterCards(obj, shouldRemove);
        if (dele) {
          DeletedItemsContainer.destroyWithoutCopying(dele);
        }
      } else {
        // Basic objects.
        const nsid: string = NSID.get(obj);
        if (shouldRemove(nsid)) {
          DeletedItemsContainer.destroyWithoutCopying(obj);
        }
      }
    }
  }
}
