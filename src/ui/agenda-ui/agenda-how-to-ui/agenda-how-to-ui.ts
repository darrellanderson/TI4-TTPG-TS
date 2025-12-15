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
    const c: number = 0.06;
    const widget: Widget = new Border().setColor([c, c, c, 1]).setChild(box);
    super(widget, size);

    // Temporary workaround for rich text: need to set size for bold/etc elements.
    let fontSize: number = Math.round(CONFIG.FONT_SIZE * scale);
    fontSize = Math.max(fontSize, 6);
    fontSize = Math.min(fontSize, 24);

    const msg: string = [
      `[b][size=${fontSize}]Play when[/size][/b] to skip to the next turn (handle the when with the table).`,
      `[b][size=${fontSize}]No whens[/size][/b] to skip your whens this round, you get another chance next round if anyone plays a when.`,
      `[b][size=${fontSize}]Never whens[/size][/b] to skip every time.`,
      "Repeat for afters (right click [b]riders[/b] to assign an outcome), then vote.",
      "You may click early, it will be processed on your turn.",
    ].join(" ");

    const richText: Widget = new RichText()
      .setAutoWrap(true)
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setText(msg);
    box.setChild(richText);
  }
}
