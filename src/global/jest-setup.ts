import { SetupPlayerSlotColors } from "../setup/setup-player-slot-colors/setup-player-slot-colors";
import { addObjectTemplatesToMockWorld } from "../nsid/nsid-to-template-id.test";
import { resetGlobalThisTI4 } from "./global";

beforeEach(() => {
  addObjectTemplatesToMockWorld(); // does a MockWorld._reset!
  resetGlobalThisTI4();
  new SetupPlayerSlotColors().setup(); // normally part of table state creation
});
