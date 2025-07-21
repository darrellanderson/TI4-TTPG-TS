"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiTitle = void 0;
const api_1 = require("@tabletop-playground/api");
const packageId = api_1.refPackageId;
class UiTitle {
    constructor() {
        this._text1 = new api_1.Text();
        this._text2 = new api_1.Text();
        this._text3 = new api_1.Text();
        this._border = new api_1.Border();
    }
    _createTitleUI() {
        const scale = 4;
        const ui = new api_1.UIElement();
        ui.anchorX = 0.5;
        ui.anchorY = 1;
        ui.position = new api_1.Vector(40, 0, api_1.world.getTableHeight() + 1);
        ui.presentationStyle = api_1.UIPresentationStyle.ViewAligned;
        ui.scale = 1 / scale;
        ui.widget = this._createTitleWidget(scale);
        ui.useTransparency = true;
        return ui;
    }
    _createTitleWidget(scale) {
        this._text1
            .setText("How to Play".toUpperCase())
            .setBold(true)
            .setFontSize(24 * scale)
            .setJustification(api_1.TextJustification.Center);
        this._text2
            .setText("TWILIGHT IMPERIUM".toUpperCase())
            .setBold(true)
            .setFont("ambroise-firmin-bold.otf", packageId)
            .setFontSize(48 * scale)
            .setJustification(api_1.TextJustification.Center);
        this._text3
            .setText("on Tabletop Playground".toUpperCase())
            .setBold(true)
            .setFontSize(24 * scale)
            .setJustification(api_1.TextJustification.Center);
        const panel = new api_1.VerticalBox()
            .setChildDistance(1)
            .addChild(this._text1)
            .addChild(this._text2)
            .addChild(this._text3);
        const p = 3 * scale;
        const box = new api_1.LayoutBox().setPadding(p, p, p, p).setChild(panel);
        this._border.setColor([0, 0, 0, 0.8]).setChild(box);
        this.tint(1);
        return this._border;
    }
    tint(alpha) {
        this._text1.setTextColor([1, 1, 1, alpha]).setVisible(alpha > 0);
        this._text2.setTextColor([1, 1, 1, alpha]).setVisible(alpha > 0);
        this._text3.setTextColor([1, 1, 1, alpha]).setVisible(alpha > 0);
        this._border.setColor([0, 0, 0, 0.8 * alpha]).setVisible(alpha > 0);
    }
}
exports.UiTitle = UiTitle;
//# sourceMappingURL=ui-title.js.map