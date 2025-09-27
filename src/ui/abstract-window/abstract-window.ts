import { Rotator, Vector, Widget, world } from "@tabletop-playground/api";
import {
  IWindowWidget,
  NamespaceId,
  Window,
  WindowParams,
  WindowWidgetParams,
} from "ttpg-darrell";

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export type CreateAbstractUIParams = {
  playerSlot: number;
  scale: number;
};

export type CreateAbstractUIType = (
  params: CreateAbstractUIParams
) => AbstractUI;

/**
 * AbstractUI and Window have similar, but not identical APIs.
 * This class is a bridge from AbstractUI to Window.
 *
 * Not actually an "abstract" class, but deals in AbstractUIs.
 */
export class AbstractWindow {
  private readonly _createAbstractUI: CreateAbstractUIType;
  private readonly _namespaceId: NamespaceId | undefined;
  private readonly _windowParams: WindowParams;
  private _allSlots: boolean = false;

  static getPlayerSlotToTransform(): {
    [key: number]: {
      pos: [x: number, y: number, z: number] | Vector;
      rot: [pitch: number, yaw: number, roll: number] | Rotator;
    };
  } {
    const playerSlotToTransform: {
      [key: number]: {
        pos: [x: number, y: number, z: number] | Vector;
        rot: [pitch: number, yaw: number, roll: number] | Rotator;
      };
    } = {};
    for (const playerSeat of TI4.playerSeats.getAllSeats()) {
      const playerSlot: number = playerSeat.playerSlot;
      const pos: Vector = playerSeat.cardHolder.getPosition().add([0, 0, 4]);
      pos.x = pos.x * 0.75; // move toward middle
      const rot: Rotator = new Rotator(0, 0, 0);
      playerSlotToTransform[playerSlot] = {
        pos,
        rot,
      };
    }
    return playerSlotToTransform;
  }

  constructor(
    createAbstractUI: CreateAbstractUIType,
    namespaceId: NamespaceId | undefined,
    windowTitle: string
  ) {
    this._createAbstractUI = createAbstractUI;
    this._namespaceId = namespaceId;

    const defaultParams: CreateAbstractUIParams = {
      playerSlot: -1,
      scale: 1,
    };
    const defaultUi: AbstractUI = createAbstractUI(defaultParams);
    const defaultSize: UI_SIZE = defaultUi.getSize();
    defaultUi.destroy();

    const windowWidgetGenerator = (): IWindowWidget => {
      return new (class implements IWindowWidget {
        private _abstractUi: AbstractUI | undefined;

        create(params: WindowWidgetParams): Widget {
          const abstractUiParams: CreateAbstractUIParams = {
            playerSlot: params.playerSlot,
            scale: params.scale,
          };
          this._abstractUi = createAbstractUI(abstractUiParams);
          return this._abstractUi.getWidget();
        }

        destroy(): void {
          if (this._abstractUi) {
            this._abstractUi.destroy();
          }
          this._abstractUi = undefined;
        }
      })();
    };

    this._windowParams = {
      size: {
        width: defaultSize.w,
        height: defaultSize.h,
      },
      windowWidgetGenerator,

      title: windowTitle,
      defaultTarget: "screen",
      // Use u=0.814 to see turn order.
      screen: { anchor: { u: 1, v: 0 }, pos: { u: 0.97, v: 0.05 } },

      world: {
        anchor: {
          u: 0.5,
          v: 0.5,
        },
        playerSlotToTransform: AbstractWindow.getPlayerSlotToTransform(),
      },
    };
  }

  invalidateSize(): void {
    const defaultParams: CreateAbstractUIParams = {
      playerSlot: -1,
      scale: 1,
    };
    const defaultUi: AbstractUI = this._createAbstractUI(defaultParams);
    const defaultSize: UI_SIZE = defaultUi.getSize();
    defaultUi.destroy();

    this._windowParams.size = {
      width: defaultSize.w,
      height: defaultSize.h,
    };
  }

  allSlots(): this {
    this._allSlots = true;
    return this;
  }

  getMutableWindowParams(): WindowParams {
    return this._windowParams;
  }

  moveWindowLeftOfTurnOrder(): this {
    if (this._windowParams.screen) {
      this._windowParams.screen.pos.u = 0.814;
    }
    return this;
  }

  createWindow(playerSlots?: Array<number>): Window {
    if (!playerSlots) {
      playerSlots = TI4.playerSeats
        .getAllSeats()
        .map((seat) => seat.playerSlot);
    }

    if (this._allSlots) {
      playerSlots = new Array<number>(20).fill(0).map((_, i) => i);
    }

    return new Window(this._windowParams, playerSlots, this._namespaceId);
  }
}
