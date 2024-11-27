import {
  HorizontalAlignment,
  HorizontalBox,
  ImageWidget,
  LayoutBox,
  Text,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { AbstractUI } from "../../abstract-ui/abtract-ui";

export const BOX_W: number = 220;
export const BOX_H: number = 58;
export const FONT_SIZE: number = BOX_H * 0.42;
export const SPACING: number = BOX_H * 0.1;

export class FactionUI extends AbstractUI {
  private readonly _faction: Faction;
  private readonly _fontSize: number;
  private readonly _spacing: number;

  constructor(faction: Faction, scale: number) {
    super({ w: BOX_W * scale, h: BOX_H * scale });

    this._faction = faction;
    this._fontSize = FONT_SIZE * scale;
    this._spacing = SPACING * scale;
  }

  getWidget(): Widget {
    const s: number = this._height - this._spacing * 2;
    const icon: Widget = new ImageWidget()
      .setImageSize(s, s)
      .setImage(this._faction.getIcon(), this._faction.getIconPackageId());

    const name: Widget = new Text()
      .setBold(true)
      .setFontSize(this._fontSize)
      .setText(this._faction.getAbbr().toUpperCase());

    const panel: Widget = new HorizontalBox()
      .setChildDistance(this._spacing)
      .addChild(icon)
      .addChild(name);

    return new LayoutBox()
      .setOverrideWidth(this._width)
      .setOverrideHeight(this._height)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(panel);
  }
}
