"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NucleusDraft = exports.NUCLEUS_MAP_STRING = exports.NUCLEUS_SLICE_SHAPE_ALT = exports.NUCLEUS_SLICE_SHAPE = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const draft_state_1 = require("../draft-state/draft-state");
const map_string_hex_1 = require("../../map-string-lib/map-string/map-string-hex");
const system_tier_1 = require("../../system-lib/system/system-tier");
const draft_to_map_string_1 = require("../draft-to-map-string/draft-to-map-string");
const map_string_parser_1 = require("../../map-string-lib/map-string/map-string-parser");
const milty_1 = require("./milty");
exports.NUCLEUS_SLICE_SHAPE = [
    "<0,0,0>", // home system
    "<1,-1,0>", // left
    "<1,0,-1>", // front
    "<0,1,-1>", // right
];
exports.NUCLEUS_SLICE_SHAPE_ALT = [
    "<0,0,0>", // home system
    "<1,-1,0>", // left
    "<2,0,-2>", // front (pushed forward)
    "<1,0,-1>", // right (pushed forward)
];
exports.NUCLEUS_MAP_STRING = "1 1 1 1 1 1 -1 1 -1 1 -1 1 -1 1 -1 1 -1 1";
const NUM_WORMHOLES = [2, 3, 4];
const NUM_REDS = [5, 6];
class NucleusDraft {
    isEnabled() {
        return true;
    }
    getDraftName() {
        return "Nucleus Draft";
    }
    getGenerateSlicesParams() {
        const generateSlicesParams = {
            sliceMakeups: [
                ["high", "low", "red"],
                ["med", "med", "red"],
            ],
            sliceShape: exports.NUCLEUS_SLICE_SHAPE,
            minAlphaWormholes: 2,
            minBetaWormholes: 2,
            minLegendary: 1,
        };
        return generateSlicesParams;
    }
    createEmptyDraftState(namespaceId) {
        const draftState = new draft_state_1.DraftState(namespaceId)
            .setSpeakerIndex(0)
            .setSliceShape(exports.NUCLEUS_SLICE_SHAPE);
        if (TI4.config.playerCount === 7) {
            draftState.overrideSliceShape(3, exports.NUCLEUS_SLICE_SHAPE_ALT);
        }
        else if (TI4.config.playerCount === 8) {
            draftState.overrideSliceShape(3, exports.NUCLEUS_SLICE_SHAPE_ALT);
            draftState.overrideSliceShape(7, exports.NUCLEUS_SLICE_SHAPE_ALT);
        }
        // Get the indexes of the "1" entries.
        const mapStringIndexes = this._getNucleusMapStringIndexes();
        // Get the map string parts including the '-1's.
        const entries = [];
        mapStringIndexes.forEach((index) => {
            entries[index] = 1;
        });
        for (let i = 0; i < entries.length; i++) {
            if (entries[i] !== 1) {
                entries[i] = -1;
            }
        }
        // Add wormholes.
        const numWormholes = new ttpg_darrell_1.Shuffle().choice(NUM_WORMHOLES);
        let numRedWormholes = 0;
        if (numWormholes) {
            const wormholes = new ttpg_darrell_1.Shuffle().shuffle(this._getAvailableWormholes());
            const scatteredWormholes = this._getScattered(mapStringIndexes, numWormholes);
            this._fillEntriesOrThrow(scatteredWormholes, wormholes, entries);
            // Count red wormholes towards num reds assigned.
            const systemTier = new system_tier_1.SystemTier();
            numRedWormholes = wormholes.filter((wormhole) => {
                const system = TI4.systemRegistry.getBySystemTileNumber(wormhole);
                return system !== undefined && systemTier.getTier(system) === "red";
            }).length;
        }
        // Add reds.
        let numReds = new ttpg_darrell_1.Shuffle().choice(NUM_REDS);
        if (numReds) {
            numReds = Math.max(0, numReds - numRedWormholes);
            const redSystems = new ttpg_darrell_1.Shuffle().shuffle(this._getNonWormholeRedSystems());
            const scatteredReds = this._getScattered(mapStringIndexes, numReds);
            this._fillEntriesOrThrow(scatteredReds, redSystems, entries);
        }
        // Add blues.  Map string indexes gets pruned as we go,
        // the remaining indexes are unfilled awaiting blue systems.
        const numBlues = mapStringIndexes.length;
        const blueSystems = new ttpg_darrell_1.Shuffle()
            .shuffle(this._getNonWormholeBlueSystems())
            .slice(0, numBlues);
        this._fillEntriesOrThrow(mapStringIndexes, blueSystems, entries);
        draftState.setBaseMap(entries.join(" "));
        return draftState;
    }
    _getNucleusMapStringIndexes() {
        // Leverage draft state to map string.
        // Use the milty slice shape, setting the eq+far to 1
        // and the rest to 2 (need values everywhere for hyperlane
        // addition to shift to open slots)
        const nucluesDraftState = new draft_state_1.DraftState("@nucleus-inner/ti4")
            .setSliceShape(milty_1.MILTY_SLICE_SHAPE)
            .setSpeakerIndex(0);
        if (TI4.config.playerCount === 7) {
            nucluesDraftState.overrideSliceShape(3, milty_1.MILTY_SLICE_SHAPE_ALT);
        }
        else if (TI4.config.playerCount === 8) {
            nucluesDraftState.overrideSliceShape(3, milty_1.MILTY_SLICE_SHAPE_ALT);
            nucluesDraftState.overrideSliceShape(7, milty_1.MILTY_SLICE_SHAPE_ALT);
        }
        const slices = [];
        for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
            const playerSlot = 10 + seatIndex;
            nucluesDraftState.setSliceIndexToPlayerSlot(seatIndex, playerSlot);
            nucluesDraftState.setSeatIndexToPlayerSlot(seatIndex, playerSlot);
            slices.push([2, 2, 2, 1, 1]);
        }
        nucluesDraftState.setSlices(slices);
        const mapString = draft_to_map_string_1.DraftToMapString.fromDraftState(nucluesDraftState).mapString;
        nucluesDraftState.destroy();
        const parsed = new map_string_parser_1.MapStringParser()
            .parseOrThrow(mapString)
            .filter((entry) => {
            return entry.tile !== 18;
        });
        const nucleusMapStringIndexes = [];
        parsed.forEach((entry, index) => {
            if (entry.tile === 1) {
                nucleusMapStringIndexes.push(index);
            }
        });
        return nucleusMapStringIndexes;
    }
    /**
     * Choose a handful of random wormhole location sets, use the
     * one with the largest "smallest distance between two wormholes".
     * Don't check too many, or results will be too similar.
     *
     * As a side effect, remove the chosen map string indexes from the
     * input array.
     */
    _getScattered(mapStringIndexes, want, iterations = 50) {
        if (mapStringIndexes.length < want) {
            throw new Error(`NucleusDraft._getScattered: mapStringIndexes.length (${mapStringIndexes.length}) < want (${want})`);
        }
        const mapStringHex = new map_string_hex_1.MapStringHex();
        const idxToPosition = new Map();
        mapStringIndexes.forEach((i) => {
            const hex = mapStringHex.indexToHex(i);
            const pos = TI4.hex.toPosition(hex);
            idxToPosition.set(i, pos);
        });
        let best = [];
        let bestDistance = 0;
        const shuffler = new ttpg_darrell_1.Shuffle();
        for (let iteration = 0; iteration < iterations; iteration++) {
            const candidate = shuffler
                .shuffle([...mapStringIndexes])
                .slice(0, want);
            let minDistance = undefined;
            candidate.forEach((i) => {
                candidate.forEach((j) => {
                    if (i <= j) {
                        return;
                    }
                    const iPos = idxToPosition.get(i);
                    const jPos = idxToPosition.get(j);
                    if (iPos !== undefined && jPos !== undefined) {
                        const distance = iPos.distance(jPos);
                        if (minDistance === undefined || distance < minDistance) {
                            minDistance = distance;
                        }
                    }
                });
            });
            if (minDistance !== undefined && minDistance > bestDistance) {
                bestDistance = minDistance;
                best = candidate;
            }
        }
        // Remove the chosen indexes from the input array.
        for (const index of best) {
            const idx = mapStringIndexes.indexOf(index);
            if (idx !== -1) {
                mapStringIndexes.splice(idx, 1);
            }
        }
        return best;
    }
    _getAvailableWormholes() {
        const skipContained = false;
        const wormholes = TI4.systemRegistry
            .getAllSystemsWithObjs(skipContained)
            .filter((system) => {
            return !system.isExcludeFromDraft() && system.getWormholes().length > 0;
        })
            .map((system) => {
            return system.getSystemTileNumber();
        });
        return wormholes;
    }
    _getNonWormholeRedSystems() {
        const systemTier = new system_tier_1.SystemTier();
        const skipContained = false;
        const redSystems = TI4.systemRegistry
            .getAllSystemsWithObjs(skipContained)
            .filter((system) => {
            return (!system.isExcludeFromDraft() &&
                system.getWormholes().length === 0 &&
                systemTier.getTier(system) === "red");
        })
            .map((system) => {
            return system.getSystemTileNumber();
        });
        return redSystems;
    }
    _getNonWormholeBlueSystems() {
        const systemTier = new system_tier_1.SystemTier();
        const skipContained = false;
        const blueSystems = TI4.systemRegistry
            .getAllSystemsWithObjs(skipContained)
            .filter((system) => {
            return (!system.isExcludeFromDraft() &&
                system.getWormholes().length === 0 &&
                systemTier.getTier(system) !== "red");
        })
            .map((system) => {
            return system.getSystemTileNumber();
        });
        return blueSystems;
    }
    _fillEntriesOrThrow(fillIndexes, fillWith, entries) {
        fillIndexes.forEach((fillIndex, index) => {
            const fillValue = fillWith[index];
            if (fillValue === undefined) {
                throw new Error(`NucleusDraft._fillEntriesOrThrow: fillValue[${fillIndex}] is undefined`);
            }
            if (entries[fillIndex] !== 1) {
                throw new Error(`NucleusDraft._fillEntriesOrThrow: entries[${fillIndex}] is not 1`);
            }
            entries[fillIndex] = fillValue;
        });
    }
}
exports.NucleusDraft = NucleusDraft;
//# sourceMappingURL=nucleus.js.map