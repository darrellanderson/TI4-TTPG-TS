"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayPDSAdjacency = exports.ADJACENCY_ACTION_NAME = exports.ADJACENCY_LINE_TAG = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const system_adjacency_1 = require("../../lib/system-lib/system-adjacency/system-adjacency");
exports.ADJACENCY_LINE_TAG = "__adj__";
exports.ADJACENCY_ACTION_NAME = "*Toggle display adjacency";
const ADJACENCY_ACTION_TOOLTIP = "Display adjacent systems: neighbors, wormholes, hyperlanes, etc";
/**
 * Display which systems are adjacent to the given PDS, assuming range 1.
 * This is mostly for debugging and verifying hyperlanes.
 */
class DisplayPDSAdjacency {
    constructor() {
        this._onObjectCreatedHandler = (obj) => {
            this._maybeAddContextMenu(obj);
        };
        this._onCustomActionHandler = (obj, _player, identifier) => {
            if (identifier === exports.ADJACENCY_ACTION_NAME) {
                this._toggleAdjacencyLines(obj);
            }
        };
    }
    static _getLinePoints(adjacencyNodePath) {
        // Path includes start and end as well as middle (if any).
        return adjacencyNodePath.map((node) => {
            return system_adjacency_1.SystemAdjacency.adjNodeToPositionOrThrow(node);
        });
    }
    static _getLine(adjacencyNodePath) {
        const line = new api_1.DrawingLine();
        line.color = new api_1.Color(1, 0, 0, 1);
        line.normals = [new api_1.Vector(0, 0, 1)];
        line.tag = exports.ADJACENCY_LINE_TAG;
        line.thickness = 0.5;
        // World positions!
        line.points = DisplayPDSAdjacency._getLinePoints(adjacencyNodePath);
        return line;
    }
    init() {
        api_1.globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
        for (const obj of api_1.world.getAllObjects()) {
            this._maybeAddContextMenu(obj);
        }
    }
    destroy() {
        api_1.globalEvents.onObjectCreated.remove(this._onObjectCreatedHandler);
    }
    /**
     * Add context menu to the correct objects.
     *
     * @param obj
     */
    _maybeAddContextMenu(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid.startsWith("unit:base/pds")) {
            obj.addCustomAction(exports.ADJACENCY_ACTION_NAME, ADJACENCY_ACTION_TOOLTIP);
            obj.onCustomAction.add(this._onCustomActionHandler);
        }
    }
    _hasAdjacencyLines(obj) {
        for (const line of obj.getDrawingLines()) {
            if (line.tag === exports.ADJACENCY_LINE_TAG) {
                return true;
            }
        }
        return false;
    }
    _toggleAdjacencyLines(obj) {
        if (this._hasAdjacencyLines(obj)) {
            this._removeAdajecncyLines(obj);
        }
        else {
            this._addAdjacencyLines(obj);
        }
    }
    _addAdjacencyLines(obj) {
        const pos = obj.getPosition();
        const hex = TI4.hex.fromPosition(pos);
        const faction = undefined;
        const adjacencyResults = new system_adjacency_1.SystemAdjacency()
            .getAdjacencyPaths(hex, faction)
            .filter((adjacencyResult) => {
            return adjacencyResult.distance === 1;
        });
        adjacencyResults.forEach((adjacencyPathType) => {
            const line = DisplayPDSAdjacency._getLine(system_adjacency_1.SystemAdjacency.simplifyPath(adjacencyPathType));
            // Convert to local positions.
            line.points = line.points.map((point) => {
                const localPos = obj.worldPositionToLocal(point);
                localPos.z = 0; // same plane as the PDS.
                return localPos;
            });
            obj.addDrawingLine(line);
        });
    }
    _removeAdajecncyLines(obj) {
        for (const line of obj.getDrawingLines()) {
            if (line.tag === exports.ADJACENCY_LINE_TAG) {
                obj.removeDrawingLineObject(line);
            }
        }
    }
}
exports.DisplayPDSAdjacency = DisplayPDSAdjacency;
//# sourceMappingURL=display-pds-adjacency.js.map