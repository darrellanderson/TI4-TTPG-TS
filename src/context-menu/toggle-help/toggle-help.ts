import { IGlobal, NamespaceId } from "ttpg-darrell";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import { HelpWithExtrasUI } from "../../ui/help-ui/help-with-extras-ui";

export class ToggleHelp implements IGlobal {
  init(): void {
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new HelpWithExtrasUI(params.scale);
    };

    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "Help";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;

    // Unlike most windows, set this one up for all player slots.
    const playerSlots: Array<number> = Array.from({ length: 20 }, (_e, i) => i);
    abstractWindow.createWindow(playerSlots);
  }
}
