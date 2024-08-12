import { AddCommandTokens } from "./add-command-tokens";

const failedSlots: Set<number> = new AddCommandTokens().addAllCommandTokens();

console.log("Failed slots:", [...failedSlots.values()]);
