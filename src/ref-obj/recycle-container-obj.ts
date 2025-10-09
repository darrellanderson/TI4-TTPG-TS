import { refContainer } from "@tabletop-playground/api";
import { IconContainer } from "../lib/icon-container/icon-container";
import { RecycleContainer } from "../lib/recycle-lib/recycle-container/recycle-container";

new IconContainer(refContainer);
new RecycleContainer(refContainer);
