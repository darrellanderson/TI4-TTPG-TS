"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const horizontal_ui_builder_1 = require("./horizontal-ui-builder");
class MyAbstractUI extends abtract_ui_1.AbstractUI {
    constructor(value) {
        const widget = new api_1.Border()
            .setColor([0, 0, 0, 1])
            .setChild(new api_1.Text().setTextColor([1, 1, 1, 1]).setText(value));
        super(widget, { w: 100, h: 50 });
    }
}
function go() {
    const abstractUi = new horizontal_ui_builder_1.HorizontalUIBuilder()
        .addUIs([
        new MyAbstractUI("1"),
        new MyAbstractUI("2"),
        new MyAbstractUI("3"),
        new MyAbstractUI("4"),
        new MyAbstractUI("5"),
    ])
        .setSpacing(10)
        .setPadding(10)
        .build();
    const widget = abstractUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = abstractUi.getSize().w + 4; // border
    screenUI.height = abstractUi.getSize().h + 4;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 1000);
//# sourceMappingURL=horizontal-ui-builder.testp.js.map