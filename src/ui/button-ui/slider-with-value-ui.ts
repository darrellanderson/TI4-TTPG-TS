import { LayoutBox, Slider, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";

export class SliderWithValueUI extends AbstractUI {
  private readonly _slider: Slider;

  constructor(scale: number) {
    const slider: Slider = new Slider()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setTextBoxWidth(CONFIG.FONT_SIZE * scale * 4)
      .setStepSize(1)
      .setMaxValue(100);

    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(slider);
    super(box, size);
    this._slider = slider;
  }

  getSlider(): Slider {
    return this._slider;
  }
}
