import { Button, Player } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { ScptDraftParams } from "../../../lib/draft-lib/scpt/abstract-scpt/scpt-draft-params";
/**
 * "YEAR" qual / prelim / semi / final.
 *
 * SCPT draft goes right to the draft.
 */
export declare class ScptDraftButtonUI extends AbstractUI {
    private readonly _scptDraftParams;
    private readonly _onDraftStarted;
    _qualHandler: (_button: Button, _player: Player) => void;
    _prelimHandler: (_button: Button, _player: Player) => void;
    _semiHandler: (_button: Button, _player: Player) => void;
    _finalHandler: (_button: Button, _player: Player) => void;
    constructor(scale: number, scptDraftParams: ScptDraftParams, onDraftStarted: TriggerableMulticastDelegate<() => void>);
}
