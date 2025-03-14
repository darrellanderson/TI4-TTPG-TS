import { Player, Rotator, Vector } from "@tabletop-playground/api";
import { IGlobal, NamespaceId, Window } from "ttpg-darrell";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { CombatUIAllSimple } from "../../ui/combat-ui/combat-ui-all-simple/combat-ui-all-simple";
import { System } from "../../lib/system-lib/system/system";

export class ToggleCombatWindow implements IGlobal {
  private _window: Window | undefined = undefined;

  readonly _onSystemActivatedHandler = (
    _system: System,
    _player: Player
  ): void => {
    if (this._window) {
      this._window.destroy();
      this._window = undefined;
    }

    const createAbstractUi: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new CombatUIAllSimple(params.scale, params.playerSlot);
    };
    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "Combat";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUi,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;

    const playerSlotToTransform: {
      [key: number]: {
        pos: [x: number, y: number, z: number] | Vector;
        rot: [pitch: number, yaw: number, roll: number] | Rotator;
      };
    } = {};
    for (const playerSeat of TI4.playerSeats.getAllSeats()) {
      const playerSlot: number = playerSeat.playerSlot;
      const pos: Vector = playerSeat.cardHolder.getPosition().add([0, 0, 3]);
      pos.x = pos.x * 0.75; // move toward middle
      const rot: Rotator = new Rotator(0, 0, 0);
      playerSlotToTransform[playerSlot] = {
        pos,
        rot,
      };
    }
    abstractWindow.getMutableWindowParams().world = {
      anchor: {
        u: 0.5,
        v: 0.5,
      },
      playerSlotToTransform,
    };
    this._window = abstractWindow.createWindow();
  };

  init(): void {
    TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);
  }
}
