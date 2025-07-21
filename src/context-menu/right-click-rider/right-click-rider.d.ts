import { GameObject, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
import { AgendaState } from "../../lib/agenda-lib/agenda-state/agenda-state";
export declare const ACTION_CLEAR_PREDICT: string;
/**
 * Add "predict {agenda outcome}", "clear agenda outcome" options to riders.
 * Updates when agenda state changes.
 */
export declare class RightClickRider implements IGlobal {
    private readonly _riderObjIds;
    private _agendaState;
    private _outcomeNames;
    private _outcomeNamesJoined;
    static isRider(obj: GameObject): boolean;
    static _getOutcomeNames(agendaState: AgendaState): Array<string>;
    init(): void;
    _maybeAddGameObject(obj: GameObject): void;
    _maybeRemoveGameObject(obj: GameObject): void;
    _onAgendaStateChange(agendaState: AgendaState): void;
    _removeActions(): void;
    _addActions(): void;
    /**
     * Attached to riders, update agenda state with rider->outcome link.
     *
     * @param obj
     * @param player
     * @param identifier
     * @returns
     */
    _onCustomActionHanlder: (obj: GameObject, player: Player, identifier: string) => void;
}
