import { DraftActivityStartParams } from "../../draft-activity-start/draft-activity-start-params";
import { ScptDraftParams } from "./scpt-draft-params";
export declare abstract class AbstractScpt {
    abstract getLabel(): string;
    abstract getQual(): DraftActivityStartParams | undefined;
    abstract getPrelim(): DraftActivityStartParams | undefined;
    abstract getSemi(): DraftActivityStartParams | undefined;
    abstract getFinal(): DraftActivityStartParams | undefined;
    getPlayerCount(): number;
    getScptDraftParams(): ScptDraftParams;
}
