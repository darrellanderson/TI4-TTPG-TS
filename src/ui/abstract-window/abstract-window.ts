import { Widget, world } from "@tabletop-playground/api";
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
  private readonly _namespaceId: NamespaceId | undefined;
  private readonly _windowParams: WindowParams;

  constructor(
    createAbstractUI: CreateAbstractUIType,
    namespaceId: NamespaceId | undefined,
    windowTitle: string
  ) {
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
    };
  }

  getMutableWindowParams(): WindowParams {
    return this._windowParams;
  }

  createWindow(playerSlots?: Array<number>): Window {
    if (!playerSlots) {
      playerSlots = TI4.playerSeats
        .getAllSeats()
        .map((seat) => seat.playerSlot);
    }

    // Add the host player slot.
    let host: number = -1;
    for (const player of world.getAllPlayers()) {
      if (player.isHost()) {
        host = player.getSlot();
        break;
      }
    }
    if (host >= 0 && !playerSlots.includes(host)) {
      playerSlots.push(host);
    }

    return new Window(this._windowParams, playerSlots, this._namespaceId);
  }
}
