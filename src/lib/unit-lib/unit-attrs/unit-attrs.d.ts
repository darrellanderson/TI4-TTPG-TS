import { Color } from "@tabletop-playground/api";
import { UnitAttrsSchemaType, UnitType } from "../schema/unit-attrs-schema";
import { CombatAttrs } from "./combat-attrs";
/**
 * Unit attributes, e.g. cost, combat stats.
 *
 * Unlike systems, make unit attributes mutable because unit modifiers
 * can get very compliated; provide them simpler access to attributes.
 * This does mean need to regenerate unit attributes for each instance.
 */
export declare class UnitAttrs {
    private readonly _unit;
    private readonly _componentCount;
    private _name;
    private _cost;
    private _producePerCost;
    private _produceQuantityDoesNotCountAgainstProductionLimits;
    private _sharedProduceQuantityDoesNotCountAgainstProductionLimits;
    private _diceColor;
    private _isShip;
    private _isGround;
    private _hasSustainDamage;
    private _hasPlanetaryShield;
    private _disablePlanetaryShield;
    private _disableAntiFighterBarrage;
    private _disableBombardment;
    private _disableSpaceCannonDefense;
    private _disableSpaceCannonOffsense;
    private _disableSustainDamage;
    private _antiFighterBarrage;
    private _bombardment;
    private _spaceCannon;
    private _spaceCombat;
    private _groundCombat;
    static schemaToNsid(source: string, schema: UnitAttrsSchemaType): string;
    static sortByOverrideOrder(attrs: Array<UnitAttrsSchemaType>): Array<UnitAttrsSchemaType>;
    constructor(params: UnitAttrsSchemaType);
    /**
     * Apply overrides to the given attributes.
     * If an attribute is missing, do not change it.
     *
     * @param override
     * @returns
     */
    applyOverride(override: UnitAttrsSchemaType): this;
    getAntiFighterBarrage(): CombatAttrs | undefined;
    getAntiFighterBarrageOrThrow(): CombatAttrs;
    getBombardment(): CombatAttrs | undefined;
    getBombardmentOrThrow(): CombatAttrs;
    getComponentCount(): number;
    getCost(): number | undefined;
    getDiceColor(): Color;
    getDisableAntiFighterBarrage(): boolean;
    getDisableBombardment(): boolean;
    getDisablePlanetaryShield(): boolean;
    getDisableSpaceCannonDefense(): boolean;
    getDisableSpaceCannonOffense(): boolean;
    getDisableSustainDamage(): boolean;
    getGroundCombat(): CombatAttrs | undefined;
    getGroundCombatOrThrow(): CombatAttrs;
    getImg(): string;
    getImgPackageId(): string;
    getName(): string;
    getProducePerCost(): number;
    getProduceQuantityDoesNotCountAgainstProductionLimits(): number;
    getSharedProduceQuantityDoesNotCountAgainstProductionLimits(): number;
    getSpaceCannon(): CombatAttrs | undefined;
    getSpaceCannonOrThrow(): CombatAttrs;
    getSpaceCombat(): CombatAttrs | undefined;
    getSpaceCombatOrThrow(): CombatAttrs;
    getUnit(): UnitType;
    hasPlanetaryShild(): boolean;
    hasSustainDamage(): boolean;
    isGround(): boolean;
    isShip(): boolean;
    setAntiFighterBarrage(value: CombatAttrs | undefined): this;
    setBombardment(value: CombatAttrs | undefined): this;
    setCost(value: number): this;
    setDisableAntiFighterBarrage(value: boolean): this;
    setDisableBombardment(value: boolean): this;
    setDisablePlanetaryShield(value: boolean): this;
    setDisableSpaceCannonDefense(value: boolean): this;
    setDisableSpaceCannonOffense(value: boolean): this;
    setDisableSustainDamage(value: boolean): this;
    setGroundCombat(value: CombatAttrs | undefined): this;
    setHasPlanetaryShield(value: boolean): this;
    setHasSustainDamage(value: boolean): this;
    setIsGround(value: boolean): this;
    setIsShip(value: boolean): this;
    setProducePerCost(value: number): this;
    setProduceQuantityDoesNotCountAgainstProductionLimits(value: number): this;
    setSharedProduceQuantityDoesNotCountAgainstProductionLimits(value: number): this;
    setSpaceCannon(value: CombatAttrs | undefined): this;
    setSpaceCombat(value: CombatAttrs | undefined): this;
}
