import {
  CardHolder,
  Container,
  GameObject,
  Vector,
} from "@tabletop-playground/api";
import { Find, NamespaceId, PlayerSlot } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import {
  GenerateSlices,
  GenerateSlicesParams,
  SliceTiles,
} from "../generate-slices/generate-slices";
import { IDraft } from "./idraft";
import { Milty } from "./milty";
import { System } from "../../system-lib/system/system";

export class BagDraft implements IDraft {
  private readonly _find: Find = new Find();
  private _containerNsid: string = "container:base/bag-draft";

  isEnabled(): boolean {
    return true;
  }

  getDraftName(): string {
    return "Bag Draft";
  }

  getGenerateSlicesParams(): GenerateSlicesParams {
    return new Milty().getGenerateSlicesParams();
  }

  /**
   * DOES NOT USE THIS FUNCTION, spawns containers with system tiles
   * in each player area.
   *
   * @param namespaceId
   */
  createEmptyDraftState(_namespaceId: NamespaceId): DraftState {
    throw new Error("Method not implemented.");
  }

  _getSlices(): Array<SliceTiles> {
    return new GenerateSlices(this.getGenerateSlicesParams()).generateSlices(
      TI4.config.playerCount
    );
  }

  _createContainer(playerSlot: PlayerSlot): Container {
    const cardHolder: CardHolder | undefined =
      this._find.findCardHolderBySlot(playerSlot);
    if (!cardHolder) {
      throw new Error("Card holder not found");
    }
    const pos: Vector = TI4.playerSeats.getDealPosition(playerSlot);

    const above: Vector = pos.add([0, 0, 10]);

    const nsid: string = this._containerNsid;
    const container: GameObject | undefined = TI4.spawn.spawn(nsid, above);
    if (!container || !(container instanceof Container)) {
      throw new Error("Container not created or not a Container");
    }
    container.snapToGround();
    return container;
  }

  _fillContainer(container: Container, slice: SliceTiles): void {
    const tileSet: Set<number> = new Set(slice);

    const skipContained: boolean = false;
    const systems: Array<System> = TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .filter((system: System): boolean => {
        return tileSet.has(system.getSystemTileNumber());
      });
    if (systems.length !== slice.length) {
      throw new Error("missing systems");
    }

    systems.forEach((system: System): void => {
      const obj: GameObject = system.getObj();
      const containedIn: Container | undefined = obj.getContainer();
      if (containedIn) {
        const pos = containedIn.getPosition().add([0, 0, 10]);
        containedIn.take(obj, pos);
      }
      container.addObjects([obj]);
    });
  }

  setContainerNsid(nsid: string): this {
    this._containerNsid = nsid;
    return this;
  }

  createDraftObjects(): void {
    const slices: Array<SliceTiles> = this._getSlices();
    slices.forEach((slice: SliceTiles, seatIndex: number): void => {
      const playerSlot: PlayerSlot =
        TI4.playerSeats.getPlayerSlotBySeatIndexOrThrow(seatIndex);
      const container: Container = this._createContainer(playerSlot);
      this._fillContainer(container, slice);
    });
  }
}
