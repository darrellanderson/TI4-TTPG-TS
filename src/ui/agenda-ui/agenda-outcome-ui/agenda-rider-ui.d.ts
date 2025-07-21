import { Widget } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AgendaRiderSchemaType, AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
export declare class AgendaRiderUI extends AbstractUI {
    static _createRiderButton(rider: AgendaRiderSchemaType, scale: number): Widget | undefined;
    constructor(agendaState: AgendaState, outcomeIndex: number, scale: number);
}
