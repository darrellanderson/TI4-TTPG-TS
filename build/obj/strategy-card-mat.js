"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const initiative_order_1 = require("../lib/strategy-card-lib/initiative-order/initiative-order");
const place_tgs_unpicked_1 = require("../lib/strategy-card-lib/place-tgs-unpicked/place-tgs-unpicked");
const return_strategy_card_1 = require("../lib/strategy-card-lib/return-strategy-card/return-strategy-card");
const ready_lib_1 = require("../lib/ready-lib/ready-lib");
const deal_action_cards_1 = require("../lib/action-card-lib/deal-action-cards/deal-action-cards");
const refresh_all_planets_1 = require("../lib/system-lib/planet/refresh-all-planets");
const return_command_tokens_1 = require("../lib/command-token-lib/return-command-tokens/return-command-tokens");
const add_command_tokens_1 = require("../lib/command-token-lib/add-command-tokens/add-command-tokens");
const ACTION_REFRESH_ALL_PLANET_CARDS = "*Refresh all planet cards";
const ACTION_PLACE_TGS = "*Place TGs and set turns";
const ACTION_DEAL_ACTION_CARDS_AND_COMMAND_TOKENS = "*Deal action cards, command tokens";
const ACTION_RETURN_STRATEGY_CARDS = "*Return strategy cards";
api_1.refObject.addCustomAction(ACTION_REFRESH_ALL_PLANET_CARDS);
api_1.refObject.addCustomAction(ACTION_PLACE_TGS);
api_1.refObject.addCustomAction(ACTION_DEAL_ACTION_CARDS_AND_COMMAND_TOKENS);
api_1.refObject.addCustomAction(ACTION_RETURN_STRATEGY_CARDS);
// Watch out for multiple players using the action at the same time.
const MIN_DELAY_BETWEEN_REPEATS = 3000; // msecs
let _lastRefreshAllPlanetCardsTimestamp = 0;
let _lastPlaceTgsTimestamp = 0;
let _lastDealActionCardsTimestamp = 0;
let _lastReturnStrategyCardsTimestamp = 0;
const _initiativeOrder = new initiative_order_1.InitiativeOrder();
const _placeTGsUnpicked = new place_tgs_unpicked_1.PlaceTgsUnpicked();
const _dealActionCards = new deal_action_cards_1.DealActionCards();
const _returnStrategyCards = new return_strategy_card_1.ReturnStrategyCard();
const _readyLib = new ready_lib_1.ReadyLib();
const _refreshAllPlanets = new refresh_all_planets_1.RefreshAllPlanets();
const _returnCommandTokens = new return_command_tokens_1.ReturnCommandTokens();
const _addCommandTokens = new add_command_tokens_1.AddCommandTokens();
api_1.refObject.onCustomAction.add((_obj, player, identifier) => {
    const playerName = TI4.playerName.getByPlayer(player);
    const playerColor = api_1.world.getSlotColor(player.getSlot());
    const now = Date.now();
    // Refresh all planet cards.
    if (identifier === ACTION_REFRESH_ALL_PLANET_CARDS &&
        now - _lastRefreshAllPlanetCardsTimestamp > MIN_DELAY_BETWEEN_REPEATS) {
        _lastRefreshAllPlanetCardsTimestamp = now;
        _refreshAllPlanets.refresh(false);
        const msg = `${playerName} refreshed all planet cards`;
        ttpg_darrell_1.Broadcast.chatAll(msg, playerColor);
    }
    // Place TGs and set turns.
    if (identifier === ACTION_PLACE_TGS &&
        now - _lastPlaceTgsTimestamp > MIN_DELAY_BETWEEN_REPEATS) {
        _lastPlaceTgsTimestamp = now;
        _initiativeOrder.setTurnOrderFromStrategyCards();
        _placeTGsUnpicked.placeTgsUnpicked();
        const msg = `${playerName} placed TGs and set turns`;
        ttpg_darrell_1.Broadcast.chatAll(msg, playerColor);
    }
    // Deal action cards.
    else if (identifier === ACTION_DEAL_ACTION_CARDS_AND_COMMAND_TOKENS &&
        now - _lastDealActionCardsTimestamp > MIN_DELAY_BETWEEN_REPEATS) {
        _lastDealActionCardsTimestamp = now;
        _dealActionCards.dealAllActionCards();
        _returnCommandTokens.returnAllCommandTokens(); // return before add
        _readyLib.readyAll();
        _refreshAllPlanets.refresh(true);
        _addCommandTokens.addAllCommandTokens();
        const msg = `${playerName} dealt action cards, command tokens`;
        ttpg_darrell_1.Broadcast.chatAll(msg, playerColor);
    }
    // Return strategy cards.
    if (identifier === ACTION_RETURN_STRATEGY_CARDS &&
        now - _lastReturnStrategyCardsTimestamp > MIN_DELAY_BETWEEN_REPEATS) {
        _lastReturnStrategyCardsTimestamp = now;
        _returnStrategyCards.returnAllStrategyCardsRespecingPoliticalStability();
        const msg = `${playerName} returned strategy cards`;
        ttpg_darrell_1.Broadcast.chatAll(msg, playerColor);
    }
});
// Add the UI.
const SCALE = 2;
const _title = new api_1.Text()
    .setFontSize(26 * SCALE)
    .setText("TWILIGHT IMPERIUM")
    .setJustification(api_1.TextJustification.Center)
    .setFont("ambroise-firmin-bold.otf", api_1.refPackageId);
const _uiElement = new api_1.UIElement();
_uiElement.zoomVisibility = api_1.UIZoomVisibility.Both;
_uiElement.anchorY = 0;
_uiElement.position = new api_1.Vector(0, 12, 0.15);
_uiElement.rotation = new api_1.Rotator(0, 90, 0);
_uiElement.widget = _title;
_uiElement.scale = 1 / SCALE;
const obj = api_1.refObject;
process.nextTick(() => {
    obj.addUI(_uiElement);
});
//# sourceMappingURL=strategy-card-mat.js.map