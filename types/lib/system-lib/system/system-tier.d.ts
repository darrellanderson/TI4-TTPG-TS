import { System } from "../system/system";
export type SystemTierType = "red" | "high" | "med" | "low" | "other";
export declare class SystemTier {
    getTier(system: System): SystemTierType;
}
