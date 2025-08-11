import { GameObject, Player } from "@tabletop-playground/api";
import { HexType, IGlobal, PlayerSlot } from "ttpg-darrell";
import { UnitType } from "../../lib/unit-lib/schema/unit-attrs-schema";
import { UnitPlastic } from "../../lib/unit-lib/unit-plastic/unit-plastic";
export declare const NSID_BOOM_TOKEN: string;
export declare const ACTION_BOOM: string;
export declare const TOOLTIP_BOOM: string;
/**
 * Testing for homebrew.  Right click a token to roll a die for every unit
 * in the system, destroy on some value.
 */
export declare class RightClickTokenBoom implements IGlobal {
    private readonly _onObjectCreated;
    private readonly _onCustomAction;
    init(): void;
    _maybeAddContextMenu(obj: GameObject): void;
    _boom(clickedObject: GameObject, player: Player): void;
    /**
     * Get plastics in the clicked object's hex.
     *
     * @param hex
     * @returns
     */
    _getPlasticInHex(hex: HexType): Array<UnitPlastic>;
    /**
     * After right clicking a galvanize token, get the linked galvanized unit.
     *
     * @param clickedObject
     * @param plastics
     * @returns
     */
    _getGalvanizedPlastic(clickedObject: GameObject, plastics: Array<UnitPlastic>): UnitPlastic | undefined;
    _getTargetPlastics(omitPlayerSlot: number, plastics: Array<UnitPlastic>): Array<UnitPlastic>;
    _isShip(unit: UnitType): boolean;
    _getHitValue(hex: HexType, playerSlot: PlayerSlot, galvanizedUnit: UnitType, unitModifiers: Array<string>): number | undefined;
    _getAreaToPlastics(plastics: Array<UnitPlastic>): Map<string, Array<UnitPlastic>>;
    _rollBoom(areaToPlastics: Map<string, Array<UnitPlastic>>, hitValue: number): void;
    _applyBoomResult(unitObj: GameObject, rollValues: Array<number>, hitValue: number): void;
}
