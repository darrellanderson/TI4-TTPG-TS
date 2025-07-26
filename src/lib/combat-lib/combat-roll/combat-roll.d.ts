import { Player, Vector } from "@tabletop-playground/api";
import { DiceParams, Find, HexType } from "ttpg-darrell";
import { CombatAttrs } from "../../unit-lib/unit-attrs/combat-attrs";
import { Faction } from "../../faction-lib/faction/faction";
import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";
import { UnitAttrsSchemaType, UnitType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitAttrsSet } from "../../unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitModifier } from "../../unit-lib/unit-modifier/unit-modifier";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";
export type CombatRollType = "ambush" | "antiFighterBarrage" | "bombardment" | "spaceCannonOffense" | "spaceCannonDefense" | "spaceCombat" | "groundCombat" | "production";
export type CombatRollParams = {
    rollType: CombatRollType;
    hex: HexType;
    planetName?: string;
    activatingPlayerSlot: number;
    rollingPlayerSlot: number;
    overrideSelfFaction?: Faction;
    overrideOpponentFaction?: Faction;
};
export type BestUnitWithCombatAttrs = {
    unit: UnitType;
    combatAttrs: CombatAttrs;
};
export declare class CombatRollPerPlayerData {
    faction: Faction | undefined;
    playerSlot: number;
    readonly unitAttrsSet: UnitAttrsSet;
    readonly unitPlasticHex: Array<UnitPlastic>;
    readonly unitPlasticAdj: Array<UnitPlastic>;
    readonly overrideUnitCountHex: Map<UnitType, number>;
    readonly overrideUnitCountAdj: Map<UnitType, number>;
    /**
     * Try to add a synthetic unit to the player's unit set.
     * Only works if unit type does not already exist.
     *
     * The schema.unit "UnitType" restriction may need to be
     * violated with a "string as UnitType" cast.
     *
     * @param schema
     * @param count
     * @returns
     */
    addSyntheticUnit(schema: UnitAttrsSchemaType, count: number): boolean;
    getCount(unit: UnitType): number;
    getCountAdj(unit: UnitType): number;
    hasUnit(unit: UnitType): boolean;
    hasUnitAdj(unit: UnitType): boolean;
}
export declare class CombatRoll {
    private readonly _cardUtil;
    private readonly _params;
    private readonly _adjHexes;
    private readonly _modifiers;
    readonly system: System | undefined;
    readonly planet: Planet | undefined;
    readonly self: CombatRollPerPlayerData;
    readonly opponent: CombatRollPerPlayerData;
    readonly find: Find;
    static createCooked(params: CombatRollParams): CombatRoll;
    constructor(params: CombatRollParams);
    isCommanderUnlocked(cardNsid: string): boolean;
    _findUnitPlastics(): Array<UnitPlastic>;
    _findUnitAttrOverrides(playerSlot: number): Array<UnitAttrsSchemaType>;
    _findUnitModifiers(selfSlot: number, opponentSlot: number): Array<UnitModifier>;
    _getUnitToCombatAttrs(): Map<UnitType, CombatAttrs>;
    applyUnitPlasticAndSetOpponentPlayerSlot(): this;
    applyFactions(): this;
    applyUnitOverries(): this;
    applyUnitModifiers(errors: Array<Error>): this;
    applyUnitModifiersOrThrow(): this;
    bestHitUnitWithCombatAttrs(): BestUnitWithCombatAttrs | undefined;
    _pruneToUnitsClosestToPlanet(): this;
    _checkCancelBombardment(): boolean;
    createDiceParamsArray(): Array<DiceParams>;
    getActivatingPlayerSlot(): number;
    getUnitModifierNames(): Array<string>;
    getUnitModifierNamesWithDescriptions(): Array<string>;
    getRollType(): CombatRollType;
    getPlanetName(): string | undefined;
    roll(player: Player, position: Vector): void;
}
