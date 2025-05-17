import { IGlobal, NamespaceId, Window, WindowParams } from "ttpg-darrell";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { StartGameUI } from "../../ui/start-game-ui/start-game-ui";

export class StartGameWindow implements IGlobal {
  init(): void {
    if (TI4.config.timestamp > 0) {
      return; // already started
    }

    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      const ui: AbstractUI = new StartGameUI(params.scale);
      return ui;
    };
    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "Start Game";

    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );

    const windowParams: WindowParams = abstractWindow.getMutableWindowParams();
    windowParams.disableClose = true;
    windowParams.disableWarpScreenWorld = true;

    // Turn order updates with config changes, pops to top of UIs.
    // Center horizontally.
    if (windowParams.screen) {
      windowParams.screen.anchor.u = 0.5;
      windowParams.screen.pos.u = 0.5;
    }

    // Unlike most windows, set this one up for all player slots.
    const playerSlots: Array<number> = Array.from({ length: 20 }, (_e, i) => i);
    const window: Window = abstractWindow.createWindow(playerSlots);

    // Delay this window so other screen UIs can be created first.
    process.nextTick((): void => {
      window.attach();
    });

    TI4.events.onStartGameRequest.add((): void => {
      window.detach();
      window.destroy();
    });
  }
}
