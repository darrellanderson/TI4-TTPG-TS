import { Card, ImageWidget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";
import { ZoomableUI } from "../../zoomable-ui/zoomable-ui";

export class UnzoomedAgendaCardUI extends AbstractUI {
  constructor(agendaCard: Card, scale: number) {
    const numRows: number = 7;
    const h: number =
      CONFIG.BUTTON_HEIGHT * numRows * scale +
      CONFIG.SPACING * (numRows - 1) * scale;

    const size: UI_SIZE = {
      w: (h * 500) / 750,
      h,
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
