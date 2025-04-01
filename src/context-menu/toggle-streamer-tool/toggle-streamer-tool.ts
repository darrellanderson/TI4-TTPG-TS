import { IGlobal, NamespaceId } from "ttpg-darrell";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import { StreamerUI } from "../../ui/streamer-ui/streamer-ui";

export class ToggleStreamerTool implements IGlobal {
  init(): void {
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new StreamerUI(params.scale);
    };

    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "Streamer Tool";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
    abstractWindow.createWindow();
  }
}
