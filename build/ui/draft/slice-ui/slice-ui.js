"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const system_summary_1 = require("../../../lib/system-lib/system/system-summary");
const HALF_HEX_W_PX = 27;
const packageId = api_1.refPackageId;
class SliceUI extends abtract_ui_1.AbstractUI {
    constructor(slice, sliceShape, sliceColor, scale) {
        const halfScaledHexWidth = HALF_HEX_W_PX * scale;
        const halfScaledHexHeight = halfScaledHexWidth * 0.866;
        const scaledHex = new ttpg_darrell_1.Hex(ttpg_darrell_1.HEX_LAYOUT_POINTY, halfScaledHexWidth); // x/y flipped thus pointy
        const hexPositions = [];
        let left = 0;
        let top = 0;
        let right = 0;
        let bottom = 0;
        for (const hex of sliceShape) {
            // Remember hex position.
            const pos = scaledHex.toPosition(hex);
            // Convert to screen coordinates (swap x/y, and flip y).
            [pos.x, pos.y] = [pos.y, -pos.x];
            hexPositions.push(pos);
            // Update bounding box.
            left = Math.min(left, pos.x - halfScaledHexWidth);
            top = Math.min(top, pos.y - halfScaledHexHeight);
            right = Math.max(right, pos.x + halfScaledHexWidth);
            bottom = Math.max(bottom, pos.y + halfScaledHexHeight);
        }
        // Adjust positions to be relative to bounding box top-left.
        for (const pos of hexPositions) {
            pos.x -= left;
            pos.y -= top;
        }
        const canvas = new api_1.Canvas();
        // Add home system.
        const homePos = hexPositions[0];
        if (homePos) {
            const img = new api_1.ImageWidget()
                .setImageSize(halfScaledHexWidth * 2 + 2, halfScaledHexHeight * 2 + 2)
                .setImage("tile/system/tile-000.png", packageId)
                .setTintColor(sliceColor);
            canvas.addChild(img, homePos.x - halfScaledHexWidth - 1, homePos.y - halfScaledHexWidth - 1, halfScaledHexWidth * 2 + 2, halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
            );
        }
        // Add slice systems.
        slice.forEach((tile, index) => {
            const system = TI4.systemRegistry.getBySystemTileNumber(tile);
            const pos = hexPositions[index + 1]; // 0 is home system
            if (system && pos) {
                const img = new api_1.ImageWidget().setImageSize(halfScaledHexWidth * 2, halfScaledHexHeight * 2);
                if (system.isHyperlane()) {
                    // Cannot rotate images, use a gray tile for hyperlanes.
                    const c = 0.03;
                    img
                        .setImage("tile/system/tile-000.png", packageId)
                        .setTintColor([c, c, c, 1]);
                }
                else {
                    img.setImage(system.getImg(), system.getImgPackageId());
                }
                canvas.addChild(img, pos.x - halfScaledHexWidth - 1, pos.y - halfScaledHexWidth - 1, halfScaledHexWidth * 2 + 2, halfScaledHexWidth * 2 + 2 // image is square, not hex sized!
                );
            }
        });
        // Add label (below slice).
        const summaryValue = system_summary_1.SystemSummary.getFromSystemTileNumbers(slice).getSummary();
        const fontSize = halfScaledHexHeight * 0.45;
        const summaryText = new api_1.Text()
            .setBold(true)
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center)
            .setTextColor([0, 0, 0, 1])
            .setText(summaryValue);
        const labelText = new api_1.Text()
            .setAutoWrap(true)
            .setBold(true)
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center)
            .setTextColor([0, 0, 0, 1])
            .setText("Slice");
        const panel = new api_1.VerticalBox()
            .addChild(summaryText)
            .addChild(labelText);
        const panelBox = new api_1.LayoutBox()
            .setPadding(0, 0, 0, -100)
            .setChild(panel);
        const panelBorder = new api_1.Border()
            .setColor(sliceColor)
            .setChild(panelBox);
        const labelWidth = right - left;
        const labelHeight = fontSize * 4;
        const labelY = bottom - top - labelHeight * 0.5;
        canvas.addChild(panelBorder, 0, labelY, labelWidth, labelHeight);
        bottom += labelHeight * 0.5;
        const w = right - left;
        const h = bottom - top;
        const widget = new api_1.LayoutBox()
            .setOverrideWidth(w)
            .setOverrideHeight(h)
            .setChild(canvas);
        super(widget, { w, h });
        this._labelText = labelText;
        this._defaultFontSize = fontSize;
    }
    setLabel(label) {
        this._labelText.setText(label);
        let fontSize = this._defaultFontSize;
        const maxLineLength = 18;
        const numLines = Math.ceil(label.length / maxLineLength);
        if (numLines === 2) {
            // More will fit in one line with smaller font size.
            const excess = label.length - maxLineLength;
            fontSize *= 1 - excess / maxLineLength / 2;
        }
        else if (numLines > 2) {
            fontSize *= 1.5 / numLines;
        }
        this._labelText.setFontSize(fontSize);
    }
}
exports.SliceUI = SliceUI;
//# sourceMappingURL=slice-ui.js.map