import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
/**
 * [waiting for: ...]
 * [Available votes:] [Available votes]x3 [reset votes]
 * [1. My whens:] [play when] [no whens for now] [never whens] [reset whens]
 * [2. My afters:] [play after] [no afters for now] [never afters] [reset afters]
 * [Voting: choose outcome and set your votes for it below]
 * [...Outcome] [vote summary]+[]
 * [3. My votes:] [# + -] [lock votes] [reset votes]
 */
export declare class AgendaStateUI extends AbstractUI {
    private readonly _agendaState;
    private readonly _switcherUiOutcomeTypeThenMain;
    static _createAgendaCardUI(agendaState: AgendaState, scale: number): AbstractUI;
    static _createWaitingForRow(agendaState: AgendaState, scale: number): AbstractUI;
    static _createAvailableVotesRow(scale: number): AbstractUI;
    static _createWhensRow(agendaState: AgendaState, seatIndex: number, scale: number): AbstractUI;
    static _createAftersRow(agendaState: AgendaState, seatIndex: number, scale: number): AbstractUI;
    /**
     * Votes: [not voting|#] [lock votes]
     *
     * @param agendaState
     * @param seatIndex
     * @param scale
     * @returns
     */
    static _createHowToVoteRow(agendaState: AgendaState, seatIndex: number, scale: number): AbstractUI;
    static _createOutcomeUIs(agendaState: AgendaState, scale: number): AbstractUI;
    static _createTopLeftUI(agendaState: AgendaState, seatIndex: number, scale: number): AbstractUI;
    static _createTopRightUI(agendaState: AgendaState, scale: number): AbstractUI;
    static _createBottomUI(agendaState: AgendaState, scale: number): AbstractUI;
    constructor(agendaState: AgendaState, seatIndex: number, scale: number);
    destroy(): void;
}
