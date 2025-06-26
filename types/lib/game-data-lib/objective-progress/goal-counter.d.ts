import { Card } from "@tabletop-playground/api";
import { HexType, PlayerSlot } from "ttpg-darrell";
export declare class GoalCounter {
    private readonly _find;
    _getSystemHexes(): Set<HexType>;
    _getPlayerSlotToPlanetCards(): Map<PlayerSlot, Array<Card>>;
    _getPlayerSlotToHomePlanetCardNsids(): Map<PlayerSlot, Set<string>>;
    _getAllHomePlanetCardNsids(): Set<string>;
    _getPlayerSlotToHomeSystemHex(): Map<PlayerSlot, HexType>;
    _getPlayerSlotToControlledPlanetHexes(): Map<PlayerSlot, Set<HexType>>;
    /**
     * Count per-player number of flagships and war suns.
     *
     * @returns
     */
    countFlagshipsAndWarSuns(): Map<PlayerSlot, number>;
    countInfResTgs(): Map<PlayerSlot, {
        inf: number;
        res: number;
        tgs: number;
    }>;
    countMaxNonFighterShipsInSingleSystem(): Map<PlayerSlot, number>;
    countPlanetsAndGetNeighbors(): Map<PlayerSlot, {
        planets: number;
        neighbors: Array<PlayerSlot>;
    }>;
    countPlanetsInOthersHome(): Map<PlayerSlot, number>;
    countPlanetsNonHome(excludeCustodiaVigilia: boolean): Map<PlayerSlot, number>;
    countPlanetTraits(): Map<PlayerSlot, {
        cultural: number;
        industrial: number;
        hazardous: number;
    }>;
    countPlanetsWithAttachments(): Map<PlayerSlot, number>;
    countPlanetsWithStructuresOutsidePlayersHome(): Map<PlayerSlot, number>;
    countPlanetsWithTechSpecialties(): Map<PlayerSlot, number>;
    countStructures(): Map<PlayerSlot, number>;
    countSystemsWithControlledPlanetsInOrAdjToOthersHome(): Map<PlayerSlot, number>;
    countSystemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol(): Map<PlayerSlot, number>;
    countSystemsWithoutPlanetsWithUnits(): Map<PlayerSlot, number>;
    countSystemsWithShipsAdjToMecatol(): Map<PlayerSlot, number>;
    countSystemsWithUnitsInLegendaryMecatolOrAnomaly(): Map<PlayerSlot, number>;
    countSystemsWithUnitsOnEdgeOfGameBoardOtherThanHome(): Map<PlayerSlot, number>;
    countTechnologyColors(): Map<PlayerSlot, {
        blue: number;
        green: number;
        red: number;
        yellow: number;
        unitUpgrade: number;
    }>;
    countTokensInTacticAndStrategy(): Map<PlayerSlot, number>;
}
