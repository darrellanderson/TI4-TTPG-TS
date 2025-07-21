"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerColor = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class PlayerColor {
    constructor(namespaceId) {
        this._colorLib = new ttpg_darrell_1.ColorLib();
        this._namespaceId = namespaceId;
    }
    getAnonymousColor() {
        return this._colorLib.parseColorOrThrow("#5D1602");
    }
    _getPlayerColorEntry(slot) {
        const json = api_1.world.getSavedData(this._namespaceId);
        if (json && json.length > 0) {
            const parsed = JSON.parse(json);
            if (parsed) {
                const entry = parsed[slot];
                if (entry) {
                    return entry;
                }
            }
        }
        return undefined;
    }
    _setPlayerColorEntry(slot, entry) {
        let json = api_1.world.getSavedData(this._namespaceId);
        if (!json || json.length === 0) {
            json = "{}";
        }
        const parsed = JSON.parse(json);
        parsed[slot] = entry;
        json = JSON.stringify(parsed);
        api_1.world.setSavedData(json, this._namespaceId);
    }
    setSlotColor(slot, colorName, colorHex) {
        let colorsType = this._colorLib.getColorsByNameOrThrow(colorName, 0);
        if (colorHex) {
            colorsType = this._colorLib.getColorsByTargetOrThrow(colorHex);
        }
        const slotColor = this._colorLib.parseColorOrThrow(colorsType.slot);
        api_1.world.setSlotColor(slot, slotColor);
        const entry = {
            colorName: colorName,
            target: colorsType.target,
            plastic: colorsType.plastic,
            widget: colorsType.widget,
        };
        this._setPlayerColorEntry(slot, entry);
    }
    getSlotColorName(slot) {
        const entry = this._getPlayerColorEntry(slot);
        if (entry) {
            return entry.colorName;
        }
        return undefined;
    }
    getSlotColorNameOrThrow(slot) {
        const colorName = this.getSlotColorName(slot);
        if (!colorName) {
            throw new Error(`No color name for slot ${slot}`);
        }
        return colorName;
    }
    getSlotPlasticColor(slot) {
        const entry = this._getPlayerColorEntry(slot);
        if (entry) {
            const hexColor = entry.plastic;
            return this._colorLib.parseColor(hexColor);
        }
        return undefined;
    }
    getSlotPlasticColorOrThrow(slot) {
        const color = this.getSlotPlasticColor(slot);
        if (!color) {
            throw new Error(`No plastic color for slot ${slot}`);
        }
        return color;
    }
    getSlotWidgetColor(slot) {
        const entry = this._getPlayerColorEntry(slot);
        if (entry) {
            const hexColor = entry.widget;
            return this._colorLib.parseColor(hexColor);
        }
        return undefined;
    }
    getSlotWidgetColorOrThrow(slot) {
        const color = this.getSlotWidgetColor(slot);
        if (!color) {
            throw new Error(`No widget color for slot ${slot}`);
        }
        return color;
    }
}
exports.PlayerColor = PlayerColor;
//# sourceMappingURL=player-color.js.map