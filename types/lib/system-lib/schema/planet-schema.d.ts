import { z } from "zod";
export declare const PlanetSchema: z.ZodReadonly<z.ZodObject<{
    name: z.ZodString;
    nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
    localPosition: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>>>;
    localPositionFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>>>;
    radius: z.ZodOptional<z.ZodNumber>;
    influence: z.ZodOptional<z.ZodNumber>;
    resources: z.ZodOptional<z.ZodNumber>;
    techs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
    traits: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
    isLegendary: z.ZodOptional<z.ZodBoolean>;
    legendaryNsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
}, "strict", z.ZodTypeAny, {
    name: string;
    nsidName: string;
    localPosition?: Readonly<{
        x: number;
        y: number;
    }> | undefined;
    localPositionFaceDown?: Readonly<{
        x: number;
        y: number;
    }> | undefined;
    radius?: number | undefined;
    influence?: number | undefined;
    resources?: number | undefined;
    techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
    traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
    isLegendary?: boolean | undefined;
    legendaryNsidName?: string | undefined;
}, {
    name: string;
    nsidName: string;
    localPosition?: {
        x: number;
        y: number;
    } | undefined;
    localPositionFaceDown?: {
        x: number;
        y: number;
    } | undefined;
    radius?: number | undefined;
    influence?: number | undefined;
    resources?: number | undefined;
    techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
    traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
    isLegendary?: boolean | undefined;
    legendaryNsidName?: string | undefined;
}>>;
export type PlanetSchemaType = z.infer<typeof PlanetSchema>;
