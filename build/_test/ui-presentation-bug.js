"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const packageId = api_1.refPackageId;
function createUI(pos) {
    const ui = new api_1.UIElement();
    ui.position = pos;
    ui.presentationStyle = api_1.UIPresentationStyle.ViewAligned;
    ui.scale = 0.2;
    ui.widget = new api_1.ImageWidget()
        .setImage("icon/token/fighter-1.png", packageId)
        .setImageSize(50, 50);
    api_1.world.addUI(ui);
}
/**
 * 2: client sees correct results.
 * 5: client sees SOME wrong presentation styles, but not all.
 * 10: client sees UI but with wrong scale and presentation style.
 * 30: client does not see any UI.
 */
const d = 5;
const z = api_1.world.getTableHeight() + 3;
for (let x = -d; x <= d; x += 1) {
    for (let y = -d; y <= d; y += 1) {
        createUI(new api_1.Vector(x, y, z));
    }
}
//# sourceMappingURL=ui-presentation-bug.js.map