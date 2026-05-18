import {
  Button,
  HorizontalBox,
  LayoutBox,
  Panel,
  Player,
  Text,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui";
import { CONFIG } from "../../config/config";
import { DraftActivityStartParams } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { Scpt2026 } from "../../../lib/draft-lib/scpt/scpt-2026/scpt-2026";
import { AbstractScpt } from "../../../lib";
import {
  ThrottleClickHandler,
  TriggerableMulticastDelegate,
} from "ttpg-darrell";

export function getScptSemisUi(
  scale: number,
  onDraftStarted: TriggerableMulticastDelegate<() => void>,
): AbstractUI {
  const size: UI_SIZE = {
    w: (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale,
    h: CONFIG.BUTTON_HEIGHT * scale,
  };
  const fontSize: number = CONFIG.FONT_SIZE * scale;

  const label: Widget = new Text()
    .setFontSize(fontSize)
    .setJustification(TextJustification.Center)
    .setText("Semis#:");
  const labelBox: Widget = new LayoutBox()
    .setVerticalAlignment(VerticalAlignment.Center)
    .setChild(label);

  const panel: Panel = new HorizontalBox()
    .setChildDistance(CONFIG.SPACING * scale)
    .addChild(labelBox, 1.3);

  for (let semisIndex = 0; semisIndex < 6; semisIndex++) {
    const button: Button = new Button()
      .setFontSize(fontSize)
      .setText(`${semisIndex + 1}`);
    panel.addChild(button, 1);

    button.onClicked.add(
      new ThrottleClickHandler<Button>((_button: Button, _player: Player) => {
        const scpt2026: AbstractScpt = new Scpt2026();
        const draftActivityStartParams: DraftActivityStartParams | undefined =
          scpt2026.getSemi(semisIndex);
        if (!draftActivityStartParams) {
          throw new Error("no params");
        }
        onDraftStarted.trigger();
        TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
      }).get(),
    );
  }

  const panelBox: Widget = new LayoutBox()
    .setOverrideWidth(size.w)
    .setOverrideHeight(size.h)
    .setChild(panel);

  return new AbstractUI(panelBox, size);
}
