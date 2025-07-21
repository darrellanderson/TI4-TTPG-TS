import { GameObject } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
/**
 * Adds a custom action to strategy cards, and triggers an event when played.
 */
export declare class OnStrategyCardPlayed implements IGlobal {
    static readonly ACTION_NAME: string;
    private readonly _onCustomAction;
    init(): void;
    _maybeAdd(obj: GameObject): void;
}
