import { DrawingLine, GameObject } from "@tabletop-playground/api";
export declare class AnimHighlight {
    static simple(obj: GameObject, msecs: number): Promise<void>;
    static _getOutline(obj: GameObject): DrawingLine;
}
