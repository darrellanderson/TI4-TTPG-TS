import { IGlobal, NamespaceId } from "ttpg-darrell";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import { StreamerToolUI } from "../../ui/streamer-tool-ui/streamer-tool-ui";

export class ToggleStreamerTool implements IGlobal {
  init(): void {
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new StreamerToolUI(params.scale, params.playerSlot);
    };

    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "Streamer Tool";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
    abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale(
      "tooltip.toggle-streamer-tool"
    );

    abstractWindow.addHost().createWindow();
  }
}
