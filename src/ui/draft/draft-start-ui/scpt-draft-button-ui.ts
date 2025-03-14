import {
  Border,
  Canvas,
  Color,
  ContentButton,
  LayoutBox,
  Text,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";

export type ScptDraftType = "qual" | "prelim" | "semi" | "final" | "none";

export type ScptDraftParams = {
  qual: string;
  prelim: string;
  semi: string;
  final: string;
};

/**
 * "YEAR" qual / prelim / semi / final
 */
export class ScptDraftButtonUI extends AbstractUI {
  private readonly _year: string;

  private readonly _label: Text;

  private readonly _fgQual: Text = new Text()
    .setJustification(TextJustification.Center)
    .setText("QUAL");
  private readonly _bgQual: Border = new Border().setChild(this._fgQual);
  private readonly _fgPrelim: Text = new Text()
    .setJustification(TextJustification.Center)
    .setText("PRELIM");
  private readonly _bgPrelim: Border = new Border().setChild(this._fgPrelim);
  private readonly _fgSemi: Text = new Text()
    .setJustification(TextJustification.Center)
    .setText("SEMI");
  private readonly _bgSemi: Border = new Border().setChild(this._fgSemi);
  private readonly _fgFinal: Text = new Text()
    .setJustification(TextJustification.Center)
    .setText("FINAL");
  private readonly _bgFinal: Border = new Border().setChild(this._fgFinal);

  constructor(scale: number, year: string) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const canvas: Canvas = new Canvas();

    const canvasBox: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(canvas);

    super(canvasBox, size);
    this._year = year;

    // Fill canvas.
    const labelRight: number = size.w * 0.4;
    const typeW = (size.w - labelRight) * 0.5;
    const typeH = size.h * 0.5;
    const buttonMid: number = labelRight + typeW;
    const halfH: number = size.h * 0.5;

    const draftTypeFontSize: number = CONFIG.FONT_SIZE * 0.67 * scale;
    this._fgQual.setFontSize(draftTypeFontSize);
    this._fgPrelim.setFontSize(draftTypeFontSize);
    this._fgSemi.setFontSize(draftTypeFontSize);
    this._fgFinal.setFontSize(draftTypeFontSize);

    this._label = new Text()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setJustification(TextJustification.Center)
      .setText(year);
    const labelBox: Widget = new LayoutBox()
      .setOverrideWidth(labelRight)
      .setOverrideHeight(size.h)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(this._label);
    canvas.addChild(labelBox, 0, 0, labelRight, size.h);

    const qualButton: ContentButton = new ContentButton().setChild(
      new LayoutBox()
        .setOverrideWidth(typeW)
        .setOverrideHeight(typeH)
        .setPadding(-4, -4, -4, -4)
        .setChild(this._bgQual)
    );
    canvas.addChild(qualButton, labelRight, 0, typeW, typeH);

    const prelimButton: ContentButton = new ContentButton().setChild(
      new LayoutBox()
        .setOverrideWidth(typeW)
        .setOverrideHeight(typeH)
        .setPadding(-4, -4, -4, -4)
        .setChild(this._bgPrelim)
    );
    canvas.addChild(prelimButton, buttonMid, 0, typeW, typeH);

    const semiButton: ContentButton = new ContentButton().setChild(
      new LayoutBox()
        .setOverrideWidth(typeW)
        .setOverrideHeight(typeH)
        .setPadding(-4, -4, -4, -4)
        .setChild(this._bgSemi)
    );
    canvas.addChild(semiButton, labelRight, halfH, typeW, typeH);

    const finalButton: ContentButton = new ContentButton().setChild(
      new LayoutBox()
        .setOverrideWidth(typeW)
        .setOverrideHeight(typeH)
        .setPadding(-4, -4, -4, -4)
        .setChild(this._bgFinal)
    );
    canvas.addChild(finalButton, buttonMid, halfH, typeW, typeH);

    this.reset("", "none");
  }

  reset(year: string, scptDraftType: ScptDraftType): void {
    const white: Color = new Color(1, 1, 1, 1);
    const black: Color = new Color(0, 0, 0, 1);

    const isYear: boolean = year === this._year;
    let fg: Color;
    let bg: Color;

    if (isYear && scptDraftType === "qual") {
      fg = black;
      bg = white;
    } else {
      fg = white;
      bg = black;
    }
    this._fgQual.setTextColor(fg);
    this._bgQual.setColor(bg);

    if (isYear && scptDraftType === "prelim") {
      fg = black;
      bg = white;
    } else {
      fg = white;
      bg = black;
    }
    this._fgPrelim.setTextColor(fg);
    this._bgPrelim.setColor(bg);

    if (isYear && scptDraftType === "semi") {
      fg = black;
      bg = white;
    } else {
      fg = white;
      bg = black;
    }
    this._fgSemi.setTextColor(fg);
    this._bgSemi.setColor(bg);

    if (isYear && scptDraftType === "final") {
      fg = black;
      bg = white;
    } else {
      fg = white;
      bg = black;
    }
    this._fgFinal.setTextColor(fg);
    this._bgFinal.setColor(bg);
  }
}
