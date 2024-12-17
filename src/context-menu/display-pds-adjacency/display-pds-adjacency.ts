import {
  Color,
  DrawingLine,
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { AdjacencyPathType, HexType, IGlobal, NSID } from "ttpg-darrell";

import { SystemAdjacency } from "../../lib/system-lib/system-adjacency/system-adjacency";

export const ADJACENCY_LINE_TAG: string = "__adj__";
export const ADJACENCY_ACTION_NAME: string = "*Toggle display adjacency";
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

  private readonly _onCustomActionHandler = (
    obj: GameObject,
    _player: Player,
    identifier: string
  ): void => {
    if (identifier === ADJACENCY_ACTION_NAME) {
      this._toggleAdjacencyLines(obj);
    }
  };

  static _parseAdjencyNodeOrThrow(node: string): {
    hex: HexType;
    direction: string | undefined;
  } {
    const re: RegExp = /^(<-?\d+,-?\d+,-?\d+>)-?(n|ne|e|se|s|sw|w|nw)?$/;
    const match: RegExpMatchArray | null = node.match(re);
    if (!match) {
      throw new Error(`Invalid node: ${node}`);
    }
    const hex: HexType = match[1] as HexType;
    return { hex, direction: match[2] };
  }

  static _getLinePoints(adjacencyNodePath: Array<string>): Array<Vector> {
    // Path includes start and end as well as middle (if any).
    return adjacencyNodePath.map((node: string): Vector => {
      const parsed: { hex: HexType; direction: string | undefined } =
        DisplayPDSAdjacency._parseAdjencyNodeOrThrow(node);
      const pos: Vector = TI4.hex.toPosition(parsed.hex);

      // Hyperlanes add nodes for the hyperlane hex edges traversed.
      if (parsed.direction) {
        // Corners start with "top right", winding counterclockwise.
        const corners: Array<Vector> = TI4.hex.corners("<0,0,0>");
        let a: Vector | undefined = undefined;
        let b: Vector | undefined = undefined;
        if (parsed.direction === "n") {
          a = corners[0];
          b = corners[1];
        } else if (parsed.direction === "nw") {
          a = corners[1];
          b = corners[2];
        } else if (parsed.direction === "sw") {
          a = corners[2];
          b = corners[3];
        } else if (parsed.direction === "s") {
          a = corners[3];
          b = corners[4];
        } else if (parsed.direction === "se") {
          a = corners[4];
          b = corners[5];
        } else if (parsed.direction === "ne") {
          a = corners[5];
          b = corners[0];
        }
        if (a && b) {
          pos.x += (a.x + b.x) / 2;
          pos.y += (a.y + b.y) / 2;
        }
      }

      return pos;
    });
  }

  static _getLine(adjacencyNodePath: Array<string>): DrawingLine {
    const line: DrawingLine = new DrawingLine();
    line.color = new Color(1, 0, 0, 1);
    line.normals = [new Vector(0, 0, 1)];
    line.tag = ADJACENCY_LINE_TAG;
    line.thickness = 0.5;

    // World positions!
    line.points = DisplayPDSAdjacency._getLinePoints(adjacencyNodePath);

    return line;
  }

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
      obj.onCustomAction.add(this._onCustomActionHandler);
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

    const adjacencyResults: ReadonlyArray<AdjacencyPathType> =
      new SystemAdjacency()
        .getAdjencyResults(hex)
        .filter((adjacencyResult: AdjacencyPathType): boolean => {
          return adjacencyResult.distance === 1;
        });
    adjacencyResults.forEach((adjacencyPathType: AdjacencyPathType): void => {
      const line: DrawingLine = DisplayPDSAdjacency._getLine(
        adjacencyPathType.path
      );

      // Convert to local positions.
      line.points = line.points.map((point: Vector): Vector => {
        const pos: Vector = obj.worldPositionToLocal(point);
        pos.z = 0; // same plane as the PDS.
        return pos;
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
