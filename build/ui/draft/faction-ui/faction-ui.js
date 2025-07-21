"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactionUI = exports.SPACING = exports.FONT_SIZE = exports.BOX_H = exports.BOX_W = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
exports.BOX_W = 110;
exports.BOX_H = 30;
exports.FONT_SIZE = exports.BOX_H * 0.37;
exports.SPACING = exports.BOX_H * 0.1;
class FactionUI extends abtract_ui_1.AbstractUI {
    constructor(faction, scale) {
        const factionName = faction
            .getAbbr()
            .toUpperCase()
            .replace(" ", "\n");
        const w = exports.BOX_W * scale;
        const h = exports.BOX_H * scale;
        const fontSize = exports.FONT_SIZE * scale;
        const spacing = exports.SPACING * scale;
        const s = h - spacing * 2;
        const icon = new api_1.ImageWidget()
            .setImageSize(s, s)
            .setImage(faction.getIcon(), faction.getIconPackageId());
        const name = new api_1.Text()
            .setBold(true)
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center)
            .setText(factionName);
        const panel = new api_1.HorizontalBox()
            .setChildDistance(spacing)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .addChild(icon)
            .addChild(name);
        const widget = new api_1.LayoutBox()
            .setPadding(-100, -100, -10, -10)
            .setOverrideWidth(w)
            .setOverrideHeight(h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .setChild(panel);
        super(widget, { w, h });
    }
}
exports.FactionUI = FactionUI;
//# sourceMappingURL=faction-ui.js.map