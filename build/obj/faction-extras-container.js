"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const SCALE = 4;
const widget = new api_1.ImageWidget()
    .setImageSize(128, 128)
    .setTintColor(new api_1.Color(1, 1, 1));
const ui = new api_1.UIElement();
ui.position = new api_1.Vector(0, 0, -1.7);
ui.presentationStyle = api_1.UIPresentationStyle.ViewAligned;
ui.scale = 1 / SCALE;
ui.widget = widget;
const outlineWidget = new api_1.ImageWidget().setImageSize(128, 128);
const outline = new api_1.UIElement();
outline.position = ui.position;
outline.presentationStyle = ui.presentationStyle;
outline.scale = ui.scale;
outline.widget = outlineWidget;
const obj = api_1.refObject;
const packageId = api_1.refPackageId;
function update() {
    const owner = obj.getOwningPlayerSlot();
    const faction = TI4.factionRegistry.getByPlayerSlot(owner);
    if (owner >= 0 && faction) {
        const icon = faction.getIcon();
        const iconOutline = icon.replace(".png", "-outline-only.png");
        widget.setImage(icon, faction.getIconPackageId());
        widget.setTintColor([1, 1, 1, 1]);
        outlineWidget.setImage(iconOutline, faction.getIconPackageId());
    }
    else {
        widget.setImage("icon/token/circle.png", packageId);
        widget.setTintColor([0, 0, 0, 1]);
        outlineWidget.setImage("icon/token/circle-outline-only.png", packageId);
    }
}
// Owner not set at creation time, wait a frame.
process.nextTick(() => {
    obj.addUI(ui);
    obj.addUI(outline);
    update();
});
TI4.events.onFactionChanged.add(update);
//# sourceMappingURL=faction-extras-container.js.map