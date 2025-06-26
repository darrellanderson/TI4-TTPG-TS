import { Card } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare class AgendaActivityMaybeResume implements IGlobal {
    init(): void;
}
export declare class AgendaActivityStart {
    private _agendaState;
    private _agendaWindow;
    private readonly _onAgendaStateChangedHandler;
    start(agendaCard: Card): boolean;
    resume(): this;
    destroy(): void;
}
