import { Button, Player } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
/**
 * UI:
 * - Outcome name (Text and EditText in a WidgetSwitcher).
 * - Total votes (Text).
 * - Per-player votes (Text).
 * - Riders (Button, show zoomed rider on click).
 */
export declare class AgendaOutcomeUI extends AbstractUI {
    private readonly _agendaState;
    private readonly _outcomeIndex;
    readonly _onOutcomeClicked: (button: Button, player: Player) => void;
    readonly _onEdited: (text: string) => void;
    constructor(agendaState: AgendaState, outcomeIndex: number, scale: number);
}
