import { IGlobal } from "ttpg-darrell";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import { MapToolUI } from "../../ui/map-tool-ui/map-tool-ui";

export class ToggleMapTool implements IGlobal {
  init(): void {
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new MapToolUI(params.scale);
    };

    const namespaceId = "@context-menu/toggle-map-tool";
    const windowTitle: string = "Map Tool";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
    abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale(
      "tooltip.toggle-map-tool"
    );

    abstractWindow.createWindow();
  }
}
