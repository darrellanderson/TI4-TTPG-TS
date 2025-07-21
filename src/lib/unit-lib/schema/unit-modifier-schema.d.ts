import { CombatRoll } from "../../combat-lib/combat-roll/combat-roll";
import { z } from "zod";
export declare const UnitModifierCardClass: z.ZodReadonly<z.ZodEnum<["action", "agenda", "agent", "alliance", "commander", "faction-ability", "hero", "legendary", "mech", "promissory", "relic", "technology.blue", "technology.green", "technology.red", "technology.yellow", "technology.unit-upgrade", "unit"]>>;
export type UnitModifierCardClassType = z.infer<typeof UnitModifierCardClass>;
export declare const UnitModifierTrigger: z.ZodReadonly<z.ZodObject<{
    cardClass: z.ZodReadonly<z.ZodEnum<["action", "agenda", "agent", "alliance", "commander", "faction-ability", "hero", "legendary", "mech", "promissory", "relic", "technology.blue", "technology.green", "technology.red", "technology.yellow", "technology.unit-upgrade", "unit"]>>;
    nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
    overrideSource: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
}, "strict", z.ZodTypeAny, {
    nsidName: string;
    cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
    overrideSource?: string | undefined;
}, {
    nsidName: string;
    cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
    overrideSource?: string | undefined;
}>>;
export type UnitModifierTriggerType = z.infer<typeof UnitModifierTrigger>;
export declare const UnitModifierOwner: z.ZodReadonly<z.ZodEnum<["self", "opponent", "any"]>>;
export type UnitModifierOwnerType = z.infer<typeof UnitModifierOwner>;
export declare const UnitModifierPriority: z.ZodReadonly<z.ZodEnum<["mutate", "mutate-late", "adjust", "choose"]>>;
export type UnitModifierPriorityType = z.infer<typeof UnitModifierPriority>;
export declare const UnitModifierSchema: z.ZodReadonly<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    triggerAlways: z.ZodOptional<z.ZodBoolean>;
    triggers: z.ZodArray<z.ZodReadonly<z.ZodObject<{
        cardClass: z.ZodReadonly<z.ZodEnum<["action", "agenda", "agent", "alliance", "commander", "faction-ability", "hero", "legendary", "mech", "promissory", "relic", "technology.blue", "technology.green", "technology.red", "technology.yellow", "technology.unit-upgrade", "unit"]>>;
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        overrideSource: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
    }, "strict", z.ZodTypeAny, {
        nsidName: string;
        cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
        overrideSource?: string | undefined;
    }, {
        nsidName: string;
        cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
        overrideSource?: string | undefined;
    }>>, "many">;
    isActiveIdle: z.ZodOptional<z.ZodBoolean>;
    owner: z.ZodReadonly<z.ZodEnum<["self", "opponent", "any"]>>;
    priority: z.ZodReadonly<z.ZodEnum<["mutate", "mutate-late", "adjust", "choose"]>>;
    applies: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodBoolean>;
    apply: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodVoid>;
}, "strict", z.ZodTypeAny, {
    name: string;
    description: string;
    triggers: Readonly<{
        nsidName: string;
        cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
        overrideSource?: string | undefined;
    }>[];
    owner: "self" | "opponent" | "any";
    priority: "mutate" | "mutate-late" | "adjust" | "choose";
    applies: (args_0: any, ...args: unknown[]) => boolean;
    apply: (args_0: any, ...args: unknown[]) => void;
    triggerAlways?: boolean | undefined;
    isActiveIdle?: boolean | undefined;
}, {
    name: string;
    description: string;
    triggers: Readonly<{
        nsidName: string;
        cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
        overrideSource?: string | undefined;
    }>[];
    owner: "self" | "opponent" | "any";
    priority: "mutate" | "mutate-late" | "adjust" | "choose";
    applies: (args_0: any, ...args: unknown[]) => boolean;
    apply: (args_0: any, ...args: unknown[]) => void;
    triggerAlways?: boolean | undefined;
    isActiveIdle?: boolean | undefined;
}>>;
export type UnitModifierSchemaType = Omit<z.infer<typeof UnitModifierSchema>, "apply" | "applies"> & {
    applies: (combatRoll: CombatRoll) => boolean;
    apply: (combatRoll: CombatRoll) => void;
};
