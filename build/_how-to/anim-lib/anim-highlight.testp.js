"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const anim_highlight_1 = require("./anim-highlight");
const obj = api_1.refObject;
const duration = 1000; // Duration in milliseconds
process.nextTick(() => {
    for (const line of obj.getDrawingLines()) {
        console.log(`Removing existing line: ${line.tag}`);
        obj.removeDrawingLineObject(line);
    }
    anim_highlight_1.AnimHighlight.simple(obj, duration).then(() => {
        console.log("Highlight animation completed.");
    });
});
//# sourceMappingURL=anim-highlight.testp.js.map