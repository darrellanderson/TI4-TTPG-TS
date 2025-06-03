import { Card, GameObject } from "@tabletop-playground/api";
import { DeletedItemsContainer, NSID, Spawn } from "ttpg-darrell";

/**
 * Verify all non-deck spawn NSIDs match the resulting object NSIDs.
 * Careful with this, objects may have scripts.
 */
export class ValidateTemplateNsids {
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
    let obj: GameObject | undefined;
    try {
      obj = Spawn.spawn(nsid);
    } catch (e) {
      return `${nsid} : ${e.toString()}`;
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
