import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
import { z } from "zod";
export declare const ConfigSchema: z.ZodObject<{
    playerCount: z.ZodNumber;
    gamePoints: z.ZodNumber;
    timestamp: z.ZodNumber;
    sources: z.ZodArray<z.ZodString, "many">;
    exportGameData: z.ZodBoolean;
    reportErrors: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    playerCount: number;
    gamePoints: number;
    timestamp: number;
    sources: string[];
    exportGameData: boolean;
    reportErrors: boolean;
}, {
    playerCount: number;
    gamePoints: number;
    timestamp: number;
    sources: string[];
    exportGameData: boolean;
    reportErrors: boolean;
}>;
export type ConfigSchemaType = z.infer<typeof ConfigSchema>;
export declare class Config {
    readonly onConfigChanged: TriggerableMulticastDelegate<(config: Config) => void>;
    private readonly _namespaceId;
    private readonly _config;
    constructor(namespaceId: NamespaceId);
    _save(): void;
    get playerCount(): number;
    get gamePoints(): number;
    get sources(): Array<string>;
    get timestamp(): number;
    get exportGameData(): boolean;
    get reportErrors(): boolean;
    setPlayerCount(playerCount: number): this;
    setGamePoints(gamePoints: number): this;
    setSources(sources: Array<string>): this;
    setTimestamp(timestamp: number): this;
    setExportGameData(exportGameData: boolean): this;
    setReportErrors(reportErrors: boolean): this;
}
