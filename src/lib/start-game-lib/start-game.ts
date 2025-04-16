import { IGlobal } from "ttpg-darrell";
import { RemoveByNsidOrSource } from "../remove-lib/remove-by-nsid-or-source/remove-by-nsid-or-source";

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

    // TODO XXX
  }

  _doRemove(): void {
    const remove: RemoveByNsidOrSource =
      TI4.removeRegistry.createRemoveFromRegistryAndConfig();
    remove.removeAll();
  }
}
