import { IGlobal } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import { Faction } from "../../faction-lib/faction/faction";
import { GenerateSlicesParams, SliceTiles } from "../generate-slices/generate-slices";
import { DraftActivityStartParams } from "./draft-activity-start-params";
export declare class DraftActivityMaybeResume implements IGlobal {
    init(): void;
}
/**
 * Start (or resume) a draft activity.
 * Load draft information from a config string, or generate it.
 * Create UI.
 */
export declare class DraftActivityStart {
    private _draftState;
    static getOrGenerateSlices(config: string, numSlices: number, generateSlicesParams: GenerateSlicesParams, blacklistSystemTileNumbers: Array<number>, errors: Array<string>): Array<SliceTiles>;
    static getSliceLabels(config: string): Array<string> | undefined;
    static getOrGenerateFactions(config: string, numFactions: number, errors: Array<string>): Array<Faction>;
    static getBaseMap(config: string, errors: Array<string>): string | undefined;
    getDraftState(): DraftState | undefined;
    start(params: DraftActivityStartParams, errors: Array<string>): boolean;
    resume(): this;
    _resume(): this;
    destroy(): void;
}
