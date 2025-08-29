import { z } from "zod";
export declare const TechColorSchema: z.ZodEnum<["blue", "green", "red", "yellow", "unit-upgrade", "none"]>;
export type TechColorType = z.infer<typeof TechColorSchema>;
export declare const TechSchema: z.ZodReadonly<z.ZodObject<{
    nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
    name: z.ZodString;
    abbr: z.ZodOptional<z.ZodString>;
    color: z.ZodEnum<["blue", "green", "red", "yellow", "unit-upgrade", "none"]>;
    prerequisites: z.ZodObject<{
        blue: z.ZodOptional<z.ZodNumber>;
        green: z.ZodOptional<z.ZodNumber>;
        red: z.ZodOptional<z.ZodNumber>;
        yellow: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        blue?: number | undefined;
        green?: number | undefined;
        red?: number | undefined;
        yellow?: number | undefined;
    }, {
        blue?: number | undefined;
        green?: number | undefined;
        red?: number | undefined;
        yellow?: number | undefined;
    }>;
    isFactionTech: z.ZodOptional<z.ZodBoolean>;
    replacesNsidName: z.ZodOptional<z.ZodString>;
    customModel: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    name: string;
    nsidName: string;
    color: "blue" | "green" | "red" | "yellow" | "unit-upgrade" | "none";
    prerequisites: {
        blue?: number | undefined;
        green?: number | undefined;
        red?: number | undefined;
        yellow?: number | undefined;
    };
    abbr?: string | undefined;
    isFactionTech?: boolean | undefined;
    replacesNsidName?: string | undefined;
    customModel?: boolean | undefined;
}, {
    name: string;
    nsidName: string;
    color: "blue" | "green" | "red" | "yellow" | "unit-upgrade" | "none";
    prerequisites: {
        blue?: number | undefined;
        green?: number | undefined;
        red?: number | undefined;
        yellow?: number | undefined;
    };
    abbr?: string | undefined;
    isFactionTech?: boolean | undefined;
    replacesNsidName?: string | undefined;
    customModel?: boolean | undefined;
}>>;
export type TechSchemaType = z.infer<typeof TechSchema>;
