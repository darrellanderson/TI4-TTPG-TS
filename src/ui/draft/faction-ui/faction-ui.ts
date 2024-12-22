import {
  HorizontalAlignment,
  HorizontalBox,
  ImageWidget,
  LayoutBox,
  Text,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { AbstractUI } from "../../abstract-ui/abtract-ui";

export const BOX_W: number = 110;
export const BOX_H: number = 30;
export const FONT_SIZE: number = BOX_H * 0.37;
export const SPACING: number = BOX_H * 0.1;

export class FactionUI extends AbstractUI {
  constructor(faction: Faction, scale: number) {
    const factionName: string = faction
      .getAbbr()
      .toUpperCase()
      .replace(" ", "\n");

    const w: number = BOX_W * scale;
    const h: number = BOX_H * scale;

    const fontSize = FONT_SIZE * scale;
    const spacing = SPACING * scale;

    const s: number = h - spacing * 2;
    const icon: Widget = new ImageWidget()
      .setImageSize(s, s)
      .setImage(faction.getIcon(), faction.getIconPackageId());

    const name: Widget = new Text()
      .setBold(true)
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center)
      .setText(factionName);

    const panel: Widget = new HorizontalBox()
      .setChildDistance(spacing)
      .setVerticalAlignment(VerticalAlignment.Center)
      .addChild(icon)
      .addChild(name);

    const widget: Widget = new LayoutBox()
      .setPadding(-100, -100, -10, -10)
      .setOverrideWidth(w)
      .setOverrideHeight(h)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(panel);

    super(widget, { w, h });
  }
}
