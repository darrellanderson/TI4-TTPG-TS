import { z } from "zod";
export declare const SystemAttachmentSchema: z.ZodReadonly<z.ZodObject<{
    name: z.ZodString;
    nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
    imgFaceDown: z.ZodOptional<z.ZodBoolean>;
    doNotAttach: z.ZodOptional<z.ZodBoolean>;
    anomalies: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["asteroid-field", "gravity-rift", "nebula", "scar", "supernova"]>>, "many">>;
    wormholes: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
    wormholesFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
    isDestroyWormhole: z.ZodOptional<z.ZodBoolean>;
    planets: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
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
        isSpaceStation: z.ZodOptional<z.ZodBoolean>;
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
        isSpaceStation?: boolean | undefined;
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
        isSpaceStation?: boolean | undefined;
        legendaryNsidName?: string | undefined;
    }>>, "many">>;
    customModel: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    name: string;
    nsidName: string;
    imgFaceDown?: boolean | undefined;
    doNotAttach?: boolean | undefined;
    anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
    wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
    wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
    isDestroyWormhole?: boolean | undefined;
    planets?: Readonly<{
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
        isSpaceStation?: boolean | undefined;
        legendaryNsidName?: string | undefined;
    }>[] | undefined;
    customModel?: boolean | undefined;
}, {
    name: string;
    nsidName: string;
    imgFaceDown?: boolean | undefined;
    doNotAttach?: boolean | undefined;
    anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "scar" | "supernova")[] | undefined;
    wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
    wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
    isDestroyWormhole?: boolean | undefined;
    planets?: {
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
        isSpaceStation?: boolean | undefined;
        legendaryNsidName?: string | undefined;
    }[] | undefined;
    customModel?: boolean | undefined;
}>>;
export type SystemAttachmentSchemaType = z.infer<typeof SystemAttachmentSchema>;
