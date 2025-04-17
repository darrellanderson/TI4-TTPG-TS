import { Vector, world } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
import { RemoveByNsidOrSource } from "../remove-lib/remove-by-nsid-or-source/remove-by-nsid-or-source";
import { LayoutAll } from "../../setup/layout/layout-all/layout-all";
import { scrubAll } from "../../setup/layout/layout-all/scrub-all";

export class StartGame implements IGlobal {
  private readonly _onStartGameRequest = (): void => {
    this._applyPlayerCount();
    this._doRemove();
  };

  init(): void {
    TI4.events.onStartGameRequest.add(this._onStartGameRequest);
  }

  _applyPlayerCount(): void {
    const currentCount = TI4.playerSeats.getAllSeats().length;
    if (currentCount === TI4.config.playerCount) {
      return; // already correct
    }

    scrubAll(undefined);

    const z: number = world.getTableHeight();
    const pos: Vector = new Vector(0, 0, z + 3);
    const yaw: number = 0;

    const playerCount: number = TI4.config.playerCount;
    const layout: LayoutAll = new LayoutAll(playerCount);
    layout.getLayout().doLayoutAtPoint(pos, yaw);
  }

  _doRemove(): void {
    const remove: RemoveByNsidOrSource =
      TI4.removeRegistry.createRemoveFromRegistryAndConfig();
    remove.removeAll();
  }
}
