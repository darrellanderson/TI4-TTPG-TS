import { HomebrewModuleType } from "./homebrew-schema";
/**
 * Homebrew modules register via this class.
 */
export declare class HomebrewRegistry {
    load(params: HomebrewModuleType): void;
}
