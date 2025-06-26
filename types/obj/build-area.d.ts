import { GameObject, UIElement, Zone } from "@tabletop-playground/api";
import { BuildConsume } from "../lib/build-lib/build-consume";
import { BuildProduce } from "../lib/build-lib/build-produce";
export declare class BuildArea {
    private readonly _obj;
    private readonly _zone;
    private readonly _summaryText;
    private readonly _ui;
    private _lastActivatedSystemTileObj;
    private _lastActivatedActionName;
    _onUpdateHandler: () => void;
    constructor(obj: GameObject);
    _addUI(): UIElement;
    _findOrCreateZone(): Zone;
    _getSystemTileHome(): GameObject | undefined;
    _getSystemTileLastActivated(): GameObject | undefined;
    _getProduceAndConsume(): {
        produce: BuildProduce;
        consume: BuildConsume;
    };
    _warpToHome(): void;
    _warpToLastActivated(): void;
    getSummary(): string;
    togglePrivacyMode(): this;
    update(): void;
    report(): void;
}
export declare function delayedCreateBuildArea(obj: GameObject, executionReason: string): void;
