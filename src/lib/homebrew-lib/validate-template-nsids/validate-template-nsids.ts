import { Card, GameObject } from "@tabletop-playground/api";
import { DeletedItemsContainer, NSID, Spawn } from "ttpg-darrell";
import { AbstractValidate } from "../abstract-validate/abstract-validate";

/**
 * Verify all non-deck spawn NSIDs match the resulting object NSIDs.
 * Careful with this, objects may have scripts.
 */
export class ValidateTemplateNsids extends AbstractValidate {
  getCommandName(): string {
    return "template-nsids";
  }

  getDescription(): string {
    return "Validate spawn registry NSIDs match the NSIDs for the spawned objects (except cards/decks).";
  }

  getErrors(errors: Array<string>): void {
    const nsids: Array<string> = Spawn.getAllNsids();
    for (const nsid of nsids) {
      const error: string | undefined = this._checkNsid(nsid);
      if (error) {
        errors.push(error);
      }
    }
  }

  /**
   * If the NSID isn't a card, verity the resulting object has that
   * NSID.  Return an error message, or undefined if it matches.
   *
   * @param nsid
   */
  _checkNsid(nsid: string): string | undefined {
    const obj: GameObject | undefined = Spawn.spawn(nsid);
    if (!obj && nsid !== "default" && !nsid.startsWith("table:")) {
      return `NSID "${nsid}" does not spawn an object`;
    }
    if (obj && !(obj instanceof Card)) {
      const detectedNsid: string = NSID.get(obj);
      if (detectedNsid !== nsid) {
        return `Registered NSID "${nsid}" creates object with NSID "${detectedNsid}"`;
      }
    }
    if (obj) {
      DeletedItemsContainer.destroyWithoutCopying(obj);
    }
  }
}
