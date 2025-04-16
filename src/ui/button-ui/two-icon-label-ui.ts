import {
  HorizontalBox,
  ImageWidget,
  LayoutBox,
  Panel,
  RichText,
  VerticalAlignment,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";

export class TwoIconLabel extends AbstractUI {
  private readonly _icon1: ImageWidget;
  private readonly _icon2: ImageWidget;
  private readonly _label: RichText;

  constructor(scale: number) {
    const size: UI_SIZE = {
      w: (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };
    const spacing: number = CONFIG.SPACING * scale;
    const d: number = size.h - spacing * 2;

    const icon1: ImageWidget = new ImageWidget().setImageSize(d, d);
    const icon2: ImageWidget = new ImageWidget().setImageSize(d, d);
    const label: RichText = new RichText().setFontSize(
      CONFIG.FONT_SIZE * scale
    );
    const panel: Panel = new HorizontalBox()
      .setChildDistance(spacing)
      .setVerticalAlignment(VerticalAlignment.Center)
      .addChild(icon1)
      .addChild(icon2)
      .addChild(label);

    const box: LayoutBox = new LayoutBox()
      .setOverrideHeight(size.h)
      .setOverrideWidth(size.w)
      .setChild(panel);
    super(box, size);

    this._icon1 = icon1;
    this._icon2 = icon2;
    this._label = label;
  }

  setIcon1(image: string, packageId: string): this {
    this._icon1.setImage(image, packageId);
    return this;
  }

  setIcon2(image: string, packageId: string): this {
    this._icon2.setImage(image, packageId);
    return this;
  }

  setLabel(text: string): this {
    this._label.setText(text);
    return this;
  }
}
