"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_command_tokens_1 = require("./add-command-tokens");
const failedSlots = new add_command_tokens_1.AddCommandTokens().addAllCommandTokens();
console.log("Failed slots:", [...failedSlots.values()]);
//# sourceMappingURL=add-command-tokens.testp.js.map