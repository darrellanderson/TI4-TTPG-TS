import { GameObject } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare const ACTION_DELETE: string;
/**
 * Disable the default delete (delete key), replace with a context menu item.
 */
export declare class RightClickDelete implements IGlobal {
    private readonly _onCustomAction;
    init(): void;
    _addRightClickDelete(obj: GameObject): void;
}
