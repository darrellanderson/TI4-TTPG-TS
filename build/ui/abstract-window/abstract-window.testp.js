"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_window_1 = require("./abstract-window");
const button_ui_1 = require("../button-ui/button-ui");
const createAbstractUI = (params) => {
    return new button_ui_1.ButtonUI(params.scale * 6);
};
const namespaceId = "@test/test";
const window = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, "title").createWindow();
setTimeout(() => {
    console.log("window.attach()");
    window.attach();
}, 100);
//# sourceMappingURL=abstract-window.testp.js.map