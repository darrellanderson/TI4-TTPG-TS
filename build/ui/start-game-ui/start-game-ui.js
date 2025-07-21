"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartGameUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const config_1 = require("../config/config");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const button_ui_1 = require("../button-ui/button-ui");
const checkbox_ui_1 = require("../button-ui/checkbox-ui");
const horizontal_ui_builder_1 = require("../panel/horizontal-ui-builder");
const label_ui_1 = require("../button-ui/label-ui");
const long_richtext_ui_1 = require("../button-ui/long-richtext-ui");
const slider_with_value_ui_1 = require("../button-ui/slider-with-value-ui");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
const long_label_ui_1 = require("../button-ui/long-label-ui");
const packageId = api_1.refPackageId;
class StartGameUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const scaledWidth = (config_1.CONFIG.BUTTON_WIDTH * 2 + config_1.CONFIG.SPACING) * scale;
        // Temporary workaround for rich text: need to set size for bold/etc elements.
        const fontSize = Math.round(config_1.CONFIG.FONT_SIZE * scale);
        const gameHeader = new long_label_ui_1.LongLabelUI(scaledWidth, scale);
        gameHeader
            .getText()
            .setFont("ambroise-firmin-bold.otf", packageId)
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale * 2.2)
            .setBold(true)
            .setText("TWILIGHT IMPERIUM");
        const TEST_CANDIDATE = new long_label_ui_1.LongLabelUI(scaledWidth, scale);
        TEST_CANDIDATE.getText()
            .setTextColor([1, 0.2, 0, 1])
            .setBold(true)
            .setText("BETA TEST, PLEASE REPORT BUGS");
        const helpInfo = new long_richtext_ui_1.LongRichTextUI(scaledWidth, scale);
        helpInfo
            .getRichText()
            .setText(`New?  Right-click the table, [b][size=${fontSize}]*Toggle Help[/size][/b]`);
        const numPlayersLabel = new label_ui_1.LabelUI(scale);
        numPlayersLabel
            .getText()
            .setJustification(api_1.TextJustification.Right)
            .setText("Number of Players:");
        const numPlayersSlider = new slider_with_value_ui_1.SliderWithValueUI(scale);
        numPlayersSlider
            .getSlider()
            .setMinValue(3)
            .setMaxValue(8)
            .setValue(6)
            .onValueChanged.add((_slider, _player, value) => {
            TI4.config.setPlayerCount(value);
        });
        const is14PointGame = new checkbox_ui_1.CheckBoxUI(scale);
        is14PointGame
            .getCheckBox()
            .setText("14 point game")
            .setIsChecked(TI4.config.gamePoints === 14)
            .onCheckStateChanged.add((_checkBox, _player, isChecked) => {
            TI4.config.setGamePoints(isChecked ? 14 : 10);
        });
        const sendGameData = new checkbox_ui_1.CheckBoxUI(scale);
        sendGameData
            .getCheckBox()
            .setText("Send game data")
            .setIsChecked(TI4.config.exportGameData)
            .onCheckStateChanged.add((_checkBox, _player, isChecked) => {
            TI4.config.setExportGameData(isChecked);
        });
        const sendErrors = new checkbox_ui_1.CheckBoxUI(scale);
        sendErrors
            .getCheckBox()
            .setText("Send error reports")
            .setIsChecked(TI4.config.reportErrors)
            .onCheckStateChanged.add((_checkBox, _player, isChecked) => {
            TI4.config.setReportErrors(isChecked);
        });
        const applySource = (source, enabled) => {
            const sources = TI4.config.sources;
            const index = sources.indexOf(source);
            if (index > -1) {
                sources.splice(index, 1);
            }
            if (enabled) {
                sources.push(source);
            }
            TI4.config.setSources(sources);
        };
        const checkBoxPok = new checkbox_ui_1.CheckBoxUI(scale);
        checkBoxPok
            .getCheckBox()
            .setText("Prophecy of Kings")
            .setIsChecked(TI4.config.sources.includes("pok"))
            .onCheckStateChanged.add((_checkBox, _player, isChecked) => {
            applySource("pok", isChecked);
        });
        /*
        const checkBoxBoxShaped: CheckBoxUI = new CheckBoxUI(scale);
        checkBoxBoxShaped
          .getCheckBox()
          .setText("Box Shaped")
          .setEnabled(false)
          .setIsChecked(TI4.config.sources.includes("box-shaped"))
          .onCheckStateChanged.add(
            (_checkBox: CheckBox, _player: Player, isChecked: boolean): void => {
              applySource("box-shaped", isChecked);
            }
          );
          */
        const checkBoxCodex1 = new checkbox_ui_1.CheckBoxUI(scale);
        checkBoxCodex1
            .getCheckBox()
            .setText("Codex 1: Ordinian")
            .setIsChecked(TI4.config.sources.includes("codex.ordinian"))
            .onCheckStateChanged.add((_checkBox, _player, isChecked) => {
            applySource("codex.ordinian", isChecked);
        });
        const checkBoxCodex2 = new checkbox_ui_1.CheckBoxUI(scale);
        checkBoxCodex2
            .getCheckBox()
            .setText("Codex 2: Affinity")
            .setIsChecked(TI4.config.sources.includes("codex.affinity"))
            .onCheckStateChanged.add((_checkBox, _player, isChecked) => {
            applySource("codex.affinity", isChecked);
        });
        const checkBoxCodex3 = new checkbox_ui_1.CheckBoxUI(scale);
        checkBoxCodex3
            .getCheckBox()
            .setText("Codex 3: Vigil")
            .setIsChecked(TI4.config.sources.includes("codex.vigil"))
            .onCheckStateChanged.add((_checkBox, _player, isChecked) => {
            applySource("codex.vigil", isChecked);
        });
        const checkBoxCodex4 = new checkbox_ui_1.CheckBoxUI(scale);
        checkBoxCodex4
            .getCheckBox()
            .setText("Codex 4: Liberation")
            .setIsChecked(TI4.config.sources.includes("codex.liberation"))
            .onCheckStateChanged.add((_checkBox, _player, isChecked) => {
            applySource("codex.liberation", isChecked);
        });
        const left = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([numPlayersLabel, is14PointGame, sendGameData, sendErrors])
            .build();
        const right = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([
            numPlayersSlider,
            checkBoxPok,
            // checkBoxBoxShaped,
            checkBoxCodex1,
            checkBoxCodex2,
            checkBoxCodex3,
            checkBoxCodex4,
        ])
            .build();
        const config = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([left, right])
            .build();
        const startGameButton = new button_ui_1.ButtonUI(scale);
        startGameButton
            .getButton()
            .setText("Start Game")
            .onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, _player) => {
            // TI4.config has the player count, sources, etc.
            TI4.events.onStartGameRequest.trigger();
        }).get());
        const ui = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .addUIs([gameHeader, TEST_CANDIDATE, config, startGameButton, helpInfo])
            .build();
        super(ui.getWidget(), ui.getSize());
    }
}
exports.StartGameUI = StartGameUI;
//# sourceMappingURL=start-game-ui.js.map