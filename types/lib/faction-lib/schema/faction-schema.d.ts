import { z } from "zod";
export declare const FactionSchema: z.ZodReadonly<z.ZodObject<{
    nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
    name: z.ZodString;
    abbr: z.ZodString;
    abilities: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
    commodities: z.ZodNumber;
    factionTechs: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
    home: z.ZodNumber;
    homeSurrogate: z.ZodOptional<z.ZodNumber>;
    leaders: z.ZodReadonly<z.ZodObject<{
        agents: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        commanders: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        heroes: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        mechs: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
    }, "strict", z.ZodTypeAny, {
        agents: string[];
        commanders: string[];
        heroes: string[];
        mechs: string[];
    }, {
        agents: string[];
        commanders: string[];
        heroes: string[];
        mechs: string[];
    }>>;
    promissories: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
    startingTechs: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
    startingUnits: z.ZodReadonly<z.ZodObject<{
        carrier: z.ZodOptional<z.ZodNumber>;
        cruiser: z.ZodOptional<z.ZodNumber>;
        destroyer: z.ZodOptional<z.ZodNumber>;
        dreadnought: z.ZodOptional<z.ZodNumber>;
        fighter: z.ZodOptional<z.ZodNumber>;
        flagship: z.ZodOptional<z.ZodNumber>;
        infantry: z.ZodOptional<z.ZodNumber>;
        mech: z.ZodOptional<z.ZodNumber>;
        pds: z.ZodOptional<z.ZodNumber>;
        spaceDock: z.ZodOptional<z.ZodNumber>;
        warSun: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        carrier?: number | undefined;
        cruiser?: number | undefined;
        destroyer?: number | undefined;
        dreadnought?: number | undefined;
        fighter?: number | undefined;
        flagship?: number | undefined;
        infantry?: number | undefined;
        mech?: number | undefined;
        pds?: number | undefined;
        spaceDock?: number | undefined;
        warSun?: number | undefined;
    }, {
        carrier?: number | undefined;
        cruiser?: number | undefined;
        destroyer?: number | undefined;
        dreadnought?: number | undefined;
        fighter?: number | undefined;
        flagship?: number | undefined;
        infantry?: number | undefined;
        mech?: number | undefined;
        pds?: number | undefined;
        spaceDock?: number | undefined;
        warSun?: number | undefined;
    }>>;
    unitOverrides: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
    extras: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
        nsid: z.ZodString;
        count: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        nsid: string;
        count?: number | undefined;
    }, {
        nsid: string;
        count?: number | undefined;
    }>>, "many">>;
}, "strict", z.ZodTypeAny, {
    name: string;
    nsidName: string;
    abbr: string;
    abilities: string[];
    commodities: number;
    factionTechs: string[];
    home: number;
    leaders: Readonly<{
        agents: string[];
        commanders: string[];
        heroes: string[];
        mechs: string[];
    }>;
    promissories: string[];
    startingTechs: string[];
    startingUnits: Readonly<{
        carrier?: number | undefined;
        cruiser?: number | undefined;
        destroyer?: number | undefined;
        dreadnought?: number | undefined;
        fighter?: number | undefined;
        flagship?: number | undefined;
        infantry?: number | undefined;
        mech?: number | undefined;
        pds?: number | undefined;
        spaceDock?: number | undefined;
        warSun?: number | undefined;
    }>;
    unitOverrides: string[];
    homeSurrogate?: number | undefined;
    extras?: Readonly<{
        nsid: string;
        count?: number | undefined;
    }>[] | undefined;
}, {
    name: string;
    nsidName: string;
    abbr: string;
    abilities: string[];
    commodities: number;
    factionTechs: string[];
    home: number;
    leaders: Readonly<{
        agents: string[];
        commanders: string[];
        heroes: string[];
        mechs: string[];
    }>;
    promissories: string[];
    startingTechs: string[];
    startingUnits: Readonly<{
        carrier?: number | undefined;
        cruiser?: number | undefined;
        destroyer?: number | undefined;
        dreadnought?: number | undefined;
        fighter?: number | undefined;
        flagship?: number | undefined;
        infantry?: number | undefined;
        mech?: number | undefined;
        pds?: number | undefined;
        spaceDock?: number | undefined;
        warSun?: number | undefined;
    }>;
    unitOverrides: string[];
    homeSurrogate?: number | undefined;
    extras?: Readonly<{
        nsid: string;
        count?: number | undefined;
    }>[] | undefined;
}>>;
export type FactionSchemaType = z.infer<typeof FactionSchema>;
