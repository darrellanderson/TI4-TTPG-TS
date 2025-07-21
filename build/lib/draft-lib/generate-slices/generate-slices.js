"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSlices = exports.SliceInProgress = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const system_summary_1 = require("../../system-lib/system/system-summary");
const system_tier_1 = require("../../system-lib/system/system-tier");
class SliceInProgress {
    constructor(makeup) {
        this._systems = [];
        this._size = makeup.length;
        this._remainingMakeup = [...makeup];
    }
    addSystem(system) {
        this._systems.push(system);
        if (this._systems.length > this._size) {
            throw new Error("too many systems added");
        }
    }
    getNextRemainingTier() {
        return this._remainingMakeup[0];
    }
    getSystems() {
        return [...this._systems];
    }
    hasRemainingTier(tier) {
        return this._remainingMakeup.includes(tier);
    }
    removeRemainingTier(tier) {
        const index = this._remainingMakeup.indexOf(tier);
        if (index === -1) {
            throw new Error(`system tier (${tier}) not in remaining makeup`);
        }
        this._remainingMakeup.splice(index, 1);
    }
}
exports.SliceInProgress = SliceInProgress;
class GenerateSlices {
    constructor(params) {
        this._slicesInProgress = [];
        this._blacklistSystemTileNumbers = new Set();
        // Slice shape includes home system as first entry.
        params.sliceMakeups.forEach((sliceMakeup) => {
            if (params.sliceShape.length !== sliceMakeup.length + 1) {
                throw new Error("slice shape and makeup mismatch");
            }
        });
        this._params = Object.freeze(params);
    }
    setBlacklistSystemTileNumbers(systemTileNumbers) {
        this._blacklistSystemTileNumbers.clear();
        for (const systemTileNumber of systemTileNumbers) {
            this._blacklistSystemTileNumbers.add(systemTileNumber);
        }
        return this;
    }
    generateSlices(sliceCount) {
        for (let i = 0; i < sliceCount; i++) {
            const makeups = this._params.sliceMakeups;
            const index = Math.floor(Math.random() * makeups.length);
            let sliceMakeup = makeups[index];
            if (sliceMakeup) {
                sliceMakeup = new ttpg_darrell_1.Shuffle().shuffle([...sliceMakeup]);
                this._slicesInProgress.push(new SliceInProgress(sliceMakeup));
            }
        }
        // Get all candidate systems, split off promoted.
        const systems = this._getShuffledSystems();
        let promotedSystems = this._promoteWormholesAndLegendaries(systems);
        promotedSystems = new ttpg_darrell_1.Shuffle().shuffle(promotedSystems);
        // Add promoted systems to slices, spread evenly.
        const systemTier = new system_tier_1.SystemTier();
        for (const promotedSystem of promotedSystems) {
            const tier = systemTier.getTier(promotedSystem);
            const shortestSlice = this._getShortestSliceWithTier(tier);
            if (shortestSlice) {
                shortestSlice.addSystem(promotedSystem);
                shortestSlice.removeRemainingTier(tier);
            }
        }
        // Add remaining systems to slices.
        const pending = [...this._slicesInProgress];
        while (pending.length > 0) {
            const sliceInProgress = pending.shift();
            if (sliceInProgress) {
                const tier = sliceInProgress.getNextRemainingTier();
                if (tier) {
                    // Prefer the tier, but if none left use all systems.
                    const systemsForTier = this._getSystemsForTier(systems, tier);
                    // Choose and add system.
                    const choice = this._chooseAndAddNextSystem(sliceInProgress, systemsForTier);
                    sliceInProgress.removeRemainingTier(tier);
                    // Remove choice from systems.
                    const index = systems.indexOf(choice);
                    if (index !== -1) {
                        systems.splice(index, 1);
                    }
                }
                // If more to go, put back in pending.
                if (sliceInProgress.getNextRemainingTier()) {
                    pending.push(sliceInProgress);
                }
            }
        }
        return this._slicesInProgress.map((sliceInProgress) => {
            const slice = sliceInProgress
                .getSystems()
                .map((system) => system.getSystemTileNumber());
            return this._separateAnomalies(slice);
        });
    }
    _getShuffledSystems() {
        let systems = TI4.systemRegistry.getAllDraftableSystemsFilteredByConfigSources();
        systems = systems.filter((system) => {
            const tileNumber = system.getSystemTileNumber();
            return !this._blacklistSystemTileNumbers.has(tileNumber);
        });
        systems = new ttpg_darrell_1.Shuffle().shuffle(systems);
        return systems;
    }
    _getSystemsForTier(systems, tier) {
        const systemTier = new system_tier_1.SystemTier();
        let result = systems.filter((system) => systemTier.getTier(system) === tier);
        // Try to use the requested tier, but if none left use all systems.
        if (result.length === 0) {
            result = systems;
        }
        if (result.length === 0) {
            throw new Error(`no systems for tier ${tier}`);
        }
        return result;
    }
    _getShortestSliceWithTier(tier) {
        let shortestSlice = undefined;
        for (const sliceInProgress of this._slicesInProgress) {
            if (sliceInProgress.hasRemainingTier(tier)) {
                if (!shortestSlice ||
                    sliceInProgress.getSystems().length <
                        shortestSlice.getSystems().length) {
                    shortestSlice = sliceInProgress;
                }
            }
        }
        return shortestSlice;
    }
    _chooseAndAddNextSystem(sliceInProgress, systems) {
        const options = systems.map((system) => {
            return { weight: this._score(sliceInProgress, system), value: system };
        });
        const system = new ttpg_darrell_1.WeightedChoice(options).choice();
        sliceInProgress.addSystem(system);
        return system;
    }
    _score(sliceInProgress, system) {
        const systems = [...sliceInProgress.getSystems()];
        systems.push(system);
        const summary = new system_summary_1.SystemSummary(systems).getSummaryRaw();
        // Make some setups extremely unlikely.
        if (summary.legendary.length > 1) {
            return 0.001;
        }
        if (summary.wormholes.length > 1) {
            return 0.001;
        }
        const avgOptInf = summary.optInfluence / systems.length;
        const avgOptRes = summary.optResources / systems.length;
        // Milty draft requires:
        // - mininf = 4.0,
        // - minres = 2.5,
        // - mintot = 9.0,
        // - maxtot = 13.0
        const minAvgOptInf = 4 / 5;
        const minAvgOptRes = 2.5 / 5;
        const minAvgTot = 9 / 5;
        const maxAvgTot = 13 / 5;
        const targetOptInf = 1.354; // 4/(4+2.5)*11/5
        const targetOptRes = 0.846; // 2.5/(4+2.5)*11/5
        const weightMinInf = Math.min(1, avgOptInf / minAvgOptInf);
        const weightMinRes = Math.min(1, avgOptRes / minAvgOptRes);
        const weightMinTot = Math.min(1, (avgOptInf + avgOptRes) / minAvgTot);
        const weightMaxTot = avgOptInf + avgOptRes > maxAvgTot ? 0.001 : 1;
        const weightTargetInf = 1 / (Math.abs(avgOptInf - targetOptInf) + 1);
        const weightTargetRes = 1 / (Math.abs(avgOptRes - targetOptRes) + 1);
        const score = 100 *
            weightMinInf *
            weightMinRes *
            weightMinTot *
            weightMaxTot *
            weightTargetInf *
            weightTargetRes;
        return score;
    }
    /**
     * Promote wormholes and legendaries according to params.  Return them in a
     * new array, removing them from the input systems array.
     *
     * @param systems
     */
    _promoteWormholesAndLegendaries(systems) {
        // Blacklist systems are already placed on the map, with
        // slices getting added around them.  Remove blacklist
        // numbers from the promotion counts.
        const blackListSystems = [];
        for (const tile of this._blacklistSystemTileNumbers) {
            const system = TI4.systemRegistry.getBySystemTileNumber(tile);
            if (system) {
                blackListSystems.push(system);
            }
        }
        const blacklistedAlphas = blackListSystems.filter((system) => system.getWormholes().includes("alpha")).length;
        const blacklistedBetas = blackListSystems.filter((system) => system.getWormholes().includes("beta")).length;
        const blacklistedLegendaries = blackListSystems.filter((system) => system.isLegendary()).length;
        // Move candidates from input systems to promoted.
        let count;
        let promoteCandidates;
        const promoted = [];
        const doPromotion = () => {
            for (let i = 0; i < count; i++) {
                const system = promoteCandidates.shift();
                if (system) {
                    const index = systems.indexOf(system);
                    if (index !== -1) {
                        systems.splice(index, 1);
                        promoted.push(system);
                    }
                }
            }
        };
        count = this._params.minAlphaWormholes || 0;
        count -= blacklistedAlphas;
        promoteCandidates = systems.filter((system) => system.getWormholes().includes("alpha"));
        doPromotion();
        count = this._params.minBetaWormholes || 0;
        count -= blacklistedBetas;
        promoteCandidates = systems.filter((system) => system.getWormholes().includes("beta"));
        doPromotion();
        count = this._params.minLegendary || 0;
        count -= blacklistedLegendaries;
        promoteCandidates = systems.filter((system) => system.isLegendary());
        doPromotion();
        return promoted;
    }
    _hasAdjacentAnomalies(slice) {
        // Slice shape includes home system as first entry.
        if (this._params.sliceShape.length !== slice.length + 1) {
            throw new Error(`slice shape (${this._params.sliceShape.length}) and slice length (${slice.length}) mismatch`);
        }
        const hexIsAnomalySet = new Set();
        for (let i = 0; i < slice.length; i++) {
            const hex = this._params.sliceShape[i + 1]; // first is home system
            const tileNumber = slice[i];
            if (hex && tileNumber !== undefined) {
                const system = TI4.systemRegistry.getBySystemTileNumber(tileNumber);
                if (system && system.getAnomalies().length > 0) {
                    hexIsAnomalySet.add(hex);
                }
            }
        }
        for (const hex of this._params.sliceShape) {
            if (!hexIsAnomalySet.has(hex)) {
                continue;
            }
            for (const adj of ttpg_darrell_1.Hex.neighbors(hex)) {
                if (hexIsAnomalySet.has(adj)) {
                    return true;
                }
            }
        }
        return false;
    }
    _separateAnomalies(slice, tryShuffleFirst = true) {
        // Slice shape includes home system as first entry.
        if (this._params.sliceShape.length !== slice.length + 1) {
            throw new Error(`slice shape (${this._params.sliceShape.length}) and slice length (${slice.length}) mismatch`);
        }
        slice = [...slice]; // work with a copy
        // First, shuffle a few times and see if we get a good setup.
        // Give up after a reasonable number of tries.
        if (tryShuffleFirst) {
            const shuffle = new ttpg_darrell_1.Shuffle();
            for (let i = 0; i < 20; i++) {
                if (!this._hasAdjacentAnomalies(slice)) {
                    return slice;
                }
                slice = shuffle.shuffle([...slice]);
            }
        }
        // No luck.  Walk through slice permutations and use the first good one.
        // (This always fixes the same way, hence a few random stabs before this.)
        const inspector = (candidate) => {
            return !this._hasAdjacentAnomalies(candidate);
        };
        const goodSlice = this._permutator([...slice], inspector);
        if (goodSlice) {
            slice = goodSlice;
        }
        return slice;
    }
    _permutator(array, inspector) {
        // https://stackoverflow.com/questions/9960908/permutations-in-javascript
        let result = undefined;
        const permute = (arr, m = []) => {
            if (arr.length === 0) {
                const success = inspector(m);
                if (success) {
                    result = m;
                }
            }
            else {
                for (let i = 0; i < arr.length; i++) {
                    const curr = arr.slice();
                    const next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next));
                    // Stop after first success.
                    if (result) {
                        break;
                    }
                }
            }
        };
        permute(array);
        return result;
    }
}
exports.GenerateSlices = GenerateSlices;
//# sourceMappingURL=generate-slices.js.map