"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_template_nsids_1 = require("./validate-template-nsids");
function go() {
    const errors = [];
    new validate_template_nsids_1.ValidateTemplateNsids().getErrors(errors);
    console.log("Errors:\n", errors.join("\n"));
}
process.nextTick(go);
//# sourceMappingURL=validate-template-nsids.testp.js.map