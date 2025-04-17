import { GameObject, refObject, Vector, world } from "@tabletop-playground/api";

import { LayoutAll } from "./layout-all";
import { SetupPlayerSlotColors } from "../../setup-player-slot-colors/setup-player-slot-colors";
import { scrubAll } from "./scrub-all";

const refObjectCopy: GameObject = refObject;

function go() {
  console.log("LAYOUT-ALL.TESTP");
  scrubAll(refObjectCopy);

  TI4.config.setPlayerCount(6);

  new SetupPlayerSlotColors().setup();

  const z: number = world.getTableHeight();
  const pos: Vector = new Vector(0, 0, z + 3);
  const yaw: number = 0;

  const playerCount: number = TI4.config.playerCount;
  const layout: LayoutAll = new LayoutAll(playerCount);
  layout.getLayout().doLayoutAtPoint(pos, yaw);
}

setTimeout(go, 1000);
