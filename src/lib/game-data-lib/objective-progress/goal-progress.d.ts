import { PlayerSlot } from "ttpg-darrell";
export type GoalProgressPerPlayerType = {
    value: number | string | boolean;
    success: boolean;
};
export type GoalProgressType = {
    header: string;
    values: Array<GoalProgressPerPlayerType | undefined>;
};
export declare function toSeats<T>(playerSlotToT: Map<PlayerSlot, T>): Array<T>;
export declare class GoalProgress {
    private readonly _goalCounter;
    flagshipOrWarSun(needed: number): GoalProgressType;
    /**
     * Spend N inf
     * @param needed
     * @returns
     */
    influence(needed: number): GoalProgressType;
    /**
     * Spend N inf
     * @param needed
     * @returns
     */
    resources(needed: number): GoalProgressType;
    tradegoods(needed: number): GoalProgressType;
    infResTgs(needed: number): GoalProgressType;
    maxNonFighterShipsInSingleSystem(needed: number): GoalProgressType;
    morePlanetsThan2Neighbors(): GoalProgressType;
    planetsInOthersHome(needed: number): GoalProgressType;
    planetsNonHome(needed: number, excludeCustodiaVigilia: boolean): GoalProgressType;
    planetsSameTrait(needed: number): GoalProgressType;
    planetsWithAttachments(needed: number): GoalProgressType;
    planetsWithStructuresOutsidePlayersHome(needed: number): GoalProgressType;
    planetsWithTechSpecialties(needed: number): GoalProgressType;
    structures(needed: number): GoalProgressType;
    systemsWithControlledPlanetsInOrAdjToOthersHome(needed: number): GoalProgressType;
    systemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol(needed: number): GoalProgressType;
    systemsWithoutPlanetsWithUnits(needed: number): GoalProgressType;
    systemsWithShipsAdjToMecatol(needed: number): GoalProgressType;
    systemsWithUnitsInLegendaryMecatolOrAnomaly(needed: number): GoalProgressType;
    systemsWithUnitsOnEdgeOfGameBoardOtherThanHome(needed: number): GoalProgressType;
    twoTechInColors(needed: number): GoalProgressType;
    techUnitUpgrades(needed: number): GoalProgressType;
    tokensInTacticAndStrategy(needed: number): GoalProgressType;
}
