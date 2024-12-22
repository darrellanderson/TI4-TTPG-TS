import { Widget } from "@tabletop-playground/api";
import {
  IWindowWidget,
  NamespaceId,
  Window,
  WindowParams,
  WindowWidgetParams,
} from "ttpg-darrell";

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

export type CreateAbstractUIType = (scale: number) => AbstractUI;

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
    namespaceId: NamespaceId | undefined
  ) {
    this._namespaceId = namespaceId;

    const defaultUi: AbstractUI = createAbstractUI(1);
    const defaultSize: UI_SIZE = defaultUi.getSize();
    defaultUi.destroy();

    const windowWidgetGenerator = (): IWindowWidget => {
      return new (class implements IWindowWidget {
        private _abstractUi: AbstractUI | undefined;

        create(params: WindowWidgetParams): Widget {
          this._abstractUi = createAbstractUI(params.scale);
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

      title: "Test Window",
      defaultTarget: "screen",
      // Use u 0.814 to see turn order.
      screen: { anchor: { u: 1, v: 0 }, pos: { u: 0.99, v: 0.01 } },
    };
  }

  createWindow(): Window {
    const playerSlots: Array<number> = [10];
    return new Window(this._windowParams, playerSlots, this._namespaceId);
  }
}
