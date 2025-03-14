import {
  Button,
  HorizontalBox,
  LayoutBox,
  Panel,
  Text,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";
import { ConfirmButton } from "ttpg-darrell";
import { IDraft } from "lib/draft-lib/drafts/idraft";

export type ScptDraftParams = {
  label: string;
  qual?: IDraft;
  prelim?: IDraft;
  semi?: IDraft;
  final?: IDraft;
};

/**
 * "YEAR" qual / prelim / semi / final
 */
export class ScptDraftButtonUI extends AbstractUI {
  constructor(scale: number, scptDraftParams: ScptDraftParams) {
    const size: UI_SIZE = {
      w: (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const fontSize: number = CONFIG.FONT_SIZE * scale;

    const label: Widget = new Text()
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center)
      .setText(scptDraftParams.label);
    const labelBox: Widget = new LayoutBox()
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(label);

    const buttonQual: Button = new Button()
      .setFontSize(fontSize)
      .setText("QUAL")
      .setEnabled(scptDraftParams.qual !== undefined);
    const buttonPrelim: Button = new Button()
      .setFontSize(fontSize)
      .setText("PRELIM")
      .setEnabled(scptDraftParams.prelim !== undefined);
    const buttonSemi: Button = new Button()
      .setFontSize(fontSize)
      .setText("SEMI")
      .setEnabled(scptDraftParams.semi !== undefined);
    const buttonFinal: Button = new Button()
      .setFontSize(fontSize)
      .setText("FINAL")
      .setEnabled(scptDraftParams.final !== undefined);

    const confirmQual: Widget = new ConfirmButton(buttonQual).getWidget();
    const confirmPrelim: Widget = new ConfirmButton(buttonPrelim).getWidget();
    const confirmSemi: Widget = new ConfirmButton(buttonSemi).getWidget();
    const confirmFinal: Widget = new ConfirmButton(buttonFinal).getWidget();

    const panel: Panel = new HorizontalBox()
      .setChildDistance(CONFIG.SPACING * scale)
      .addChild(labelBox, 1.3)
      .addChild(confirmQual, 1)
      .addChild(confirmPrelim, 1)
      .addChild(confirmSemi, 1)
      .addChild(confirmFinal, 1);
    const panelBox: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(panel);

    super(panelBox, size);
  }
}
