import { CreateAbstractUIType } from "../../abstract-window/abstract-window";
export declare class DraftStartWindow {
    private _window;
    readonly _onDraftStartedHandler: () => void;
    private readonly _draftActivityStartParams;
    readonly _createAbstractUI: CreateAbstractUIType;
    constructor();
    createAndAttachWindow(playerSlot: number): void;
}
