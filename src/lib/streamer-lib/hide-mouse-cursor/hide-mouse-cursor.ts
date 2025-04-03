import {
  Player,
  Vector,
  world,
  Zone,
  ZonePermission,
} from "@tabletop-playground/api";
import { IGlobal, NamespaceId, NSID, PlayerSlot } from "ttpg-darrell";
import { globalEvents } from "ttpg-mock";

export class HideMouseCursor implements IGlobal {
  private readonly _namespaceId: NamespaceId;
  private readonly _hideCursorPlayerNames: Set<string> = new Set();
  private _zone: Zone | undefined;

  readonly _updateZoneHandler: () => void = () => {
    this._updateZone();
  };

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;
    this._load();
  }

  init(): void {
    this._zone = HideMouseCursor._findOrCreateZone();
    this._updateZone();

    globalEvents.onPlayerJoined.add(this._updateZoneHandler);
    globalEvents.onPlayerLeft.add(this._updateZoneHandler);
    globalEvents.onPlayerSwitchedSlots.add(this._updateZoneHandler);
  }

  addHideCursor(player: Player): void {
    this._hideCursorPlayerNames.add(player.getName());
    this._save();
    this._updateZone();
  }

  hasHideCursor(player: Player): boolean {
    return this._hideCursorPlayerNames.has(player.getName());
  }

  removeHideCursor(player: Player): void {
    this._hideCursorPlayerNames.delete(player.getName());
    this._save();
    this._updateZone();
  }

  private _updateZone(): void {
    if (this._zone) {
      for (let i: PlayerSlot = 0; i < 20; i++) {
        this._zone.setSlotOwns(i, false);
      }
      for (const playerName of this._hideCursorPlayerNames) {
        const player: Player | undefined = world.getPlayerByName(playerName);
        if (player) {
          this._zone.setSlotOwns(player.getSlot(), true);
        }
      }
    }
  }

  private _save(): void {
    const json: string = JSON.stringify(
      Array.from(this._hideCursorPlayerNames)
    );
    world.setSavedData(json, this._namespaceId);
  }

  private _load(): void {
    const json: string | undefined = world.getSavedData(this._namespaceId);
    if (json && json.length > 0) {
      const names: Array<string> = JSON.parse(json);
      this._hideCursorPlayerNames.clear();
      for (const name of names) {
        this._hideCursorPlayerNames.add(name);
      }
    }
  }

  static _getTablePositionAndExtent(): {
    tablePosition: Vector;
    tableExtent: Vector;
  } {
    const result = {
      tablePosition: new Vector(0, 0, 0),
      tableExtent: new Vector(0, 0, 0),
    };

    // Find the table (by NSID).
    const currentRotation: boolean = true;
    const includeGeometry: boolean = true;
    for (const table of world.getAllTables()) {
      const nsid: string = NSID.get(table);
      if (nsid === "table:base/table") {
        result.tablePosition = table.getPosition();
        result.tableExtent = table.getExtent(currentRotation, includeGeometry);
      }
    }

    return result;
  }

  static _findOrCreateZone(): Zone {
    const zoneId: string = "__hide_mouse_cursor__";
    const zoneHeight: number = 10;

    // Find the table (by NSID).
    const { tableExtent } = HideMouseCursor._getTablePositionAndExtent();

    // Find zone.
    let zone: Zone | undefined;
    for (const candidate of world.getAllZones()) {
      if (candidate.isValid() && candidate.getId() === zoneId) {
        zone = candidate;
        break;
      }
    }

    // Create zone if it doesn't exist.
    const pos: Vector = new Vector(
      0,
      0,
      world.getTableHeight() + zoneHeight / 2 - 1
    );
    if (!zone) {
      zone = world.createZone(pos);
      zone.setId(zoneId);
      zone.setCursorHidden(ZonePermission.OwnersOnly);
    }

    // Always update pos/size.
    zone.setPosition(pos);
    zone.setScale([
      tableExtent.x * 2 - 0.1,
      tableExtent.y * 2 - 0.1,
      zoneHeight,
    ]);

    // Visualize for initial testing?
    zone.setColor([0, 1, 0, 0.5]);
    zone.setAlwaysVisible(true);

    return zone;
  }
}
