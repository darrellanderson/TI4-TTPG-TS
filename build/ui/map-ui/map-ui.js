"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const map_string_parser_1 = require("../../lib/map-string-lib/map-string/map-string-parser");
const map_string_hex_1 = require("../../lib/map-string-lib/map-string/map-string-hex");
const HALF_HEX_W_PX = 28; // 50 will fill a small screen
const LABEL_RELATIVE_TO_HEX_SIZE = 0.3;
const packageId = api_1.refPackageId;
class MapUI extends abtract_ui_1.AbstractUI {
    /**
     * Get a negative tile number that will render as this player slot's color.
     *
     * @param playerSlot
     * @returns
     */
    static playerSlotToColorTileNumber(playerSlot) {
        return -100 - playerSlot;
    }
    /**
     * Translate a color tile number to the linked player slot color.
     *
     * @param tileNumber
     * @returns
     */
    static colorTileNumberToColor(tileNumber) {
        const playerSlot = -(tileNumber + 100);
        if (playerSlot >= 0 && playerSlot < 20) {
            const color = api_1.world.getSlotColor(playerSlot);
            return color;
        }
        return undefined;
    }
    constructor(mapString, hexToLabel, scale) {
        const _mapStringIndexToImageWidget = new Map();
        const _hexToTextWidget = new Map();
        const halfScaledHexWidth = HALF_HEX_W_PX * scale;
        const halfScaledHexHeight = halfScaledHexWidth * 0.866;
        const scaledHex = new ttpg_darrell_1.Hex(ttpg_darrell_1.HEX_LAYOUT_POINTY, halfScaledHexWidth);
        const labelFontSize = halfScaledHexWidth * LABEL_RELATIVE_TO_HEX_SIZE;
        let left = 0;
        let top = 0;
        let right = 0;
        let bottom = 0;
        const entries = new map_string_parser_1.MapStringParser().parseOrThrow(mapString);
        const mapStringHex = new map_string_hex_1.MapStringHex();
        for (let i = 0; i < entries.length; i++) {
            const hex = mapStringHex.indexToHex(i);
            const pos = scaledHex.toPosition(hex);
            [pos.x, pos.y] = [pos.y, -pos.x];
            const x = pos.x;
            const y = pos.y;
            left = Math.min(left, x - halfScaledHexWidth);
            top = Math.min(top, y - halfScaledHexHeight);
            right = Math.max(right, x + halfScaledHexWidth);
            bottom = Math.max(bottom, y + halfScaledHexHeight);
        }
        const width = right - left;
        const height = bottom - top;
        const size = { w: width, h: height };
        const canvas = new api_1.Canvas();
        entries.forEach((entry, index) => {
            // Always skip -1, allow other negative values for tint color.
            if (entry.tile === -1) {
                return;
            }
            const img = new api_1.ImageWidget().setImageSize(halfScaledHexWidth * 2 + 2, halfScaledHexHeight * 2 + 2);
            const hex = mapStringHex.indexToHex(index);
            const pos = scaledHex.toPosition(hex);
            [pos.x, pos.y] = [pos.y, -pos.x];
            pos.x -= left;
            pos.y -= top;
            canvas.addChild(img, pos.x - halfScaledHexWidth - 1, pos.y - halfScaledHexWidth - 1, halfScaledHexWidth * 2 + 2, halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
            );
            _mapStringIndexToImageWidget.set(index, img);
            // Apply system image, or default to blank tile.
            const system = TI4.systemRegistry.getBySystemTileNumber(entry.tile);
            if (system && system.isHyperlane()) {
                // Cannot rotate images, use a special tile for hyperlanes.
                const c = 0.03;
                img
                    .setImage("tile/system/hyperlane.png", packageId)
                    .setTintColor([c, c, c, 1]);
            }
            else if (system) {
                img.setImage(system.getImg(), system.getImgPackageId());
            }
            else {
                img.setImage("tile/system/tile-000.png", packageId);
            }
            // Faction home systems might not exist in the world (yet),
            // systemRegistry only knows existing systems.
            // Look up faction by home system.
            const faction = TI4.factionRegistry.getByHomeSystemTileNumber(entry.tile);
            if (faction) {
                img.setImage(faction.getHomeImg(), faction.getHomeImgPackageId());
            }
            // Apply tint color.
            const color = MapUI.colorTileNumberToColor(entry.tile);
            if (color) {
                img.setTintColor(color);
            }
        });
        // Add labels (do after tiles so labels lay on top).
        for (const hex of hexToLabel.keys()) {
            const pos = scaledHex.toPosition(hex);
            [pos.x, pos.y] = [pos.y, -pos.x];
            pos.x -= left;
            pos.y -= top;
            const labelText = new api_1.Text()
                .setAutoWrap(true)
                .setBold(true)
                .setFontSize(labelFontSize)
                .setJustification(api_1.TextJustification.Center);
            const c = 0;
            const border = new api_1.Border()
                .setColor([c, c, c, 0.5])
                .setChild(labelText);
            const box = new api_1.LayoutBox()
                .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
                .setVerticalAlignment(api_1.VerticalAlignment.Center)
                .setChild(border);
            canvas.addChild(box, pos.x - halfScaledHexWidth - 1, pos.y - halfScaledHexWidth - 1, halfScaledHexWidth * 2 + 2, halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
            );
            _hexToTextWidget.set(hex, labelText);
        }
        const box = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(canvas);
        super(box, size);
        this._mapStringIndexToImageWidget = new Map();
        this._hexToTextWidget = new Map();
        this._hexToTextWidget = _hexToTextWidget;
        this._mapStringIndexToImageWidget = _mapStringIndexToImageWidget;
        this.update(mapString, hexToLabel);
    }
    update(mapString, hexToLabel) {
        const entries = new map_string_parser_1.MapStringParser().parseOrThrow(mapString);
        entries.forEach((entry, index) => {
            // Update system image.
            const img = this._mapStringIndexToImageWidget.get(index);
            if (img) {
                // Apply system image, or default to blank tile.
                const system = TI4.systemRegistry.getBySystemTileNumber(entry.tile);
                if (system && system.isHyperlane()) {
                    // Cannot rotate images, use a blank tile for hyperlanes, tint later
                    img.setImage("tile/system/hyperlane.png", packageId);
                }
                else if (system) {
                    img.setImage(system.getImg(), system.getImgPackageId());
                }
                else {
                    img.setImage("tile/system/tile-000.png", packageId);
                }
                // Faction home systems might not exist in the world (yet),
                // systemRegistry only knows existing systems.
                // Look up faction by home system.
                const faction = TI4.factionRegistry.getByHomeSystemTileNumber(entry.tile);
                if (faction) {
                    img.setImage(faction.getHomeImg(), faction.getHomeImgPackageId());
                }
                // Apply tint color.
                const color = MapUI.colorTileNumberToColor(entry.tile);
                if (color) {
                    img.setTintColor(color);
                }
                else if (system === null || system === void 0 ? void 0 : system.isHyperlane()) {
                    img.setTintColor([0.03, 0.03, 0.03, 1]);
                }
                else {
                    img.setTintColor([1, 1, 1, 1]);
                }
            }
        });
        // Update label text.
        this._hexToTextWidget.forEach((labelText, hex) => {
            var _a;
            const label = (_a = hexToLabel.get(hex)) !== null && _a !== void 0 ? _a : "";
            labelText.setText(`${label.trim()}`);
        });
    }
}
exports.MapUI = MapUI;
//# sourceMappingURL=map-ui.js.map