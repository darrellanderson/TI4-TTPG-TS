"use strict";
/**
 * Examine how "add to size" widgets behave.
 *
 * Observations:
 *
 * LayoutBox needs H/V alignments to prevent stretching child.
 * Border inside a LayoutBox respects size.
 * ContentButton adds 4px external padding.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
function getLayoutBox(label) {
    const labelText = new api_1.Text()
        .setText(label)
        .setTextColor([1, 1, 1, 1]);
    return new api_1.LayoutBox()
        .setOverrideWidth(100)
        .setOverrideHeight(20)
        .setChild(labelText);
}
function getBorder(label) {
    const child = getLayoutBox(label);
    return new api_1.Border().setChild(child);
}
function getBorderBox(label) {
    const child = getBorder(label);
    return new api_1.LayoutBox()
        .setOverrideWidth(100)
        .setOverrideHeight(20)
        .setHorizontalAlignment(api_1.HorizontalAlignment.Left)
        .setVerticalAlignment(api_1.VerticalAlignment.Top)
        .setChild(child);
}
function getDoubleBorderBox(label) {
    const grandChild = getBorderBox(label);
    const child = new api_1.Border()
        .setColor([1, 0, 0, 1])
        .setChild(grandChild);
    return new api_1.LayoutBox()
        .setOverrideWidth(100)
        .setOverrideHeight(20)
        .setHorizontalAlignment(api_1.HorizontalAlignment.Left)
        .setVerticalAlignment(api_1.VerticalAlignment.Top)
        .setChild(child);
}
function getContentButton(label) {
    const grandChild = getLayoutBox(label);
    const child = new api_1.ContentButton().setChild(grandChild);
    return new api_1.LayoutBox()
        .setOverrideWidth(100)
        .setOverrideHeight(20)
        .setHorizontalAlignment(api_1.HorizontalAlignment.Left)
        .setVerticalAlignment(api_1.VerticalAlignment.Top)
        .setChild(child);
}
function go() {
    const panel = new api_1.HorizontalBox().setChildDistance(10);
    panel
        .addChild(getLayoutBox("box"))
        .addChild(getBorder("border"))
        .addChild(getBorderBox("border box"))
        .addChild(getDoubleBorderBox("double border box"))
        .addChild(getContentButton("content button"));
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = 1000;
    screenUI.height = 500;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setColor([0, 0, 0, 1]).setChild(panel);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 100);
//# sourceMappingURL=border-contentbutton-sizing.testp.js.map