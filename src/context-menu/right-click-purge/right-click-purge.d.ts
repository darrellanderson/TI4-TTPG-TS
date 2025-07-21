import { GameObject } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare const PURGE_ACTION_NAME: string;
export declare class RightClickPurge implements IGlobal {
    private readonly _find;
    private readonly _onObjectCreatedHandler;
    private readonly _onCardMadeSingletonHandler;
    private readonly _onCardMakeDeckHandler;
    private readonly _onCustomActionHandler;
    static _isPurgeable(obj: GameObject): boolean;
    init(): void;
    _maybeAddPurge(obj: GameObject): void;
    _purge(obj: GameObject, playerSlot: number): void;
}
