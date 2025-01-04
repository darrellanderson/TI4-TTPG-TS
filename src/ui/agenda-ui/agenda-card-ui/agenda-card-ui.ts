import { Card, ImageWidget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { ZoomableUI } from "../../zoomable-ui/zoomable-ui";

export class UnzoomedAgendaCardUI extends AbstractUI {
  constructor(agendaCard: Card, scale: number) {
    const size: UI_SIZE = { w: 200 * scale, h: 300 * scale };
    const widget: ImageWidget = new ImageWidget()
      .setImageSize(size.w, size.h)
      .setSourceCard(agendaCard);
    super(widget, size);
  }
}

export class AgendaCardUI extends ZoomableUI {
  constructor(agendaCard: Card, scale: number) {
    const unzoomedUi: AbstractUI = new UnzoomedAgendaCardUI(agendaCard, scale);
    const createZoomedUI = (scale: number): AbstractUI => {
      return new UnzoomedAgendaCardUI(agendaCard, scale * 2);
    };

    super(unzoomedUi, scale, createZoomedUI);
  }
}
