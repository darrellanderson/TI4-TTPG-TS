import { DrawingLine, GameObject, Vector } from "@tabletop-playground/api";
/**
 * Add a glowing effect to a token.
 * Emission mask is fixed in the template, but we can add glowing lines.
 */
export declare class GlowingToken {
    private readonly _obj;
    private readonly _lineWidth;
    private readonly _color;
    constructor(token: GameObject);
    _getPoints(): Array<Vector>;
    /**
     * Get a DrawingLine with points in local object space.
     *
     * @returns
     */
    _getDrawingLine(): DrawingLine;
}
