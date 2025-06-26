import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import { DraftActivityStartParams } from "../../draft-activity-start/draft-activity-start-params";
export declare class Scpt2023 extends AbstractScpt {
    getLabel(): string;
    getQual(): DraftActivityStartParams | undefined;
    getPrelim(): DraftActivityStartParams | undefined;
    getSemi(): DraftActivityStartParams | undefined;
    getFinal(): DraftActivityStartParams | undefined;
}
