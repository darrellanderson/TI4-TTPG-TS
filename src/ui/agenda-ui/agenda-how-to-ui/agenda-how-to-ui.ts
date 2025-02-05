import { Border, LayoutBox, RichText, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";

export class AgendaHowToUI extends AbstractUI {
  constructor(scale: number) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * 5 * scale + CONFIG.SPACING * 4 * scale,
      h: CONFIG.BUTTON_HEIGHT * 2 * scale + CONFIG.SPACING * 1 * scale,
    };
    const box: LayoutBox = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setPadding(
        CONFIG.SPACING * scale,
        CONFIG.SPACING * scale,
        CONFIG.SPACING * scale,
        CONFIG.SPACING * scale
      );
    const widget: Widget = new Border().setColor([1, 0, 0, 1]).setChild(box);
    super(widget, size);

    const msg: string = [
      "Click 'no whens' to skip your whens this round, you get another chance next round if anyone plays a when.",
      "Click 'never whens' to skip every time.",
      "Click 'play when' to skip to the next turn, handle then when with the table.",
      "You may click before your turn, it will be processed when your turn comes.",
      "Repeat for afters, then vote.",
    ].join(" ");

    const richText: Widget = new RichText()
      .setAutoWrap(true)
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setText(msg);
    box.setChild(richText);
  }
}
