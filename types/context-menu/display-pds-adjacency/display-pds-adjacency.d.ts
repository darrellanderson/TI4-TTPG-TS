import { DrawingLine, GameObject, Vector } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare const ADJACENCY_LINE_TAG: string;
export declare const ADJACENCY_ACTION_NAME: string;
/**
 * Display which systems are adjacent to the given PDS, assuming range 1.
 * This is mostly for debugging and verifying hyperlanes.
 */
export declare class DisplayPDSAdjacency implements IGlobal {
    private readonly _onObjectCreatedHandler;
    private readonly _onCustomActionHandler;
    static _getLinePoints(adjacencyNodePath: Array<string>): Array<Vector>;
    static _getLine(adjacencyNodePath: Array<string>): DrawingLine;
    init(): void;
    destroy(): void;
    /**
     * Add context menu to the correct objects.
     *
     * @param obj
     */
    _maybeAddContextMenu(obj: GameObject): void;
    _hasAdjacencyLines(obj: GameObject): boolean;
    _toggleAdjacencyLines(obj: GameObject): void;
    _addAdjacencyLines(obj: GameObject): void;
    _removeAdajecncyLines(obj: GameObject): void;
}
