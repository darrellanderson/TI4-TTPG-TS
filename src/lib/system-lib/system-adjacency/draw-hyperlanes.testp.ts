import {
  DrawingLine,
  GameObject,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Adjacency, HexType, IGlobal } from "ttpg-darrell";
import { globalEvents } from "ttpg-mock";
import { System } from "../system/system";
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
      obj.onMovementStopped.add(this._onMovementStoppedHandler);
      this._update(obj);
    }
  }

  _update(obj: GameObject): void {
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
    for (const [a, b] of adjacency.getAllLinks()) {
      const line: DrawingLine = DisplayPDSAdjacency._getLine([a, b]);

      // Convert to local positions.
      line.points = line.points.map((point: Vector): Vector => {
        const pos: Vector = obj.worldPositionToLocal(point);
        pos.z = extent.z + 0.05;
        return pos;
      });

      obj.addDrawingLine(line);
    }
  }
}
