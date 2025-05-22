Separate module with only the types definitions.
"yarn types" in the main package to update this.

// You need to declare the module to use, will add TI4 global.
declare module "index";
import { System } from "index";
