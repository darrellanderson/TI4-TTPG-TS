"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScptDraftsUi = void 0;
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const config_1 = require("../../config/config");
const long_label_ui_1 = require("../../button-ui/long-label-ui");
const scpt_draft_button_ui_1 = require("./scpt-draft-button-ui");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
const scpt_2025_1 = require("../../../lib/draft-lib/scpt/scpt-2025/scpt-2025");
const scpt_2024_1 = require("../../../lib/draft-lib/scpt/scpt-2024/scpt-2024");
const scpt_2023_1 = require("../../../lib/draft-lib/scpt/scpt-2023/scpt-2023");
const scpt_2022_1 = require("../../../lib/draft-lib/scpt/scpt-2022/scpt-2022");
const scpt_2021_1 = require("../../../lib/draft-lib/scpt/scpt-2021/scpt-2021");
class ScptDraftsUi extends abtract_ui_1.AbstractUI {
    static getScptDrafts() {
        return [
            new scpt_2025_1.Scpt2025(),
            new scpt_2024_1.Scpt2024(),
            new scpt_2023_1.Scpt2023(),
            new scpt_2022_1.Scpt2022(),
            new scpt_2021_1.Scpt2021(),
        ];
    }
    constructor(scale, overrideHeight, onDraftStarted) {
        const scaledWidth = (config_1.CONFIG.BUTTON_WIDTH * 2 + config_1.CONFIG.SPACING * 2) * scale;
        const label = new long_label_ui_1.LongLabelUI(scaledWidth, scale);
        label
            .getText()
            .setBold(true)
            .setText("SCPT Patreon Tournament Drafts".toUpperCase());
        const abstractDrafts = ScptDraftsUi.getScptDrafts();
        const uis = abstractDrafts.map((abstractScpt) => {
            return new scpt_draft_button_ui_1.ScptDraftButtonUI(scale, abstractScpt.getScptDraftParams(), onDraftStarted);
        });
        uis.unshift(label);
        const ui = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .setOverrideHeight(overrideHeight)
            .addUIs(uis)
            .build();
        super(ui.getWidget(), ui.getSize());
    }
}
exports.ScptDraftsUi = ScptDraftsUi;
//# sourceMappingURL=scpt-drafts-ui.js.map