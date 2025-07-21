import { AbstractUI } from "../../abstract-ui/abtract-ui";
export declare class CombatUIHex extends AbstractUI {
    private readonly _canvas;
    private readonly _onSystemActivatedHandler;
    constructor(scale: number);
    destroy(): void;
    update(): void;
}
