import { LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";
import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";

export class AgendaRiderUI extends AbstractUI {
  constructor(agendaState: AgendaState, scale: number) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale * 4 + CONFIG.SPACING * 3 * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h);

    super(box, size);

    agendaState.onAgendaStateChanged.add(() => {});
  }
}
