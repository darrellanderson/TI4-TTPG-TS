import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AbstractScpt } from "../../../lib/draft-lib/scpt/abstract-scpt/abstract-scpt";
export declare class ScptDraftsUi extends AbstractUI {
    static getScptDrafts(): Array<AbstractScpt>;
    constructor(scale: number, overrideHeight: number, onDraftStarted: TriggerableMulticastDelegate<() => void>);
}
