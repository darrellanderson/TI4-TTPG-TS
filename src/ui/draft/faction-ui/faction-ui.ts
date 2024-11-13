import {
  HorizontalAlignment,
  HorizontalBox,
  ImageWidget,
  LayoutBox,
  Text,
  Widget,
} from "@tabletop-playground/api";
import { Faction } from "../../../lib/faction-lib/faction/faction";

const BOX_W: number = 220;
const BOX_H: number = 58;
const FONT_SIZE: number = BOX_H * 0.42;
const SPACING: number = BOX_H * 0.1;

export class FactionUI {
  private readonly _width: number;
  private readonly _height: number;
  private readonly _fontSize: number;
  private readonly _spacing: number;

  constructor(scale: number) {
    this._width = BOX_W * scale;
    this._height = BOX_H * scale;
    this._fontSize = FONT_SIZE * scale;
    this._spacing = SPACING * scale;
  }

  getSize(): { w: number; h: number } {
    return { w: this._width, h: this._height };
  }

  getWidget(faction: Faction): Widget {
    const s: number = this._height - this._spacing * 2;
    const icon: Widget = new ImageWidget()
      .setImageSize(s, s)
      .setImage(faction.getIcon(), faction.getIconPackageId());

    const name: Widget = new Text()
      .setBold(true)
      .setFontSize(this._fontSize)
      .setText(faction.getAbbr().toUpperCase());

    const panel: Widget = new HorizontalBox()
      .setChildDistance(this._spacing)
      .addChild(icon)
      .addChild(name);

    return new LayoutBox()
      .setOverrideWidth(this._width)
      .setOverrideHeight(this._height)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setVerticalAlignment(HorizontalAlignment.Center)
      .setChild(panel);
  }
}
