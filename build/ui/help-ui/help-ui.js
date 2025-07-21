"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const long_richtext_ui_1 = require("../button-ui/long-richtext-ui");
const two_icon_label_ui_1 = require("../button-ui/two-icon-label-ui");
const config_1 = require("../config/config");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
const label_ui_1 = require("../button-ui/label-ui");
const horizontal_ui_builder_1 = require("../panel/horizontal-ui-builder");
const packageId = api_1.refPackageId;
class HelpUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const scaledWidth = (config_1.CONFIG.BUTTON_WIDTH * 2 + config_1.CONFIG.SPACING) * scale;
        // Temporary workaround for rich text: need to set size for bold/etc elements.
        const fontSize = Math.round(config_1.CONFIG.FONT_SIZE * scale);
        const windowHeader = new long_richtext_ui_1.LongRichTextUI(scaledWidth, scale);
        windowHeader
            .getRichText()
            .setText(`[b][size=${fontSize}]WINDOW CONTROLS:[/b]`);
        const growShrinkWindow = new two_icon_label_ui_1.TwoIconLabel(scale)
            .setIcon1("ui/window/shrink.png", packageId)
            .setIcon2("ui/window/grow.png", packageId)
            .setLabel(`: [b][size=${fontSize}]Shrink[/size][/b] or [b][size=${fontSize}]grow[/size][/b] the window`);
        const warpWindow = new two_icon_label_ui_1.TwoIconLabel(scale)
            .setIcon1("ui/1x1-transparent.png", packageId)
            .setIcon2("ui/window/to-screen.png", packageId)
            .setLabel(`: [b][size=${fontSize}]Swap[/size][/b] between screen / player-area`);
        const collapseExpandWindow = new two_icon_label_ui_1.TwoIconLabel(scale)
            .setIcon1("ui/window/collapse.png", packageId)
            .setIcon2("ui/window/expand.png", packageId)
            .setLabel(`: [b][size=${fontSize}]Collapse[/size][/b] or [b][size=${fontSize}]expand[/size][/b] the window`);
        const closeWindow = new two_icon_label_ui_1.TwoIconLabel(scale)
            .setIcon1("ui/1x1-transparent.png", packageId)
            .setIcon2("ui/window/close.png", packageId)
            .setLabel(`: [b][size=${fontSize}]Close[/size][/b] (right click table to reopen)`);
        const numpadHeader = new long_richtext_ui_1.LongRichTextUI(scaledWidth, scale);
        numpadHeader
            .getRichText()
            .setText(`[b][size=${fontSize}]NUMPAD KEYS:[/size][/b]`);
        const key1 = new label_ui_1.LabelUI(scale);
        key1
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("1: Spawn tradegood");
        const key2 = new label_ui_1.LabelUI(scale);
        key2
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("2: Spawn fighter token");
        const key3 = new label_ui_1.LabelUI(scale);
        key3
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("3: Spawn infantry token");
        const key4 = new label_ui_1.LabelUI(scale);
        key4
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("4: [reserved]");
        const key5 = new label_ui_1.LabelUI(scale);
        key5
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("5: look active system");
        const key6 = new label_ui_1.LabelUI(scale);
        key6
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("6: look map");
        const key7 = new label_ui_1.LabelUI(scale);
        key7
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("7: look scoring");
        const key8 = new label_ui_1.LabelUI(scale);
        key8
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("8: [reserved]");
        const key9 = new label_ui_1.LabelUI(scale);
        key9
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("9: look my area");
        const key0 = new label_ui_1.LabelUI(scale);
        key0
            .getText()
            .setJustification(api_1.TextJustification.Left)
            .setText("0: trash held objects");
        const keyRWide = new long_richtext_ui_1.LongRichTextUI(scaledWidth, scale);
        keyRWide
            .getRichText()
            .setJustification(api_1.TextJustification.Left)
            .setText("R: swap fighter/infantry token/plastic; 1/3 TGs");
        const keyCtrlNumberWide = new long_richtext_ui_1.LongRichTextUI(scaledWidth, scale);
        keyCtrlNumberWide
            .getRichText()
            .setJustification(api_1.TextJustification.Left)
            .setText("Ctrl-numpad#: look at player area for player #");
        const left = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([key1, key2, key3, key4, key5])
            .build();
        const right = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([key6, key7, key8, key9, key0])
            .build();
        const numpadKeys = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([left, right])
            .build();
        const ui = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([
            windowHeader,
            growShrinkWindow,
            warpWindow,
            collapseExpandWindow,
            closeWindow,
            numpadHeader,
            numpadKeys,
            keyRWide,
            keyCtrlNumberWide,
        ])
            .build();
        super(ui.getWidget(), ui.getSize());
    }
}
exports.HelpUI = HelpUI;
//# sourceMappingURL=help-ui.js.map