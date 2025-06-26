import { Button } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
/**
 * ONE player's vote entry.
 *
 * #editable [lock]
 */
export declare class AgendaVoteCountUI extends AbstractUI {
    private readonly _agendaState;
    private readonly _seatIndex;
    private readonly _votesTextBox;
    private readonly _lockButton;
    private _delayedApplyVotesHandle;
    readonly _onLockClicked: (button: Button, player: import("@tabletop-playground/api").Player) => void;
    readonly _applyVoteCountToAgendaState: () => void;
    readonly _onVotesChanged: () => void;
    readonly _incr: (button: Button, player: import("@tabletop-playground/api").Player) => void;
    readonly _decr: (button: Button, player: import("@tabletop-playground/api").Player) => void;
    constructor(agendaState: AgendaState, seatIndex: number, scale: number);
    destroy(): void;
}
