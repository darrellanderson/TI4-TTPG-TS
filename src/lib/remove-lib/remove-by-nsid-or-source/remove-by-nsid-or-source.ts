import {
  Card,
  Container,
  GameObject,
  Vector,
  world,
} from "@tabletop-playground/api";
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
  private readonly _removeNsidPrefixes: Set<string> = new Set();

  private readonly _shouldRemove = (nsid: string): boolean => {
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    let remove: boolean = this._removeNsids.has(nsid);
    if (parsed && !remove) {
      const source = parsed.sourceParts.join(".");
      remove = this._removeSources.has(source);
    }
    if (!remove) {
      for (const prefix of this._removeNsidPrefixes) {
        if (nsid.startsWith(prefix)) {
          remove = true;
          break;
        }
      }
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

  addNsidPrefix(nsidPrefix: string): this {
    this._removeNsidPrefixes.add(nsidPrefix);
    return this;
  }

  hasSource(source: string): boolean {
    return this._removeSources.has(source);
  }

  hasNsid(nsid: string): boolean {
    return this._removeNsids.has(nsid);
  }

  hasNsidPrefix(nsidPrefix: string): boolean {
    return this._removeNsidPrefixes.has(nsidPrefix);
  }

  getRemoveSources(): Array<string> {
    return Array.from(this._removeSources);
  }

  removeOne(obj: GameObject): this {
    // Cards.
    if (obj instanceof Card) {
      // Cards.
      const dele: Card | undefined = this._cardUtil.filterCards(
        obj,
        this._shouldRemove,
      );
      if (dele) {
        DeletedItemsContainer.destroyWithoutCopying(dele);
      }
    } else {
      // Basic objects.
      const nsid: string = NSID.get(obj);
      if (this._shouldRemove(nsid)) {
        const container: Container | undefined = obj.getContainer();
        if (container) {
          const above: Vector = container.getPosition().add([0, 0, 10]);
          container.take(obj, above);
        }
        DeletedItemsContainer.destroyWithoutCopying(obj);
      }
    }
    return this;
  }

  removeAll(): this {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this.removeOne(obj);
    }
    return this;
  }

  shouldRemove(nsid: string): boolean {
    return this._shouldRemove(nsid);
  }
}
