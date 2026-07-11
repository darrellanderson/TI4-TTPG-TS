import {
  GameObject,
  Player,
  SnapPoint,
  Vector,
} from "@tabletop-playground/api";
import {
  DeletedItemsContainer,
  Find,
  GarbageContainer,
  NSID,
  ParsedNSID,
} from "ttpg-darrell";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";
import { Faction } from "../../faction-lib/faction/faction";

const TF_DRAFT_EXT_DESC: string = [
  "Use this mat to extend Milty Draft for Twilight's Fall.",
  "",
  "Fill slots with Faction Reference cards (face down ok).",
  "Fill Priority BEFORE STARTING draft.",
  "Fill Home and Units BEFORE FINISHING draft.",
  "",
  "Draftable kings are the larger ones at table left.",
  "Do NOT use right click options to unpack or claim, draft handles it.",
  "",
  "Delete this mat if not using Milty Draft.",
].join("\n");

export type TFDraftExtTagType =
  | "tf-draft-priority"
  | "tf-draft-home"
  | "tf-draft-starting-units";

const ACTION_DESTROY_ALL_MATS: string = "*Destroy all TF draft mats";

/**
 * Spawn Twilight's Fall Military Draft Extension mats for each player.
 */
export class TFSetupMatsDraftExt {
  static allHomeSystemAndStartingUnitsChosen(): boolean {
    const playerSlots: Array<number> = TI4.playerSeats
      .getAllSeats()
      .map((seat) => seat.playerSlot);
    return playerSlots.every((playerSlot) => {
      const homeChosen: boolean =
        TFSetupMatsDraftExt.getFactionChoice(playerSlot, "tf-draft-home") !==
        undefined;
      const unitsChosen: boolean =
        TFSetupMatsDraftExt.getFactionChoice(
          playerSlot,
          "tf-draft-starting-units",
        ) !== undefined;
      return homeChosen && unitsChosen;
    });
  }

  static getFactionChoice(
    playerSlot: number,
    tag: TFDraftExtTagType,
  ): Faction | undefined {
    const matNsid: string = "mat:twilights-fall/tf-draft-ext";
    TI4.findTracking.trackNsid(matNsid);

    const mat: GameObject | undefined = TI4.findTracking
      .find(matNsid)
      .filter((obj: GameObject): boolean => {
        return obj.getOwningPlayerSlot() === playerSlot;
      })[0];
    if (!mat) {
      return undefined;
    }

    const snapPoint: SnapPoint | undefined = mat
      .getAllSnapPoints()
      .filter((candidateSnapPoint: SnapPoint): boolean => {
        return candidateSnapPoint.getTags().includes(tag);
      })[0];
    if (!snapPoint) {
      throw new Error(`Failed to find snap point with tag ${tag}`);
    }

    const snappedObj: GameObject | undefined = snapPoint.getSnappedObject();
    if (!snappedObj) {
      return undefined;
    }

    const nsid: string = NSID.get(snappedObj);
    if (!nsid.startsWith("card.faction-reference:")) {
      return undefined; // not a faction reference card
    }

    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (!parsed) {
      throw new Error(`Failed to parse NSID ${nsid}`);
    }
    const nsidName: string | undefined = parsed.nameParts[0];
    if (!nsidName) {
      throw new Error(`Failed to get name from NSID ${nsid}`);
    }

    const faction: Faction | undefined =
      TI4.factionRegistry.getByNsidName(nsidName);
    if (!faction) {
      throw new Error(`Failed to find faction for NSID name ${nsidName}`);
    }

    return faction;
  }

  static removeAllMatsAndReferenceCards(): void {
    const matNsid: string = "mat:twilights-fall/tf-draft-ext";
    TI4.findTracking.trackNsid(matNsid);

    TI4.findTracking.find(matNsid).forEach((mat: GameObject): void => {
      mat.getAllSnapPoints().forEach((snapPoint: SnapPoint): void => {
        const snappedObj: GameObject | undefined = snapPoint.getSnappedObject();
        if (snappedObj) {
          const snappedNsid: string = NSID.get(snappedObj);
          if (snappedNsid.startsWith("card.faction-reference:")) {
            const player: Player | undefined = undefined;
            GarbageContainer.tryRecycle(snappedObj, player);
          }
        }
      });

      DeletedItemsContainer.destroyWithoutCopying(mat);
    });
  }

  private readonly _onCustomActionHandler = (
    _object: GameObject,
    _player: Player,
    identifier: string,
  ): void => {
    if (identifier === ACTION_DESTROY_ALL_MATS) {
      TFSetupMatsDraftExt.removeAllMatsAndReferenceCards();
    }
  };

  public setup(): void {
    TI4.playerSeats.getAllSeats().forEach((playerSeat: PlayerSeatType) => {
      this._spawnForPlayerSlot(playerSeat.playerSlot);
    });
  }

  _spawnForPlayerSlot(playerSlot: number): void {
    const pos: Vector = this._getMapPos(playerSlot);
    const mat: GameObject | undefined = TI4.spawn.spawnOrThrow(
      "mat:twilights-fall/tf-draft-ext",
      pos,
    );
    mat.setOwningPlayerSlot(playerSlot);
    mat.setTags([DeletedItemsContainer.IGNORE_TAG]); // if player deletes do not keep
    mat.setDescription(TF_DRAFT_EXT_DESC);
    mat.removeCustomAction(ACTION_DESTROY_ALL_MATS);
    mat.addCustomAction(ACTION_DESTROY_ALL_MATS);
    mat.onCustomAction.remove(this._onCustomActionHandler);
    mat.onCustomAction.add(this._onCustomActionHandler);
  }

  _getMapPos(playerSlot: number): Vector {
    // Find the status pad for the player slot and offset into the player area.
    const skipContained: boolean = true;
    const statusPad: GameObject | undefined = new Find().findGameObject(
      "mat:base/status-pad",
      playerSlot,
      skipContained,
    );

    if (!statusPad) {
      throw new Error(
        `Failed to find status pad for player slot ${playerSlot}`,
      );
    }

    const statusPadPos: Vector = statusPad.getPosition();
    const dir: number = statusPadPos.x > 0 ? -1 : 1;
    const offset: number = 10;
    return new Vector(
      statusPadPos.x + dir * offset,
      statusPadPos.y,
      statusPadPos.z + 10,
    );
  }
}
