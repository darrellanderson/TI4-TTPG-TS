import {
  DrawingLine,
  GameObject,
  globalEvents,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Adjacency,
  AdjacencyPathType,
  Facing,
  Hex,
  HexType,
  IGlobal,
} from "ttpg-darrell";

import { System } from "../system/system";
import { SystemAdjacency } from "./system-adjacency";
import { SystemAdjacencyHyperlane } from "./system-adjacency-hyperlane";
import {
  ADJACENCY_LINE_TAG,
  DisplayPDSAdjacency,
} from "context-menu/display-pds-adjacency/display-pds-adjacency";

/**
 * Draw hyperlane links, for verification and debugging.
 */
export class DrawHyperlanes implements IGlobal {
  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    this._maybeProcessObject(obj);
  };
  private readonly _onMovementStoppedHandler = (obj: GameObject): void => {
    this._update(obj);
  };

  init(): void {
    globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
    for (const obj of world.getAllObjects()) {
      this._maybeProcessObject(obj);
    }
  }

  _maybeProcessObject(obj: GameObject): void {
    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      obj.getId()
    );
    if (system && system.isHyperlane()) {
      obj.onMovementStopped.remove(this._onMovementStoppedHandler);
      obj.onMovementStopped.add(this._onMovementStoppedHandler);
      this._update(obj);
    }
  }

  _update(obj: GameObject): void {
    console.log("DrawHyperlanes._update", obj.getId());
    world.showPing(obj.getPosition(), [1, 0, 0, 1], false);
    obj.getDrawingLines().forEach((line) => {
      if (line.tag === ADJACENCY_LINE_TAG) {
        obj.removeDrawingLineObject(line);
      }
    });

    const extent: Vector = obj.getExtent(false, false);

    const pos: Vector = obj.getPosition();
    const hex: HexType = TI4.hex.fromPosition(pos);
    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      obj.getId()
    );
    const hexToSystem: Map<HexType, System> = new Map();
    if (system) {
      hexToSystem.set(hex, system);
    }

    const adjacency: Adjacency = new Adjacency();
    new SystemAdjacencyHyperlane().addTags(hexToSystem, adjacency);

    // Get the directed edge going in to the system, use as the
    // starting points for paths (may start with a transit link).
    //
    // That said, paths cannot END with a transit link.  Add a bogus
    // non-transit link to each outgoing directed edge and strip off later.
    const bogusNode: string = "<bogus>";
    const edgesIn: Array<string> = [];
    Hex.neighbors(hex).forEach((neighbor: HexType) => {
      const edgeIn: string = [neighbor, hex].join("|");
      edgesIn.push(edgeIn);

      const edgeOut: string = [hex, neighbor].join("|");
      adjacency.addLink({
        src: edgeOut,
        dst: bogusNode + "-" + neighbor, // unique to prevent revisiting the same final node
        distance: 0.5,
        isTransit: false,
      });
    });

    // Get paths from each edge separately (using a shared incoming hub leads
    // to path collisions clipping the paths for re-visiting the same edge).
    // We want this to visually verify each direction of each hyperlane.
    const paths: Array<AdjacencyPathType> = [];
    for (const edgeIn of edgesIn) {
      const edgePaths: ReadonlyArray<AdjacencyPathType> = adjacency.get(
        edgeIn,
        100
      );
      paths.push(...edgePaths);
    }

    const simplePaths: Array<Array<string>> = paths.map(
      (path: AdjacencyPathType): Array<string> => {
        const simplePath: Array<string> = SystemAdjacency.simplifyPath(path);
        const last: string | undefined = simplePath.pop();
        if (!last?.startsWith(bogusNode)) {
          throw new Error("Unexpected path");
        }
        return simplePath;
      }
    );

    console.log("paths", obj.getId(), paths.length);
    console.log("simplePaths", "\n" + simplePaths.join("\n"));

    const isFaceUp: boolean = Facing.isFaceUp(obj);
    for (const simplePath of simplePaths) {
      const line: DrawingLine = DisplayPDSAdjacency._getLine(simplePath);
      // Convert to local positions.
      line.points = line.points.map((point: Vector): Vector => {
        const pos: Vector = obj.worldPositionToLocal(point);
        const z = (isFaceUp ? 1 : -1) * (extent.z + 0.05);
        pos.z = z;
        return pos;
      });
      if (!isFaceUp) {
        line.normals = [new Vector(0, 0, -1)];
      }
      obj.addDrawingLine(line);
    }
  }
}

new DrawHyperlanes().init();
