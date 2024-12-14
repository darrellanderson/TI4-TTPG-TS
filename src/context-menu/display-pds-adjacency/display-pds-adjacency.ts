import {
  Color,
  DrawingLine,
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { SystemAdjacency } from "lib/system-lib/system-adjacency/system-adjacency";
import { AdjacencyResult, HexType, IGlobal, NSID } from "ttpg-darrell";

const ADJACENCY_LINE_TAG: string = "__adj__";
const ADJACENCY_ACTION_NAME: string = "*Toggle display adjacency";
const ADJACENCY_ACTION_TOOLTIP: string =
  "Display adjacent systems: neighbors, wormholes, hyperlanes, etc";

/**
 * Display which systems are adjacent to the given PDS, assuming range 1.
 * This is mostly for debugging and verifying hyperlanes.
 */
export class DisplayPDSAdjacency implements IGlobal {
  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    this._maybeAddContextMenu(obj);
  };

  init(): void {
    globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
    for (const obj of world.getAllObjects()) {
      this._maybeAddContextMenu(obj);
    }
  }

  destroy(): void {
    globalEvents.onObjectCreated.remove(this._onObjectCreatedHandler);
  }

  /**
   * Add context menu to the correct objects.
   *
   * @param obj
   */
  _maybeAddContextMenu(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("unit:base/pds")) {
      obj.addCustomAction(ADJACENCY_ACTION_NAME, ADJACENCY_ACTION_TOOLTIP);
      obj.onCustomAction.add(
        (obj: GameObject, player: Player, identifier: string): void => {
          if (identifier === ADJACENCY_ACTION_NAME) {
            this._toggleAdjacencyLines(obj);
          }
        }
      );
    }
  }

  _hasAdjacencyLines(obj: GameObject): boolean {
    for (const line of obj.getDrawingLines()) {
      if (line.tag === ADJACENCY_LINE_TAG) {
        return true;
      }
    }
    return false;
  }

  _toggleAdjacencyLines(obj: GameObject): void {
    if (this._hasAdjacencyLines(obj)) {
      this._removeAdajecncyLines(obj);
    } else {
      this._addAdjacencyLines(obj);
    }
  }

  _addAdjacencyLines(obj: GameObject): void {
    const pos: Vector = obj.getPosition();
    const hex: HexType = TI4.hex.fromPosition(pos);

    const adjacencyResults: Array<AdjacencyResult> = new SystemAdjacency()
      .getAdjencyResults(hex)
      .filter((adjacencyResult: AdjacencyResult): boolean => {
        return adjacencyResult.distance === 1;
      });
    adjacencyResults.forEach((result: AdjacencyResult): void => {
      const line: DrawingLine = new DrawingLine();
      line.color = new Color(1, 0, 0, 1);
      line.normals = [new Vector(0, 0, 1)];
      line.tag = ADJACENCY_LINE_TAG;
      line.thickness = 1;

      // Path includes start and end as well as middle (if any).
      line.points = result.path.map((node: string): Vector => {
        // Extract the hex portion of the path entry.
        // (Intermediate nodes are "<hex>-nw", "<hex>-ne", etc.)
        const nodeHex: HexType = node.replace(/-[a-z]*$/, "") as HexType;

        const nodePos: Vector = TI4.hex.toPosition(nodeHex);
        const localPos: Vector = obj.worldPositionToLocal(nodePos);
        localPos.z = 0;
        return localPos;
      });
      obj.addDrawingLine(line);
    });
  }

  _removeAdajecncyLines(obj: GameObject): void {
    for (const line of obj.getDrawingLines()) {
      if (line.tag === ADJACENCY_LINE_TAG) {
        obj.removeDrawingLineObject(line);
      }
    }
  }
}

new DisplayPDSAdjacency().init();
