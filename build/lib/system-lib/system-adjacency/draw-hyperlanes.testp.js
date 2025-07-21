"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawHyperlanes = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const system_adjacency_1 = require("./system-adjacency");
const system_adjacency_hyperlane_1 = require("./system-adjacency-hyperlane");
const display_pds_adjacency_1 = require("../../../context-menu/display-pds-adjacency/display-pds-adjacency");
/**
 * Draw hyperlane links, for verification and debugging.
 */
class DrawHyperlanes {
    constructor() {
        this._onObjectCreatedHandler = (obj) => {
            this._maybeProcessObject(obj);
        };
        this._onMovementStoppedHandler = (obj) => {
            this._update(obj);
        };
    }
    init() {
        api_1.globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
        for (const obj of api_1.world.getAllObjects()) {
            this._maybeProcessObject(obj);
        }
    }
    _maybeProcessObject(obj) {
        const system = TI4.systemRegistry.getBySystemTileObjId(obj.getId());
        if (system && system.isHyperlane()) {
            obj.onMovementStopped.remove(this._onMovementStoppedHandler);
            obj.onMovementStopped.add(this._onMovementStoppedHandler);
            this._update(obj);
        }
    }
    _update(obj) {
        console.log("DrawHyperlanes._update", obj.getId());
        api_1.world.showPing(obj.getPosition(), [1, 0, 0, 1], false);
        obj.getDrawingLines().forEach((line) => {
            if (line.tag === display_pds_adjacency_1.ADJACENCY_LINE_TAG) {
                obj.removeDrawingLineObject(line);
            }
        });
        const extent = obj.getExtent(false, false);
        const pos = obj.getPosition();
        const hex = TI4.hex.fromPosition(pos);
        const system = TI4.systemRegistry.getBySystemTileObjId(obj.getId());
        const hexToSystem = new Map();
        if (system) {
            hexToSystem.set(hex, system);
        }
        const adjacency = new ttpg_darrell_1.Adjacency();
        new system_adjacency_hyperlane_1.SystemAdjacencyHyperlane().addTags(hexToSystem, adjacency);
        // Get the directed edge going in to the system, use as the
        // starting points for paths (may start with a transit link).
        //
        // That said, paths cannot END with a transit link.  Add a bogus
        // non-transit link to each outgoing directed edge and strip off later.
        const bogusNode = "<bogus>";
        const edgesIn = [];
        ttpg_darrell_1.Hex.neighbors(hex).forEach((neighbor) => {
            const edgeIn = [neighbor, hex].join("|");
            edgesIn.push(edgeIn);
            const edgeOut = [hex, neighbor].join("|");
            adjacency.addLink({
                src: edgeOut,
                dst: bogusNode + "-" + neighbor, // unique to prevent revisiting the same final node
                distance: 0.5,
                isTransit: false,
            });
        });
        // Get paths from each edge separately (using a shared incoming hub leads
        // to path collisions clipping the paths for re-visiting the same edge).
        // We want this to visually verify each direction of each hyperlane.
        const paths = [];
        for (const edgeIn of edgesIn) {
            const edgePaths = adjacency.get(edgeIn, 100);
            paths.push(...edgePaths);
        }
        const simplePaths = paths.map((path) => {
            const simplePath = system_adjacency_1.SystemAdjacency.simplifyPath(path);
            const last = simplePath.pop();
            if (!(last === null || last === void 0 ? void 0 : last.startsWith(bogusNode))) {
                throw new Error("Unexpected path");
            }
            return simplePath;
        });
        console.log("paths", obj.getId(), paths.length);
        console.log("simplePaths", "\n" + simplePaths.join("\n"));
        const isFaceUp = ttpg_darrell_1.Facing.isFaceUp(obj);
        for (const simplePath of simplePaths) {
            const line = display_pds_adjacency_1.DisplayPDSAdjacency._getLine(simplePath);
            // Convert to local positions.
            line.points = line.points.map((point) => {
                const localPos = obj.worldPositionToLocal(point);
                const z = (isFaceUp ? 1 : -1) * (extent.z + 0.05);
                localPos.z = z;
                return localPos;
            });
            if (!isFaceUp) {
                line.normals = [new api_1.Vector(0, 0, -1)];
            }
            obj.addDrawingLine(line);
        }
    }
}
exports.DrawHyperlanes = DrawHyperlanes;
new DrawHyperlanes().init();
//# sourceMappingURL=draw-hyperlanes.testp.js.map