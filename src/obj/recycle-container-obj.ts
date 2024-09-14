import { refContainer } from "@tabletop-playground/api";
import { RecycleContainer } from "../lib/recycle-lib/recycle-container/recycle-container";

console.log("refContainer", refContainer.getId());
new RecycleContainer(refContainer);
