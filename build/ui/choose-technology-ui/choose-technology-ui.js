"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseTechnologyUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const find_player_tech_deck_1 = require("../../lib/tech-lib/find-player-tech-deck/find-player-tech-deck");
const player_tech_summary_1 = require("../../lib/tech-lib/player-tech-summary/player-tech-summary");
const player_with_faction_techs_1 = require("../../lib/tech-lib/player-with-faction-techs/player-with-faction-techs");
const tech_1 = require("../../lib/tech-lib/tech/tech");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
const horizontal_ui_builder_1 = require("../panel/horizontal-ui-builder");
const single_tech_ui_1 = require("./single-tech-ui");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
const tech_card_mutable_ui_1 = require("./tech-card-mutable-ui");
const div_ui_1 = require("../div-ui/div-ui");
const button_ui_1 = require("../button-ui/button-ui");
class ChooseTechnologyUI extends abtract_ui_1.AbstractUI {
    _setCurrentTechSelection(tech) {
        this._currentTechSelection = tech;
    }
    static _getTechColumn(scale, techColor, faction, playerTechSummary, onTechSelected) {
        const techs = new player_with_faction_techs_1.PlayerWithFactionTechs(faction)
            .get()
            .filter((tech) => {
            return tech.getColor() === techColor;
        });
        tech_1.Tech.sortByLevel(techs);
        if (faction) {
            const nsids = techs
                .filter((tech) => {
                return tech.getColor() === "unit-upgrade";
            })
                .map((tech) => {
                return tech.getNsid();
            });
            nsids.sort();
        }
        const uis = techs.map((tech) => {
            const singleTechUi = new single_tech_ui_1.SingleTechUI(scale, tech, faction, playerTechSummary);
            const button = singleTechUi.getButton();
            button.onClicked.add((_button, _player) => {
                onTechSelected(tech);
            });
            return singleTechUi;
        });
        return new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(uis)
            .build();
    }
    constructor(scale, playerSlot) {
        const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
        const playerTechSummary = new player_tech_summary_1.PlayerTechSummary(playerSlot);
        const currentChoice = new tech_card_mutable_ui_1.TechCardMutableUI(scale);
        const selectTechButton = new button_ui_1.ButtonUI(scale);
        selectTechButton.getButton().setText("Draw tech to hand").setEnabled(false);
        const closeButton = new button_ui_1.ButtonUI(scale);
        closeButton.getButton().setText("Close");
        closeButton.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, _player) => {
            TI4.events.onTechChooserRequest.trigger(playerSlot);
        }).get());
        const leftPanel = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .addUIs([currentChoice, selectTechButton, closeButton])
            .build();
        const onTechSelected = (tech) => {
            this._currentTechSelection = tech;
            this._currentChoiceUi.setCardNsid(tech.getNsid());
            selectTechButton.getButton().setEnabled(true);
        };
        const scaledDivHeight = leftPanel.getSize().h;
        const uis = [
            leftPanel,
            new div_ui_1.DivUI(scale, scaledDivHeight, "vertical"),
            ChooseTechnologyUI._getTechColumn(scale, "blue", faction, playerTechSummary, onTechSelected),
            ChooseTechnologyUI._getTechColumn(scale, "green", faction, playerTechSummary, onTechSelected),
            ChooseTechnologyUI._getTechColumn(scale, "red", faction, playerTechSummary, onTechSelected),
            ChooseTechnologyUI._getTechColumn(scale, "yellow", faction, playerTechSummary, onTechSelected),
            ChooseTechnologyUI._getTechColumn(scale, "unit-upgrade", faction, playerTechSummary, onTechSelected),
        ];
        const ui = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(uis)
            .build();
        super(ui.getWidget(), ui.getSize());
        this._onFetchTechClickHandler = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerSlot = player.getSlot();
            const cardHolder = TI4.playerSeats.getCardHolderByPlayerSlot(playerSlot);
            const techDeck = new find_player_tech_deck_1.FindPlayerTechDeck().getTechDeck(playerSlot);
            if (cardHolder && techDeck && this._currentTechSelection) {
                // Look for the tech in the tech deck.
                const nsid = this._currentTechSelection.getNsid();
                const card = new ttpg_darrell_1.CardUtil().filterCards(techDeck, (candidateNsid) => nsid === candidateNsid);
                if (card) {
                    card.setRotation([0, 0, 180]);
                    cardHolder.insert(card, 0);
                    const playerName = TI4.playerName.getByPlayer(player);
                    const techName = this._currentTechSelection.getName();
                    const msg = `${playerName} selected ${techName}`;
                    const color = api_1.world.getSlotColor(playerSlot);
                    ttpg_darrell_1.Broadcast.chatAll(msg, color);
                }
            }
        }).get();
        this._ui = ui;
        this._currentChoiceUi = currentChoice;
        selectTechButton.getButton().onClicked.add(this._onFetchTechClickHandler);
    }
    destroy() {
        this._ui.destroy();
    }
}
exports.ChooseTechnologyUI = ChooseTechnologyUI;
//# sourceMappingURL=choose-technology-ui.js.map