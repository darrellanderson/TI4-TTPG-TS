import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class TurnOrderMini extends AbstractUI {
    private readonly _entries;
    private readonly _onTurnOrderChanged;
    constructor(scale: number);
    destroy(): void;
}
