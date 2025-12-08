import { Player, Vector, world } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";

import { DraftState } from "../draft-state/draft-state";
import { Faction } from "../../faction-lib/faction/faction";
import { MapHomeSystemLocations } from "../../map-string-lib/map-home-system-locations/map-home-system-locations";
import { MapStringHex } from "../../map-string-lib/map-string/map-string-hex";
import { MapStringHyperlanes } from "../../map-string-lib/map-string/map-string-hyperlanes";
import { MapUI } from "../../../ui/map-ui/map-ui";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";
import { SeatUI } from "../../../ui/draft/seat-ui/seat-ui";
import { SliceShape, SliceTiles } from "../generate-slices/generate-slices";
import {
  MapStringEntry,
  MapStringParser,
} from "../../map-string-lib/map-string/map-string-parser";
import { MapStringFormat } from "../../map-string-lib/map-string/map-string-format";

export type MapStringAndHexToPlayerName = {
  mapString: string;
  hexToPlayerName: Map<HexType, string>;
};

export class DraftToMapString {
  private readonly _defaultSliceShape: SliceShape;
  private readonly _seatIndexToSliceShape: Map<number, SliceShape> = new Map();
  private readonly _seatIndexToAnchorHex: Map<number, HexType> = new Map();

  static fromDraftState(draftState: DraftState): MapStringAndHexToPlayerName {
    if (draftState.getSpeakerIndex() < 0) {
      throw new Error("Draft state must have a speaker index.");
    }

    const seatIndexToSliceTiles: Map<number, SliceTiles> = new Map();
    const seatIndexToFaction: Map<number, Faction> = new Map();
    const seatIndexToPlayerName: Map<number, string> = new Map();
    const seatIndexToOpaque: Map<number, string> = new Map();

    for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
      const playerSlot: number = draftState.getSeatIndexToPlayerSlot(seatIndex);
      // Seat must be taken to link attributes.
      if (playerSlot >= 0) {
        // Slice tiles.
        draftState.getSlices().forEach((sliceTiles: SliceTiles, sliceIndex) => {
          if (draftState.getSliceIndexToPlayerSlot(sliceIndex) === playerSlot) {
            seatIndexToSliceTiles.set(seatIndex, sliceTiles);
          }
        });

        // Faction.
        draftState.getFactions().forEach((faction: Faction, factionIndex) => {
          if (
            draftState.getFactionIndexToPlayerSlot(factionIndex) === playerSlot
          ) {
            seatIndexToFaction.set(seatIndex, faction);
          }
        });

        // Player name.
        const player: Player | undefined = world.getPlayerBySlot(playerSlot);
        if (player) {
          seatIndexToPlayerName.set(seatIndex, player.getName());
        }

        // Opaque.
        draftState.getOpaques().forEach((opaque: string, opaqueIndex) => {
          if (
            draftState.getOpaqueIndexToPlayerSlot(opaqueIndex) === playerSlot
          ) {
            seatIndexToOpaque.set(seatIndex, opaque);
          }
        });
      } else {
        // Unclaimed seat, use speaker order as label.
        const speakerIndex: number = draftState.getSpeakerIndex();
        const label: string = SeatUI._getLabelOrThrow(seatIndex, speakerIndex);
        seatIndexToPlayerName.set(seatIndex, label);
      }
    }

    const draftToMapString = new DraftToMapString(draftState.getSliceShape(-1));
    const playerCount: number = TI4.config.playerCount;
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      draftToMapString.overrideSliceShape(
        seatIndex,
        draftState.getSliceShape(seatIndex)
      );
    }

    const mapStringAndHexToPlayerName: MapStringAndHexToPlayerName =
      draftToMapString.buildMapString(
        seatIndexToSliceTiles,
        seatIndexToFaction,
        seatIndexToPlayerName,
        seatIndexToOpaque,
        draftState.getOpaqueType()
      );

    // Add base map overrides (systems not laid out by slices).
    const baseMap: string = draftState.getBaseMap();
    const oldMap: string = mapStringAndHexToPlayerName.mapString;
    const newMap: string = draftToMapString._addBaseMap(oldMap, baseMap);
    mapStringAndHexToPlayerName.mapString = newMap;

    return mapStringAndHexToPlayerName;
  }

  constructor(sliceShape: SliceShape) {
    this._defaultSliceShape = sliceShape;

    const homeSystemLocs = new MapHomeSystemLocations();
    const seats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    seats.forEach((seat: PlayerSeatType, index) => {
      const playerSlot: number = seat.playerSlot;
      const homePosWorld: Vector | undefined = homeSystemLocs.get(playerSlot);
      if (homePosWorld) {
        const homePosHex: HexType = TI4.hex.fromPosition(homePosWorld);
        this._seatIndexToAnchorHex.set(index, homePosHex);
      }
    });
  }

  overrideSliceShape(seatIndex: number, sliceShape: SliceShape): this {
    this._seatIndexToSliceShape.set(seatIndex, sliceShape);
    return this;
  }

  _getSliceShape(seatIndex: number): SliceShape {
    const sliceShape: SliceShape | undefined =
      this._seatIndexToSliceShape.get(seatIndex);
    if (sliceShape) {
      return sliceShape;
    }
    return this._defaultSliceShape;
  }

  buildMapString(
    seatIndexToSliceTiles: Map<number, SliceTiles>,
    seatIndexToFaction: Map<number, Faction>,
    seatIndexToPlayerName: Map<number, string>,
    seatIndexToOpaque: Map<number, string>,
    opaqueType: string | null
  ): MapStringAndHexToPlayerName {
    const mecatol: number = TI4.systemRegistry.getMecatolRexSystemTileNumber();
    const mapStringEntries: Array<string> = [`{${mecatol}}`];
    const hexToPlayerName: Map<HexType, string> = new Map();

    // When a slice does not have assigned tiles, use blank/colored tiles.
    const seatIndexToMissingTileNumber: Map<number, number> = new Map();
    TI4.playerSeats
      .getAllSeats()
      .forEach((seatEntry: PlayerSeatType, seatIndex) => {
        const playerSlot: number = seatEntry.playerSlot;
        const tile: number = MapUI.playerSlotToColorTileNumber(playerSlot);
        seatIndexToMissingTileNumber.set(seatIndex, tile);
      });

    const mapStringHex: MapStringHex = new MapStringHex();
    for (const seatIndex of seatIndexToMissingTileNumber.keys()) {
      const sliceShape: SliceShape = this._getSliceShape(seatIndex);
      const sliceTiles: SliceTiles | undefined =
        seatIndexToSliceTiles.get(seatIndex);
      const faction: Faction | undefined = seatIndexToFaction.get(seatIndex);
      const missingTileNumber: number | undefined =
        seatIndexToMissingTileNumber.get(seatIndex);
      const anchorHex: HexType | undefined =
        this._seatIndexToAnchorHex.get(seatIndex);

      if (anchorHex) {
        const anchorPos: Vector = TI4.hex.toPosition(anchorHex);
        const dirHex: HexType = "<0,0,0>";
        const dirPos: Vector = TI4.hex.toPosition(dirHex);
        const dir: Vector = dirPos.subtract(anchorPos);

        const theta: number = Math.atan2(dir.y, dir.x);
        const cos: number = Math.cos(theta);
        const sin: number = Math.sin(theta);

        const playerName: string | undefined =
          seatIndexToPlayerName.get(seatIndex);
        if (playerName) {
          hexToPlayerName.set(anchorHex, playerName);
        }

        // First entry in slice shape is the home system.
        sliceShape.forEach((shapeHex: HexType, tileIndex: number) => {
          // Update position based on hex and direction to center.
          const shapeOffset = TI4.hex.toPosition(shapeHex);

          // Rotate offset in direction.
          let dx = cos * shapeOffset.x - sin * shapeOffset.y;
          let dy = sin * shapeOffset.x + cos * shapeOffset.y;

          dx += anchorPos.x;
          dy += anchorPos.y;

          const pos: Vector = new Vector(dx, dy, 0);
          const hex: HexType = TI4.hex.fromPosition(pos);
          const mapStringIndex: number = mapStringHex.hexToIndex(hex);

          let tile: number = -1;
          if (tileIndex === 0 && faction) {
            tile = faction.getHomeSystemTileNumber();
          } else if (sliceTiles) {
            const sliceTile = sliceTiles[tileIndex - 1];
            if (sliceTile) {
              tile = sliceTile;
            }
          }
          if (tile === -1 && missingTileNumber) {
            tile = missingTileNumber;
          }
          mapStringEntries[mapStringIndex] = tile.toString();
        });

        const opaque: string | undefined = seatIndexToOpaque.get(seatIndex);
        if (opaqueType === "minorFactions") {
          const shapeOffset = TI4.hex.toPosition("<2,-1,-1>"); // left-eq

          // Rotate offset in direction.
          let dx = cos * shapeOffset.x - sin * shapeOffset.y;
          let dy = sin * shapeOffset.x + cos * shapeOffset.y;

          dx += anchorPos.x;
          dy += anchorPos.y;

          const pos: Vector = new Vector(dx, dy, 0);
          const hex: HexType = TI4.hex.fromPosition(pos);
          const mapStringIndex: number = mapStringHex.hexToIndex(hex);
          if (opaque) {
            mapStringEntries[mapStringIndex] = opaque;
          } else {
            mapStringEntries[mapStringIndex] = "0";
          }
        }
      }
    }

    this._fillMissingMapStringEntries(mapStringEntries);
    let mapString: string = mapStringEntries.join(" ");

    // Apply hyperlanes, if any.
    const playerCount: number = TI4.config.playerCount;
    const hyperlaneMapString = MapStringHyperlanes.get(playerCount);

    mapString = new MapStringHyperlanes().addHyperlanes(
      mapString,
      hyperlaneMapString
    );

    return { mapString, hexToPlayerName };
  }

  _fillMissingMapStringEntries(mapStringEntries: Array<string>): void {
    for (let i = 0; i < mapStringEntries.length; i++) {
      if (mapStringEntries[i] === undefined) {
        mapStringEntries[i] = "-1";
      }
    }
  }

  _addBaseMap(oldMap: string, baseMap: string): string {
    const parser: MapStringParser = new MapStringParser();
    const entries: Array<MapStringEntry> = parser.parseOrThrow(oldMap);
    const baseEntries: Array<MapStringEntry> = parser.parseOrThrow(baseMap);
    baseEntries.forEach((baseEntry: MapStringEntry, index: number) => {
      if (index === 0 && (baseEntry.tile === 18 || baseEntry.tile === 112)) {
        return; // skip mecatol entry
      }
      if (baseEntry.tile > 0) {
        const entry: MapStringEntry | undefined = entries[index];
        if (entry && entry.tile !== baseEntry.tile && entry.tile > 0) {
          // Tile already exists, do not override.
          throw new Error(
            `base map overrides existing tile: ${entry.tile} with ${baseEntry.tile}`
          );
        }
        entries[index] = baseEntry;
      }
    });
    return new MapStringFormat().format(entries);
  }
}
