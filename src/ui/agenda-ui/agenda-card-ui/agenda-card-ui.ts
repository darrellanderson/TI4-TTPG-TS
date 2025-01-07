import { Card, ImageWidget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { ZoomableUI } from "../../zoomable-ui/zoomable-ui";

const CARD_H_PX: number = 300;

export class UnzoomedAgendaCardUI extends AbstractUI {
  constructor(agendaCard: Card, scale: number) {
    const size: UI_SIZE = {
      w: (CARD_H_PX * scale * 500) / 750,
      h: CARD_H_PX * scale,
    };
    const widget: ImageWidget = new ImageWidget()
      .setImageSize(size.w, size.h)
      .setSourceCard(agendaCard);
    super(widget, size);
  }
}

export class AgendaCardUI extends ZoomableUI {
  static _getCreateZoomedUI(agendaCard: Card, scale: number): () => AbstractUI {
    return () => new UnzoomedAgendaCardUI(agendaCard, scale * 2);
  }

  constructor(agendaCard: Card, scale: number) {
    const unzoomedUi: AbstractUI = new UnzoomedAgendaCardUI(agendaCard, scale);
    const createZoomedUI: () => AbstractUI = AgendaCardUI._getCreateZoomedUI(
      agendaCard,
      scale
    );
    super(unzoomedUi, scale, createZoomedUI);
  }
}
