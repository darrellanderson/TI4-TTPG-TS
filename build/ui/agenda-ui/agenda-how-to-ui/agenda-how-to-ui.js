"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaHowToUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const config_1 = require("../../config/config");
class AgendaHowToUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const size = {
            w: config_1.CONFIG.BUTTON_WIDTH * 5 * scale + config_1.CONFIG.SPACING * 4 * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * 2 * scale + config_1.CONFIG.SPACING * 1 * scale,
        };
        const box = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setPadding(config_1.CONFIG.SPACING * scale, config_1.CONFIG.SPACING * scale, config_1.CONFIG.SPACING * scale, config_1.CONFIG.SPACING * scale);
        const c = 0.06;
        const widget = new api_1.Border().setColor([c, c, c, 1]).setChild(box);
        super(widget, size);
        // Temporary workaround for rich text: need to set size for bold/etc elements.
        const fontSize = Math.round(config_1.CONFIG.FONT_SIZE * scale);
        const msg = [
            `[b][size=${fontSize}]Play when[/size][/b] to skip to the next turn (handle then when with the table).`,
            `[b][size=${fontSize}]No whens[/size][/b] to skip your whens this round, you get another chance next round if anyone plays a when.`,
            `[b][size=${fontSize}]Never whens[/size][/b] to skip every time.`,
            "Repeat for afters (right click many afters to assign the outcome), then vote.",
            "You may click early, it will be processed on your turn.",
        ].join(" ");
        const richText = new api_1.RichText()
            .setAutoWrap(true)
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
            .setText(msg);
        box.setChild(richText);
    }
}
exports.AgendaHowToUI = AgendaHowToUI;
//# sourceMappingURL=agenda-how-to-ui.js.map