"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftToMapString = void 0;
const api_1 = require("@tabletop-playground/api");
const map_home_system_locations_1 = require("../../map-string-lib/map-home-system-locations/map-home-system-locations");
const map_string_hex_1 = require("../../map-string-lib/map-string/map-string-hex");
const map_string_hyperlanes_1 = require("../../map-string-lib/map-string/map-string-hyperlanes");
const map_ui_1 = require("../../../ui/map-ui/map-ui");
const seat_ui_1 = require("../../../ui/draft/seat-ui/seat-ui");
const map_string_parser_1 = require("../../map-string-lib/map-string/map-string-parser");
const map_string_format_1 = require("../../map-string-lib/map-string/map-string-format");
class DraftToMapString {
    static fromDraftState(draftState) {
        if (draftState.getSpeakerIndex() < 0) {
            throw new Error("Draft state must have a speaker index.");
        }
        const seatIndexToSliceTiles = new Map();
        const seatIndexToFaction = new Map();
        const seatIndexToPlayerName = new Map();
        for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
            const playerSlot = draftState.getSeatIndexToPlayerSlot(seatIndex);
            // Seat must be taken to link attributes.
            if (playerSlot >= 0) {
                // Slice tiles.
                draftState.getSlices().forEach((sliceTiles, sliceIndex) => {
                    if (draftState.getSliceIndexToPlayerSlot(sliceIndex) === playerSlot) {
                        seatIndexToSliceTiles.set(seatIndex, sliceTiles);
                    }
                });
                // Faction.
                draftState.getFactions().forEach((faction, factionIndex) => {
                    if (draftState.getFactionIndexToPlayerSlot(factionIndex) === playerSlot) {
                        seatIndexToFaction.set(seatIndex, faction);
                    }
                });
                // Player name.
                const player = api_1.world.getPlayerBySlot(playerSlot);
                if (player) {
                    seatIndexToPlayerName.set(seatIndex, player.getName());
                }
            }
            else {
                // Unclaimed seat, use speaker order as label.
                const speakerIndex = draftState.getSpeakerIndex();
                const label = seat_ui_1.SeatUI._getLabelOrThrow(seatIndex, speakerIndex);
                seatIndexToPlayerName.set(seatIndex, label);
            }
        }
        const draftToMapString = new DraftToMapString(draftState.getSliceShape(-1));
        const playerCount = TI4.config.playerCount;
        for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
            draftToMapString.overrideSliceShape(seatIndex, draftState.getSliceShape(seatIndex));
        }
        const mapStringAndHexToPlayerName = draftToMapString.buildMapString(seatIndexToSliceTiles, seatIndexToFaction, seatIndexToPlayerName);
        // Add base map overrides (systems not laid out by slices).
        const baseMap = draftState.getBaseMap();
        const oldMap = mapStringAndHexToPlayerName.mapString;
        const newMap = draftToMapString._addBaseMap(oldMap, baseMap);
        mapStringAndHexToPlayerName.mapString = newMap;
        return mapStringAndHexToPlayerName;
    }
    constructor(sliceShape) {
        this._seatIndexToSliceShape = new Map();
        this._seatIndexToAnchorHex = new Map();
        this._defaultSliceShape = sliceShape;
        const homeSystemLocs = new map_home_system_locations_1.MapHomeSystemLocations();
        const seats = TI4.playerSeats.getAllSeats();
        seats.forEach((seat, index) => {
            const playerSlot = seat.playerSlot;
            const homePosWorld = homeSystemLocs.get(playerSlot);
            if (homePosWorld) {
                const homePosHex = TI4.hex.fromPosition(homePosWorld);
                this._seatIndexToAnchorHex.set(index, homePosHex);
            }
        });
    }
    overrideSliceShape(seatIndex, sliceShape) {
        this._seatIndexToSliceShape.set(seatIndex, sliceShape);
        return this;
    }
    _getSliceShape(seatIndex) {
        const sliceShape = this._seatIndexToSliceShape.get(seatIndex);
        if (sliceShape) {
            return sliceShape;
        }
        return this._defaultSliceShape;
    }
    buildMapString(seatIndexToSliceTiles, seatIndexToFaction, seatIndexToPlayerName) {
        const mapStringEntries = ["{18}"];
        const hexToPlayerName = new Map();
        // When a slice does not have assigned tiles, use blank/colored tiles.
        const seatIndexToMissingTileNumber = new Map();
        TI4.playerSeats
            .getAllSeats()
            .forEach((seatEntry, seatIndex) => {
            const playerSlot = seatEntry.playerSlot;
            const tile = map_ui_1.MapUI.playerSlotToColorTileNumber(playerSlot);
            seatIndexToMissingTileNumber.set(seatIndex, tile);
        });
        const mapStringHex = new map_string_hex_1.MapStringHex();
        for (const seatIndex of seatIndexToMissingTileNumber.keys()) {
            const sliceShape = this._getSliceShape(seatIndex);
            const sliceTiles = seatIndexToSliceTiles.get(seatIndex);
            const faction = seatIndexToFaction.get(seatIndex);
            const missingTileNumber = seatIndexToMissingTileNumber.get(seatIndex);
            const anchorHex = this._seatIndexToAnchorHex.get(seatIndex);
            if (anchorHex) {
                const anchorPos = TI4.hex.toPosition(anchorHex);
                const dirHex = "<0,0,0>";
                const dirPos = TI4.hex.toPosition(dirHex);
                const dir = dirPos.subtract(anchorPos);
                const theta = Math.atan2(dir.y, dir.x);
                const cos = Math.cos(theta);
                const sin = Math.sin(theta);
                const playerName = seatIndexToPlayerName.get(seatIndex);
                if (playerName) {
                    hexToPlayerName.set(anchorHex, playerName);
                }
                // First entry in slice shape is the home system.
                sliceShape.forEach((shapeHex, tileIndex) => {
                    // Update position based on hex and direction to center.
                    const shapeOffset = TI4.hex.toPosition(shapeHex);
                    // Rotate offset in direction.
                    let dx = cos * shapeOffset.x - sin * shapeOffset.y;
                    let dy = sin * shapeOffset.x + cos * shapeOffset.y;
                    dx += anchorPos.x;
                    dy += anchorPos.y;
                    const pos = new api_1.Vector(dx, dy, 0);
                    const hex = TI4.hex.fromPosition(pos);
                    const mapStringIndex = mapStringHex.hexToIndex(hex);
                    let tile = -1;
                    if (tileIndex === 0 && faction) {
                        tile = faction.getHomeSystemTileNumber();
                    }
                    else if (sliceTiles) {
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
            }
        }
        this._fillMissingMapStringEntries(mapStringEntries);
        let mapString = mapStringEntries.join(" ");
        // Apply hyperlanes, if any.
        const playerCount = TI4.config.playerCount;
        const hyperlaneMapString = map_string_hyperlanes_1.MapStringHyperlanes.get(playerCount);
        mapString = new map_string_hyperlanes_1.MapStringHyperlanes().addHyperlanes(mapString, hyperlaneMapString);
        return { mapString, hexToPlayerName };
    }
    _fillMissingMapStringEntries(mapStringEntries) {
        for (let i = 0; i < mapStringEntries.length; i++) {
            if (mapStringEntries[i] === undefined) {
                mapStringEntries[i] = "-1";
            }
        }
    }
    _addBaseMap(oldMap, baseMap) {
        const parser = new map_string_parser_1.MapStringParser();
        const entries = parser.parseOrThrow(oldMap);
        const baseEntries = parser.parseOrThrow(baseMap);
        baseEntries.forEach((baseEntry, index) => {
            if (baseEntry.tile > 0) {
                const entry = entries[index];
                if (entry && entry.tile !== baseEntry.tile && entry.tile > 0) {
                    // Tile already exists, do not override.
                    throw new Error("base map overrides existing tile: " + entry.tile);
                }
                entries[index] = baseEntry;
            }
        });
        return new map_string_format_1.MapStringFormat().format(entries);
    }
}
exports.DraftToMapString = DraftToMapString;
//# sourceMappingURL=draft-to-map-string.js.map