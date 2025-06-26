import { Button, CheckBox, MultilineTextBox, Player, Slider } from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { DraftActivityStartParams } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
export declare class DraftStartUI extends AbstractUI {
    readonly onDraftStarted: TriggerableMulticastDelegate<() => void>;
    private readonly _idrafts;
    private readonly _params;
    private readonly _draftCheckBoxes;
    readonly _onDraftCheckStateChangedHandler: (checkBox: CheckBox, player: Player | undefined, _checked: boolean) => void;
    readonly _onSliceCountChanged: (_slider: Slider, _player: Player, value: number) => void;
    readonly _onFactionCountChanged: (_slider: Slider, _player: Player, value: number) => void;
    readonly _onTextCommitted: (_textBox: MultilineTextBox, _player: Player, text: string) => void;
    readonly _onStartButtonClicked: (button: Button, player: Player) => void;
    constructor(scale: number, params: DraftActivityStartParams);
    startDraft(): void;
}
