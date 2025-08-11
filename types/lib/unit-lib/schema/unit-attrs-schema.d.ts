import { z } from "zod";
export declare const UnitSchema: z.ZodReadonly<z.ZodEnum<["carrier", "control-token", "cruiser", "destroyer", "dreadnought", "fighter", "flagship", "galvanize-token", "infantry", "mech", "pds", "space-dock", "war-sun"]>>;
export type UnitType = z.infer<typeof UnitSchema>;
export declare const CombatAttrsSchema: z.ZodReadonly<z.ZodObject<{
    dice: z.ZodOptional<z.ZodNumber>;
    hit: z.ZodNumber;
    extraDice: z.ZodOptional<z.ZodNumber>;
    rerollMisses: z.ZodOptional<z.ZodBoolean>;
    crit: z.ZodOptional<z.ZodNumber>;
    critCount: z.ZodOptional<z.ZodNumber>;
    range: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    hit: number;
    dice?: number | undefined;
    extraDice?: number | undefined;
    rerollMisses?: boolean | undefined;
    crit?: number | undefined;
    critCount?: number | undefined;
    range?: number | undefined;
}, {
    hit: number;
    dice?: number | undefined;
    extraDice?: number | undefined;
    rerollMisses?: boolean | undefined;
    crit?: number | undefined;
    critCount?: number | undefined;
    range?: number | undefined;
}>>;
export type CombatAttrsSchemaType = z.infer<typeof CombatAttrsSchema>;
export declare const UnitAttrsSchema: z.ZodReadonly<z.ZodObject<{
    name: z.ZodString;
    unit: z.ZodReadonly<z.ZodEnum<["carrier", "control-token", "cruiser", "destroyer", "dreadnought", "fighter", "flagship", "galvanize-token", "infantry", "mech", "pds", "space-dock", "war-sun"]>>;
    componentCount: z.ZodOptional<z.ZodNumber>;
    diceColor: z.ZodOptional<z.ZodString>;
    nsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
    overrideNsid: z.ZodOptional<z.ZodString>;
    cost: z.ZodOptional<z.ZodNumber>;
    producePerCost: z.ZodOptional<z.ZodNumber>;
    isShip: z.ZodOptional<z.ZodBoolean>;
    isGround: z.ZodOptional<z.ZodBoolean>;
    hasSustainDamage: z.ZodOptional<z.ZodBoolean>;
    hasPlanetaryShield: z.ZodOptional<z.ZodBoolean>;
    disablePlanetaryShield: z.ZodOptional<z.ZodBoolean>;
    antiFighterBarrage: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
        dice: z.ZodOptional<z.ZodNumber>;
        hit: z.ZodNumber;
        extraDice: z.ZodOptional<z.ZodNumber>;
        rerollMisses: z.ZodOptional<z.ZodBoolean>;
        crit: z.ZodOptional<z.ZodNumber>;
        critCount: z.ZodOptional<z.ZodNumber>;
        range: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }>>>;
    bombardment: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
        dice: z.ZodOptional<z.ZodNumber>;
        hit: z.ZodNumber;
        extraDice: z.ZodOptional<z.ZodNumber>;
        rerollMisses: z.ZodOptional<z.ZodBoolean>;
        crit: z.ZodOptional<z.ZodNumber>;
        critCount: z.ZodOptional<z.ZodNumber>;
        range: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }>>>;
    spaceCannon: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
        dice: z.ZodOptional<z.ZodNumber>;
        hit: z.ZodNumber;
        extraDice: z.ZodOptional<z.ZodNumber>;
        rerollMisses: z.ZodOptional<z.ZodBoolean>;
        crit: z.ZodOptional<z.ZodNumber>;
        critCount: z.ZodOptional<z.ZodNumber>;
        range: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }>>>;
    spaceCombat: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
        dice: z.ZodOptional<z.ZodNumber>;
        hit: z.ZodNumber;
        extraDice: z.ZodOptional<z.ZodNumber>;
        rerollMisses: z.ZodOptional<z.ZodBoolean>;
        crit: z.ZodOptional<z.ZodNumber>;
        critCount: z.ZodOptional<z.ZodNumber>;
        range: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }>>>;
    groundCombat: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
        dice: z.ZodOptional<z.ZodNumber>;
        hit: z.ZodNumber;
        extraDice: z.ZodOptional<z.ZodNumber>;
        rerollMisses: z.ZodOptional<z.ZodBoolean>;
        crit: z.ZodOptional<z.ZodNumber>;
        critCount: z.ZodOptional<z.ZodNumber>;
        range: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }>>>;
    afbDestroyInfantryInSpace: z.ZodOptional<z.ZodNumber>;
    onlyIfFaceDown: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    name: string;
    unit: "carrier" | "control-token" | "cruiser" | "destroyer" | "dreadnought" | "fighter" | "flagship" | "galvanize-token" | "infantry" | "mech" | "pds" | "space-dock" | "war-sun";
    componentCount?: number | undefined;
    diceColor?: string | undefined;
    nsidName?: string | undefined;
    overrideNsid?: string | undefined;
    cost?: number | undefined;
    producePerCost?: number | undefined;
    isShip?: boolean | undefined;
    isGround?: boolean | undefined;
    hasSustainDamage?: boolean | undefined;
    hasPlanetaryShield?: boolean | undefined;
    disablePlanetaryShield?: boolean | undefined;
    antiFighterBarrage?: Readonly<{
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }> | undefined;
    bombardment?: Readonly<{
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }> | undefined;
    spaceCannon?: Readonly<{
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }> | undefined;
    spaceCombat?: Readonly<{
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }> | undefined;
    groundCombat?: Readonly<{
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }> | undefined;
    afbDestroyInfantryInSpace?: number | undefined;
    onlyIfFaceDown?: boolean | undefined;
}, {
    name: string;
    unit: "carrier" | "control-token" | "cruiser" | "destroyer" | "dreadnought" | "fighter" | "flagship" | "galvanize-token" | "infantry" | "mech" | "pds" | "space-dock" | "war-sun";
    componentCount?: number | undefined;
    diceColor?: string | undefined;
    nsidName?: string | undefined;
    overrideNsid?: string | undefined;
    cost?: number | undefined;
    producePerCost?: number | undefined;
    isShip?: boolean | undefined;
    isGround?: boolean | undefined;
    hasSustainDamage?: boolean | undefined;
    hasPlanetaryShield?: boolean | undefined;
    disablePlanetaryShield?: boolean | undefined;
    antiFighterBarrage?: {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    } | undefined;
    bombardment?: {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    } | undefined;
    spaceCannon?: {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    } | undefined;
    spaceCombat?: {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    } | undefined;
    groundCombat?: {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    } | undefined;
    afbDestroyInfantryInSpace?: number | undefined;
    onlyIfFaceDown?: boolean | undefined;
}>>;
export type UnitAttrsSchemaType = z.infer<typeof UnitAttrsSchema>;
