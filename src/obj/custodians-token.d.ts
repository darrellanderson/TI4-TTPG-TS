import { GameObject } from "@tabletop-playground/api";
export declare class CustodiansToken {
    private readonly _obj;
    private readonly _find;
    private readonly _actionName;
    private readonly _customActionHandler;
    constructor(obj: GameObject);
    score(playerSlot: number): void;
}
export declare function createFromObject(obj: GameObject, executionReason: string): void;
