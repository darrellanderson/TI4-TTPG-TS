import { Card, GameObject } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare class UnitModifierActiveIdle implements IGlobal {
    private static readonly ACTIVE_KEY;
    static isActive(obj: GameObject): boolean;
    static setActive(obj: GameObject, active: boolean): void;
    init(): void;
    _maybeAddActiveIdleButton(card: Card): void;
    _maybeRemoveActiveIdleButton(deck: Card, oldNsid: string): void;
}
