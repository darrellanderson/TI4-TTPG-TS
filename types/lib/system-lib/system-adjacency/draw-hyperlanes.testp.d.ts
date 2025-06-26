import { GameObject } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
/**
 * Draw hyperlane links, for verification and debugging.
 */
export declare class DrawHyperlanes implements IGlobal {
    private readonly _onObjectCreatedHandler;
    private readonly _onMovementStoppedHandler;
    init(): void;
    _maybeProcessObject(obj: GameObject): void;
    _update(obj: GameObject): void;
}
