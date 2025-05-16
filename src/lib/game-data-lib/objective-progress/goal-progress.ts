import { PlayerSlot } from "ttpg-darrell";
import { GoalCounter } from "./goal-counter";

export type GoalProgressPerPlayerType = {
  value: number | string | boolean;
  success: boolean;
};

export type GoalProgressType = {
  header: string;
  values: Array<GoalProgressPerPlayerType | undefined>; // by seat index
};

export function toSeats<T>(playerSlotToT: Map<PlayerSlot, T>): Array<T> {
  const result: Array<T> = [];
  playerSlotToT.forEach((value: T, playerSlot: PlayerSlot) => {
    const seatIndex: number =
      TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
    result[seatIndex] = value;
  });
  return result;
}

export class GoalProgress {
  private readonly _goalCounter: GoalCounter = new GoalCounter();

  flagshipOrWarSun(needed: number): GoalProgressType {
    return {
      header: "Flagship or War Sun",
      values: toSeats<number>(this._goalCounter.countFlagshipsAndWarSuns()).map(
        (value: number): GoalProgressPerPlayerType => {
          return {
            value: value,
            success: value >= needed,
          };
        }
      ),
    };
  }

  /**
   * Spend N inf
   * @param needed
   * @returns
   */
  influence(needed: number): GoalProgressType {
    return {
      header: "INF/TGS",
      values: toSeats<{ inf: number; res: number; tgs: number }>(
        this._goalCounter.countInfResTgs()
      ).map(
        (value: {
          inf: number;
          res: number;
          tgs: number;
        }): GoalProgressPerPlayerType => {
          const neededTgs: number = needed - value.inf;
          return {
            value: `${value.inf}/${value.tgs}`,
            success: value.tgs >= neededTgs,
          };
        }
      ),
    };
  }

  /**
   * Spend N inf
   * @param needed
   * @returns
   */
  resources(needed: number): GoalProgressType {
    return {
      header: "RES/TGS",
      values: toSeats<{ inf: number; res: number; tgs: number }>(
        this._goalCounter.countInfResTgs()
      ).map(
        (value: {
          inf: number;
          res: number;
          tgs: number;
        }): GoalProgressPerPlayerType => {
          const neededTgs: number = needed - value.res;
          return {
            value: `${value.res}/${value.tgs}`,
            success: value.tgs >= neededTgs,
          };
        }
      ),
    };
  }

  tradegoods(needed: number): GoalProgressType {
    return {
      header: "TGS",
      values: toSeats<{ inf: number; res: number; tgs: number }>(
        this._goalCounter.countInfResTgs()
      ).map(
        (value: {
          inf: number;
          res: number;
          tgs: number;
        }): GoalProgressPerPlayerType => {
          return {
            value: value.tgs,
            success: value.tgs >= needed,
          };
        }
      ),
    };
  }

  /*
   * Spend N inf, N res, N tgs
   */
  infResTgs(needed: number): GoalProgressType {
    return {
      header: "INF/RES/TGS",
      values: toSeats<{ inf: number; res: number; tgs: number }>(
        this._goalCounter.countInfResTgs()
      ).map(
        (value: {
          inf: number;
          res: number;
          tgs: number;
        }): GoalProgressPerPlayerType => {
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
        }
      ),
    };
  }

  maxNonFighterShipsInSingleSystem(needed: number): GoalProgressType {
    return {
      header: "Non-figher ships",
      values: toSeats<number>(
        this._goalCounter.countMaxNonFighterShipsInSingleSystem()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  morePlanetsThan2Neighbors(): GoalProgressType {
    const counts: Map<
      PlayerSlot,
      { planets: number; neighbors: Array<PlayerSlot> }
    > = this._goalCounter.countPlanetsAndGetNeighbors();

    return {
      header: "Planets",
      values: toSeats<{ planets: number; neighbors: Array<PlayerSlot> }>(
        counts
      ).map(
        (value: {
          planets: number;
          neighbors: Array<PlayerSlot>;
        }): GoalProgressPerPlayerType => {
          const myCount: number = value.planets;
          let moreCount: number = 0;
          for (const neighbor of value.neighbors) {
            const neighborValue:
              | { planets: number; neighbors: Array<PlayerSlot> }
              | undefined = counts.get(neighbor);
            if (neighborValue && neighborValue.planets < myCount) {
              moreCount += 1;
            }
          }
          return {
            value: myCount,
            success: moreCount >= 2,
          };
        }
      ),
    };
  }

  planetsInOthersHome(needed: number): GoalProgressType {
    return {
      header: "Planets others' home",
      values: toSeats<number>(this._goalCounter.countPlanetsInOthersHome()).map(
        (value: number): GoalProgressPerPlayerType => {
          return {
            value: value,
            success: value >= needed,
          };
        }
      ),
    };
  }

  planetsNonHome(
    needed: number,
    excludeCustodiaVigilia: boolean
  ): GoalProgressType {
    return {
      header: "Planets non-home",
      values: toSeats<number>(
        this._goalCounter.countPlanetsNonHome(excludeCustodiaVigilia)
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  planetsSameTrait(needed: number): GoalProgressType {
    return {
      header: "CUL/IND/HAZ",
      values: toSeats<{
        cultural: number;
        industrial: number;
        hazardous: number;
      }>(this._goalCounter.countPlanetTraits()).map(
        (value: {
          cultural: number;
          industrial: number;
          hazardous: number;
        }): GoalProgressPerPlayerType => {
          const max: number = Math.max(
            value.cultural,
            value.industrial,
            value.hazardous
          );
          return {
            value: `${value.cultural}/${value.industrial}/${value.hazardous}`,
            success: max >= needed,
          };
        }
      ),
    };
  }

  planetsWithAttachments(needed: number): GoalProgressType {
    return {
      header: "Planets w/attach",
      values: toSeats<number>(
        this._goalCounter.countPlanetsWithAttachments()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  planetsWithStructuresOutsidePlayersHome(needed: number): GoalProgressType {
    return {
      header: "Planets w/structures non-home",
      values: toSeats<number>(
        this._goalCounter.countPlanetsWithStructuresOutsidePlayersHome()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  planetsWithTechSpecialties(needed: number): GoalProgressType {
    return {
      header: "Planets w/tech",
      values: toSeats<number>(
        this._goalCounter.countPlanetsWithTechSpecialties()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  structures(needed: number): GoalProgressType {
    return {
      header: "Structures",
      values: toSeats<number>(this._goalCounter.countStructures()).map(
        (value: number): GoalProgressPerPlayerType => {
          return {
            value: value,
            success: value >= needed,
          };
        }
      ),
    };
  }

  systemsWithControlledPlanetsInOrAdjToOthersHome(
    needed: number
  ): GoalProgressType {
    return {
      header: "Systems",
      values: toSeats<number>(
        this._goalCounter.countSystemsWithControlledPlanetsInOrAdjToOthersHome()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  systemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol(
    needed: number
  ): GoalProgressType {
    return {
      header: "Systems",
      values: toSeats<number>(
        this._goalCounter.countSystemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  systemsWithoutPlanetsWithUnits(needed: number): GoalProgressType {
    return {
      header: "Systems",
      values: toSeats<number>(
        this._goalCounter.countSystemsWithoutPlanetsWithUnits()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  systemsWithShipsAdjToMecatol(needed: number): GoalProgressType {
    return {
      header: "Systems",
      values: toSeats<number>(
        this._goalCounter.countSystemsWithShipsAdjToMecatol()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  systemsWithUnitsInLegendaryMecatolOrAnomaly(
    needed: number
  ): GoalProgressType {
    return {
      header: "Systems",
      values: toSeats<number>(
        this._goalCounter.countSystemsWithUnitsInLegendaryMecatolOrAnomaly()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  systemsWithUnitsOnEdgeOfGameBoardOtherThanHome(
    needed: number
  ): GoalProgressType {
    return {
      header: "Systems",
      values: toSeats<number>(
        this._goalCounter.countSystemsWithUnitsOnEdgeOfGameBoardOtherThanHome()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }

  twoTechInColors(needed: number): GoalProgressType {
    return {
      header: "BLUE/GREEN/YELLOW/RED",
      values: toSeats<{
        blue: number;
        green: number;
        red: number;
        yellow: number;
        unitUpgrade: number;
      }>(this._goalCounter.countTechnologyColors()).map(
        (value: {
          blue: number;
          green: number;
          red: number;
          yellow: number;
          unitUpgrade: number;
        }): GoalProgressPerPlayerType => {
          let numTwo: number = 0;
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
        }
      ),
    };
  }

  techUnitUpgrades(needed: number): GoalProgressType {
    return {
      header: "Unit upgrades",
      values: toSeats<{
        blue: number;
        green: number;
        red: number;
        yellow: number;
        unitUpgrade: number;
      }>(this._goalCounter.countTechnologyColors()).map(
        (value: {
          blue: number;
          green: number;
          red: number;
          yellow: number;
          unitUpgrade: number;
        }): GoalProgressPerPlayerType => {
          return {
            value: value.unitUpgrade,
            success: value.unitUpgrade >= needed,
          };
        }
      ),
    };
  }

  tokensInTacticAndStrategy(needed: number): GoalProgressType {
    return {
      header: "Tokens",
      values: toSeats<number>(
        this._goalCounter.countTokensInTacticAndStrategy()
      ).map((value: number): GoalProgressPerPlayerType => {
        return {
          value: value,
          success: value >= needed,
        };
      }),
    };
  }
}
