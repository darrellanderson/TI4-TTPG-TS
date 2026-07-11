import { GameObject, Vector } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";

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

/**
 * Spawn Twilight's Fall Military Draft Extension mats for each player.
 * Place each in the player area near the top of the faction sheet.
 */
export class TFSetupMatsDraftExt {
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

    mat.setDescription(TF_DRAFT_EXT_DESC);
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
    const dir: number = statusPadPos.x > 0 ? 1 : -1;
    const offset: number = 10;
    return new Vector(
      statusPadPos.x + dir * offset,
      statusPadPos.y,
      statusPadPos.z + 10,
    );
  }
}
