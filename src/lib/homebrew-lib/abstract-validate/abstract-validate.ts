import { Card } from "@tabletop-playground/api";
import { DeletedItemsContainer, NSID, Spawn } from "ttpg-darrell";

export abstract class AbstractValidate {
  abstract getCommandName(): string;

  abstract getDescription(): string;

  /**
   * Get the errors from the validation.
   * @param errors The array to populate with errors.
   */
  abstract getErrors(errors: Array<string>): void;

  /**
   * Get the set of card NSIDs where the registered decks match the nsid prefix.
   *
   * @param cardNsidPrefix
   * @returns
   */
  getCardNsids(cardNsidPrefix: string): Set<string> {
    const deckNsids: Array<string> = Spawn.getAllNsids().filter(
      (nsid: string): boolean => {
        return nsid.startsWith(cardNsidPrefix);
      }
    );
    const deck: Card | undefined = Spawn.spawnMergeDecks(deckNsids);
    if (deck === undefined) {
      return new Set<string>();
    }
    const cardNsids: Array<string> = NSID.getDeck(deck);
    DeletedItemsContainer.destroyWithoutCopying(deck);
    return new Set<string>(cardNsids);
  }

  /**
   * Return items in src that are not in dst.
   *
   * @param src
   * @param dst
   * @returns
   */
  getSrcMissingFromDst(src: Set<string>, dst: Set<string>): Array<string> {
    const missing: Set<string> = new Set<string>();
    for (const nsid of src) {
      if (!dst.has(nsid)) {
        missing.add(nsid);
      }
    }
    return Array.from(missing);
  }
}
