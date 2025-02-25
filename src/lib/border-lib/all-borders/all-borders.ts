import { DrawingLine, PlayerPermission, world } from "@tabletop-playground/api";
import { HexType, IGlobal, PlayerSlot, TurnOrder } from "ttpg-darrell";
import {
  ControlSystemType,
  SpacePlanetOwnership,
} from "../space-planet-ownership/space-planet-ownership";
import { SpaceBorders } from "../space-borders/space-borders";
import { PlanetBorders } from "../planet-borders/planet-borders";

const LINE_TAG: string = "__border__";
const LINE_THICKNESS: number = 0.2;
const STATE_KEY: string = "allBorders";

/**
 * Manage the actual control border DrawingLines.
 * DrawingLines persist across save/load/rewind so
 * we only need to update them in place.
 */
export class AllBorders implements IGlobal {
  private _visibleTo: Array<PlayerSlot> = [];

  private readonly _onTurnChangedHandler: () => void = () => {
    this._updateLines();
  };

  static getAllDrawingLines(): Array<DrawingLine> {
    return world.getDrawingLines().filter((line: DrawingLine) => {
      return line.tag === LINE_TAG;
    });
  }

  static removeAllDrawingLines(): void {
    for (const line of AllBorders.getAllDrawingLines()) {
      world.removeDrawingLineObject(line);
    }
  }

  constructor() {
    this._restore();
  }

  init(): void {
    TurnOrder.onTurnStateChanged.add(this._onTurnChangedHandler);
  }

  destroy(): void {
    TurnOrder.onTurnStateChanged.remove(this._onTurnChangedHandler);
    // leave world saved data alone so we can restore on init
  }

  _save(): void {
    const json: string = JSON.stringify(this._visibleTo);
    world.setSavedData(json, STATE_KEY);
  }

  _restore(): void {
    const json: string | undefined = world.getSavedData(STATE_KEY);
    if (json && json.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this._visibleTo = JSON.parse(json);
    }
  }

  _updateLines(): void {
    AllBorders.removeAllDrawingLines();
    if (this._visibleTo.length > 0) {
      const visibleTo = new PlayerPermission().setPlayerSlots(this._visibleTo);

      const hexToControlSystemEntry: Map<HexType, ControlSystemType> =
        new SpacePlanetOwnership().getHexToControlSystemEntry();

      const spaceLines: Array<DrawingLine> = new SpaceBorders(
        hexToControlSystemEntry,
        LINE_THICKNESS
      ).getDrawingLines();

      const planetLines: Array<DrawingLine> = new PlanetBorders(
        hexToControlSystemEntry,
        LINE_THICKNESS
      ).getDrawingLines();

      const lines: Array<DrawingLine> = [...spaceLines, ...planetLines];
      for (const line of lines) {
        line.players = visibleTo;
        line.tag = LINE_TAG;
        world.addDrawingLine(line);
      }
    }
  }

  isVisibleTo(playerSlot: PlayerSlot): boolean {
    return this._visibleTo.includes(playerSlot);
  }

  toggleVisibility(playerSlot: PlayerSlot): void {
    const index: number = this._visibleTo.indexOf(playerSlot);
    if (index >= 0) {
      this._visibleTo.splice(index, 1);
    } else {
      this._visibleTo.push(playerSlot);
    }
    this._save();

    // We could update the lines in place (still need to remove, edit, and
    // re-add for the player permission change) but it's easier to just
    // remove and recreate all lines.
    this._updateLines();
  }
}
