import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
export declare class OpaqueUI extends AbstractUI {
    constructor(opaque: string, draftState: DraftState, scale: number);
}
