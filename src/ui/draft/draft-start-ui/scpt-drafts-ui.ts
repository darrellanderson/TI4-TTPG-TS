import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";
import { LongLabelUI } from "../../button-ui/long-label-ui";
import { ScptDraftButtonUI } from "./scpt-draft-button-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";

import { AbstractScpt } from "../../../lib/draft-lib/scpt/abstract-scpt/abstract-scpt";
import { Scpt2025 } from "../../../lib/draft-lib/scpt/scpt-2025/scpt-2025";
import { Scpt2024 } from "../../../lib/draft-lib/scpt/scpt-2024/scpt-2024";
import { Scpt2023 } from "../../../lib/draft-lib/scpt/scpt-2023/scpt-2023";
import { Scpt2022 } from "../../../lib/draft-lib/scpt/scpt-2022/scpt-2022";
import { Scpt2021 } from "../../../lib/draft-lib/scpt/scpt-2021/scpt-2021";

export class ScptDraftsUi extends AbstractUI {
  static getScptDrafts(): Array<AbstractScpt> {
    return [
      new Scpt2025(),
      new Scpt2024(),
      new Scpt2023(),
      new Scpt2022(),
      new Scpt2021(),
    ];
  }

  constructor(
    scale: number,
    overrideHeight: number,
    onDraftStarted: TriggerableMulticastDelegate<() => void>
  ) {
    const scaledWidth: number =
      (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING * 2) * scale;
    const label: LongLabelUI = new LongLabelUI(scaledWidth, scale);
    label
      .getText()
      .setBold(true)
      .setText("SCPT Patreon Tournament Drafts".toUpperCase());

    const abstractDrafts: Array<AbstractScpt> = ScptDraftsUi.getScptDrafts();

    const uis: Array<AbstractUI> = abstractDrafts.map(
      (abstractScpt: AbstractScpt): AbstractUI => {
        return new ScptDraftButtonUI(
          scale,
          abstractScpt.getScptDraftParams(),
          onDraftStarted
        );
      }
    );
    uis.unshift(label);

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .setOverrideHeight(overrideHeight)
      .addUIs(uis)
      .build();

    super(ui.getWidget(), ui.getSize());
  }
}
