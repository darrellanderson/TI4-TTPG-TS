"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const packageId = api_1.refPackageId;
TI4.timer.onTimerExpired.add(() => {
    const sound = api_1.world.importSound("bing-bong.flac", packageId);
    if (!sound) {
        console.log("no sound?");
        return;
    }
    const startTime = 0;
    const volume = 0.75; // [0:2] range
    const loop = false;
    sound.play(startTime, volume, loop);
});
const timerText = new api_1.Button()
    .setFontSize(20)
    .setTextColor([1, 0, 0, 1])
    .setText("00 : 00 : 00");
timerText.onClicked.add(() => {
    TI4.timer.toggle();
});
TI4.timer.onTimerTick.add(() => {
    timerText.setText(TI4.timer.getTimeString());
});
const obj = api_1.refObject;
const extent = obj.getExtent(false, false);
const editButton = new api_1.Button().setFontSize(14).setText("@");
editButton.onClicked.add(() => {
    const editUI = new api_1.UIElement();
    editUI.position = new api_1.Vector(0, 0, extent.z + 0.04);
    const onEditClose = () => {
        obj.removeUIElement(editUI);
    };
    const widget = new ttpg_darrell_1.EditTimer(TI4.timer).createWidget(onEditClose);
    editUI.widget = widget;
    obj.addUI(editUI);
});
const panel = new api_1.HorizontalBox()
    .setChildDistance(5)
    .addChild(timerText)
    .addChild(editButton);
const ui = new api_1.UIElement();
ui.position = new api_1.Vector(0, 0, extent.z + 0.02);
ui.widget = panel;
process.nextTick(() => {
    obj.addUI(ui);
});
//# sourceMappingURL=timer-obj.js.map