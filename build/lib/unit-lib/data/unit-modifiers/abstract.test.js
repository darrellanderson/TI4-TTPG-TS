"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANY_POS = exports.OPPONENT_POS = exports.SELF_POS = exports.OPPONENT = exports.SELF = void 0;
exports.placeGameObjects = placeGameObjects;
/**
 * Utility functions to simplify unit modifier tests.
 * Use the ".test.ts" naming to prevent including in the mod build.
 */
const api_1 = require("@tabletop-playground/api");
const ttpg_mock_1 = require("ttpg-mock");
const ttpg_darrell_1 = require("ttpg-darrell");
const unit_modifier_active_idle_1 = require("../../unit-modifier/unit-modifier-active-idle");
exports.SELF = 1;
exports.OPPONENT = 2;
exports.SELF_POS = new api_1.Vector(100, 0, 0);
exports.OPPONENT_POS = new api_1.Vector(-100, 0, 0);
exports.ANY_POS = new api_1.Vector(200, 0, 0);
function placeGameObjects(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    // Map positions.
    const hexPos = TI4.hex.toPosition("<0,0,0>");
    const adjHexPos = TI4.hex.toPosition("<1,0,-1>");
    const hexPosOffPlanet = api_1.Vector.lerp(hexPos, adjHexPos, 0.45);
    // Create tile (at origin) and adjacent tile (2).
    const systemNsid = (_a = params.systemNsid) !== null && _a !== void 0 ? _a : "tile.system:base/1";
    ttpg_mock_1.MockGameObject.simple(systemNsid);
    ttpg_mock_1.MockGameObject.simple("tile.system:base/2", { position: adjHexPos });
    // Upgrades and modifiers get assigned to the closest card holder owner.
    new ttpg_mock_1.MockCardHolder({
        owningPlayerSlot: exports.SELF,
        position: exports.SELF_POS,
    });
    new ttpg_mock_1.MockCardHolder({
        owningPlayerSlot: exports.OPPONENT,
        position: exports.OPPONENT_POS,
    });
    // Create nsid objects.
    for (const nsid of (_b = params.self) !== null && _b !== void 0 ? _b : []) {
        if (nsid.startsWith("card.")) {
            ttpg_mock_1.MockCard.simple(nsid, { position: exports.SELF_POS });
        }
        else {
            ttpg_mock_1.MockGameObject.simple(nsid, { position: exports.SELF_POS });
        }
    }
    for (const nsid of (_c = params.selfActive) !== null && _c !== void 0 ? _c : []) {
        let obj;
        if (nsid.startsWith("card.")) {
            obj = ttpg_mock_1.MockCard.simple(nsid, { position: exports.SELF_POS });
        }
        else {
            obj = ttpg_mock_1.MockGameObject.simple(nsid, { position: exports.SELF_POS });
        }
        unit_modifier_active_idle_1.UnitModifierActiveIdle.setActive(obj, true);
    }
    for (const nsid of (_d = params.opponent) !== null && _d !== void 0 ? _d : []) {
        if (nsid.startsWith("card.")) {
            ttpg_mock_1.MockCard.simple(nsid, { position: exports.OPPONENT_POS });
        }
        else {
            ttpg_mock_1.MockGameObject.simple(nsid, { position: exports.OPPONENT_POS });
        }
    }
    for (const nsid of (_e = params.any) !== null && _e !== void 0 ? _e : []) {
        if (nsid.startsWith("card.")) {
            ttpg_mock_1.MockCard.simple(nsid, { position: exports.ANY_POS });
        }
        else {
            ttpg_mock_1.MockGameObject.simple(nsid, { position: exports.ANY_POS });
        }
    }
    // Create unit objects.
    for (const [unit, count] of (_f = params.selfUnits) !== null && _f !== void 0 ? _f : []) {
        const source = unit === "mech" ? "pok" : "base";
        for (let i = 0; i < count; i++) {
            ttpg_mock_1.MockGameObject.simple(`unit:${source}/${unit}`, {
                owningPlayerSlot: exports.SELF,
                position: hexPos,
            });
        }
    }
    for (const [unit, count] of (_g = params.selfUnitsOffPlanet) !== null && _g !== void 0 ? _g : []) {
        const source = unit === "mech" ? "pok" : "base";
        for (let i = 0; i < count; i++) {
            ttpg_mock_1.MockGameObject.simple(`unit:${source}/${unit}`, {
                owningPlayerSlot: exports.SELF,
                position: hexPosOffPlanet,
            });
        }
    }
    for (const [unit, count] of (_h = params.opponentUnits) !== null && _h !== void 0 ? _h : []) {
        const source = unit === "mech" ? "pok" : "base";
        for (let i = 0; i < count; i++) {
            ttpg_mock_1.MockGameObject.simple(`unit:${source}/${unit}`, {
                owningPlayerSlot: exports.OPPONENT,
                position: hexPos,
            });
        }
    }
    for (const [unit, count] of (_j = params.opponentUnitsOffPlanet) !== null && _j !== void 0 ? _j : []) {
        const source = unit === "mech" ? "pok" : "base";
        for (let i = 0; i < count; i++) {
            ttpg_mock_1.MockGameObject.simple(`unit:${source}/${unit}`, {
                owningPlayerSlot: exports.OPPONENT,
                position: hexPosOffPlanet,
            });
        }
    }
    for (const [unit, count] of (_k = params.selfUnitsAdj) !== null && _k !== void 0 ? _k : []) {
        const source = unit === "mech" ? "pok" : "base";
        for (let i = 0; i < count; i++) {
            ttpg_mock_1.MockGameObject.simple(`unit:${source}/${unit}`, {
                owningPlayerSlot: exports.SELF,
                position: adjHexPos,
            });
        }
    }
    for (const [unit, count] of (_l = params.opponentUnitsAdj) !== null && _l !== void 0 ? _l : []) {
        const source = unit === "mech" ? "pok" : "base";
        for (let i = 0; i < count; i++) {
            ttpg_mock_1.MockGameObject.simple(`unit:${source}/${unit}`, {
                owningPlayerSlot: exports.OPPONENT,
                position: adjHexPos,
            });
        }
    }
}
it("placeGameObjects (empty)", () => {
    placeGameObjects({});
});
it("placeGameObjects (all)", () => {
    placeGameObjects({
        systemNsid: "tile.system:base/3",
        self: ["card.action:base/direct-hit"],
        selfUnits: new Map([
            ["carrier", 1],
            ["fighter", 1],
        ]),
        selfUnitsOffPlanet: new Map([["mech", 1]]),
        selfUnitsAdj: new Map([["destroyer", 1]]),
        opponent: ["card.action:base/sabotage"],
        opponentUnits: new Map([["dreadnought", 1]]),
        opponentUnitsOffPlanet: new Map([["infantry", 1]]),
        opponentUnitsAdj: new Map([["cruiser", 1]]),
    });
    const find = new ttpg_darrell_1.Find();
    let obj;
    obj = find.findGameObject("tile.system:base/3");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
    obj = find.findGameObject("card.action:base/direct-hit");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=100,Y=0,Z=0)");
    obj = find.findGameObject("unit:base/carrier");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
    expect(obj === null || obj === void 0 ? void 0 : obj.getOwningPlayerSlot()).toEqual(exports.SELF);
    obj = find.findGameObject("unit:base/fighter");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
    expect(obj === null || obj === void 0 ? void 0 : obj.getOwningPlayerSlot()).toEqual(exports.SELF);
    obj = find.findGameObject("unit:pok/mech");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=6.754,Y=0,Z=0)");
    expect(obj === null || obj === void 0 ? void 0 : obj.getOwningPlayerSlot()).toEqual(exports.SELF);
    obj = find.findGameObject("unit:base/destroyer");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=15.01,Y=0,Z=0)");
    expect(obj === null || obj === void 0 ? void 0 : obj.getOwningPlayerSlot()).toEqual(exports.SELF);
    obj = find.findGameObject("card.action:base/sabotage");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=-100,Y=0,Z=0)");
    obj = find.findGameObject("unit:base/dreadnought");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
    expect(obj === null || obj === void 0 ? void 0 : obj.getOwningPlayerSlot()).toEqual(exports.OPPONENT);
    obj = find.findGameObject("unit:base/infantry");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=6.754,Y=0,Z=0)");
    expect(obj === null || obj === void 0 ? void 0 : obj.getOwningPlayerSlot()).toEqual(exports.OPPONENT);
    obj = find.findGameObject("unit:base/cruiser");
    expect(obj === null || obj === void 0 ? void 0 : obj.getPosition().toString()).toEqual("(X=15.01,Y=0,Z=0)");
    expect(obj === null || obj === void 0 ? void 0 : obj.getOwningPlayerSlot()).toEqual(exports.OPPONENT);
});
//# sourceMappingURL=abstract.test.js.map