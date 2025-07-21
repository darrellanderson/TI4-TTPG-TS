"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalProgress = void 0;
exports.toSeats = toSeats;
const goal_counter_1 = require("./goal-counter");
function toSeats(playerSlotToT) {
    const result = [];
    playerSlotToT.forEach((value, playerSlot) => {
        const seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
        result[seatIndex] = value;
    });
    return result;
}
class GoalProgress {
    constructor() {
        this._goalCounter = new goal_counter_1.GoalCounter();
    }
    flagshipOrWarSun(needed) {
        return {
            header: "Flagship or War Sun",
            values: toSeats(this._goalCounter.countFlagshipsAndWarSuns()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    /**
     * Spend N inf
     * @param needed
     * @returns
     */
    influence(needed) {
        return {
            header: "INF/TGS",
            values: toSeats(this._goalCounter.countInfResTgs()).map((value) => {
                const neededTgs = needed - value.inf;
                return {
                    value: `${value.inf}/${value.tgs}`,
                    success: value.tgs >= neededTgs,
                };
            }),
        };
    }
    /**
     * Spend N inf
     * @param needed
     * @returns
     */
    resources(needed) {
        return {
            header: "RES/TGS",
            values: toSeats(this._goalCounter.countInfResTgs()).map((value) => {
                const neededTgs = needed - value.res;
                return {
                    value: `${value.res}/${value.tgs}`,
                    success: value.tgs >= neededTgs,
                };
            }),
        };
    }
    tradegoods(needed) {
        return {
            header: "TGS",
            values: toSeats(this._goalCounter.countInfResTgs()).map((value) => {
                return {
                    value: value.tgs,
                    success: value.tgs >= needed,
                };
            }),
        };
    }
    /*
     * Spend N inf, N res, N tgs
     */
    infResTgs(needed) {
        return {
            header: "INF/RES/TGS",
            values: toSeats(this._goalCounter.countInfResTgs()).map((value) => {
                let neededTgs = needed;
                if (value.inf < needed) {
                    neededTgs += needed - value.inf;
                }
                if (value.res < needed) {
                    neededTgs += needed - value.res;
                }
                return {
                    value: `${value.inf}/${value.res}/${value.tgs}`,
                    success: value.tgs >= neededTgs,
                };
            }),
        };
    }
    maxNonFighterShipsInSingleSystem(needed) {
        return {
            header: "Non-figher ships",
            values: toSeats(this._goalCounter.countMaxNonFighterShipsInSingleSystem()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    morePlanetsThan2Neighbors() {
        const counts = this._goalCounter.countPlanetsAndGetNeighbors();
        return {
            header: "Planets",
            values: toSeats(counts).map((value) => {
                const myCount = value.planets;
                let moreCount = 0;
                for (const neighbor of value.neighbors) {
                    const neighborValue = counts.get(neighbor);
                    if (neighborValue && neighborValue.planets < myCount) {
                        moreCount += 1;
                    }
                }
                return {
                    value: myCount,
                    success: moreCount >= 2,
                };
            }),
        };
    }
    planetsInOthersHome(needed) {
        return {
            header: "Planets others' home",
            values: toSeats(this._goalCounter.countPlanetsInOthersHome()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    planetsNonHome(needed, excludeCustodiaVigilia) {
        return {
            header: "Planets non-home",
            values: toSeats(this._goalCounter.countPlanetsNonHome(excludeCustodiaVigilia)).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    planetsSameTrait(needed) {
        return {
            header: "CUL/IND/HAZ",
            values: toSeats(this._goalCounter.countPlanetTraits()).map((value) => {
                const max = Math.max(value.cultural, value.industrial, value.hazardous);
                return {
                    value: `${value.cultural}/${value.industrial}/${value.hazardous}`,
                    success: max >= needed,
                };
            }),
        };
    }
    planetsWithAttachments(needed) {
        return {
            header: "Planets w/attach",
            values: toSeats(this._goalCounter.countPlanetsWithAttachments()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    planetsWithStructuresOutsidePlayersHome(needed) {
        return {
            header: "Planets w/structures non-home",
            values: toSeats(this._goalCounter.countPlanetsWithStructuresOutsidePlayersHome()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    planetsWithTechSpecialties(needed) {
        return {
            header: "Planets w/tech",
            values: toSeats(this._goalCounter.countPlanetsWithTechSpecialties()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    structures(needed) {
        return {
            header: "Structures",
            values: toSeats(this._goalCounter.countStructures()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    systemsWithControlledPlanetsInOrAdjToOthersHome(needed) {
        return {
            header: "Systems",
            values: toSeats(this._goalCounter.countSystemsWithControlledPlanetsInOrAdjToOthersHome()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    systemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol(needed) {
        return {
            header: "Systems",
            values: toSeats(this._goalCounter.countSystemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    systemsWithoutPlanetsWithUnits(needed) {
        return {
            header: "Systems",
            values: toSeats(this._goalCounter.countSystemsWithoutPlanetsWithUnits()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    systemsWithShipsAdjToMecatol(needed) {
        return {
            header: "Systems",
            values: toSeats(this._goalCounter.countSystemsWithShipsAdjToMecatol()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    systemsWithUnitsInLegendaryMecatolOrAnomaly(needed) {
        return {
            header: "Systems",
            values: toSeats(this._goalCounter.countSystemsWithUnitsInLegendaryMecatolOrAnomaly()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    systemsWithUnitsOnEdgeOfGameBoardOtherThanHome(needed) {
        return {
            header: "Systems",
            values: toSeats(this._goalCounter.countSystemsWithUnitsOnEdgeOfGameBoardOtherThanHome()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
    twoTechInColors(needed) {
        return {
            header: "BLUE/GREEN/YELLOW/RED",
            values: toSeats(this._goalCounter.countTechnologyColors()).map((value) => {
                let numTwo = 0;
                if (value.blue >= 2) {
                    numTwo += 1;
                }
                if (value.green >= 2) {
                    numTwo += 1;
                }
                if (value.red >= 2) {
                    numTwo += 1;
                }
                if (value.yellow >= 2) {
                    numTwo += 1;
                }
                return {
                    value: `${value.blue}/${value.green}/${value.yellow}/${value.red}`,
                    success: numTwo >= needed,
                };
            }),
        };
    }
    techUnitUpgrades(needed) {
        return {
            header: "Unit upgrades",
            values: toSeats(this._goalCounter.countTechnologyColors()).map((value) => {
                return {
                    value: value.unitUpgrade,
                    success: value.unitUpgrade >= needed,
                };
            }),
        };
    }
    tokensInTacticAndStrategy(needed) {
        return {
            header: "Tokens",
            values: toSeats(this._goalCounter.countTokensInTacticAndStrategy()).map((value) => {
                return {
                    value: value,
                    success: value >= needed,
                };
            }),
        };
    }
}
exports.GoalProgress = GoalProgress;
//# sourceMappingURL=goal-progress.js.map