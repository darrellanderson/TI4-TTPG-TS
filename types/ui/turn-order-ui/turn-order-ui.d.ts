import { TurnOrderWidgetParams } from "ttpg-darrell";
export declare class TurnOrderUI {
    private readonly _params;
    private _onPlayerChangedColorHandler;
    private _turnOrderWidget;
    constructor();
    getParams(): TurnOrderWidgetParams;
    setPlayerCount(playerCount: number): this;
    attachToScreen(): this;
    destroy(): void;
}
