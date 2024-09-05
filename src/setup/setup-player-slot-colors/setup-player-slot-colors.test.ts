import { world } from "@tabletop-playground/api";
import { SetupPlayerSlotColors } from "./setup-player-slot-colors";

it("setup", () => {
  new SetupPlayerSlotColors().setup();
  expect(world.getSlotColor(1).toHex()).toBe("009292FF"); // formerly slot 10
  expect(world.getSlotColor(10).toHex()).toBe("00C702FF"); // new green
});
