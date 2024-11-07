import { Vector } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";

import { Faction } from "../../faction-lib/faction/faction";
import { MapHomeSystemLocations } from "../../map-string-lib/map-home-system-locations";
import { MapStringHex } from "../../map-string-lib/map-string-hex";
import { MapUI } from "../../../ui/map-ui/map-ui";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";
import { SliceShape, SliceTiles } from "../generate-slices/generate-slices";

export class DraftToMapString {
  private readonly _defaultSliceShape: SliceShape;
  private readonly _seatIndexToSliceShape: Map<number, SliceShape> = new Map();
  private readonly _seatIndexToAnchorHex: Map<number, HexType> = new Map();

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
    seatIndexToPlayerName: Map<number, string>
  ): { mapString: string; hexToPlayerName: Map<HexType, string> } {
    const mapString: Array<string> = ["{18}"];
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
          mapString[mapStringIndex] = tile.toString();
        });
      }
    }

    console.log("mapString", mapString.join(","));
    for (let i = 0; i < mapString.length; i++) {
      if (mapString[i] === undefined) {
        mapString[i] = "-1";
      }
    }

    return { mapString: mapString.join(" "), hexToPlayerName };
  }
}
