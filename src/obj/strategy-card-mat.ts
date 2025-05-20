import {
  Color,
  GameObject,
  Player,
  Rotator,
  Text,
  TextJustification,
  UIElement,
  UIZoomVisibility,
  Vector,
  refObject,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { Broadcast } from "ttpg-darrell";

import { InitiativeOrder } from "../lib/strategy-card-lib/initiative-order/initiative-order";
import { PlaceTgsUnpicked } from "../lib/strategy-card-lib/place-tgs-unpicked/place-tgs-unpicked";
import { ReturnStrategyCard } from "../lib/strategy-card-lib/return-strategy-card/return-strategy-card";
import { ReadyLib } from "../lib/ready-lib/ready-lib";
import { DealActionCards } from "../lib/action-card-lib/deal-action-cards/deal-action-cards";
import { RefreshAllPlanets } from "../lib/system-lib/planet/refresh-all-planets";

const ACTION_REFRESH_ALL_PLANET_CARDS = "*Refresh all planet cards";
const ACTION_PLACE_TGS = "*Place TGs and set turns";
const ACTION_DEAL_ACTION_CARDS = "*Deal action cards";
const ACTION_RETURN_STRATEGY_CARDS = "*Return strategy cards";

refObject.addCustomAction(ACTION_REFRESH_ALL_PLANET_CARDS);
refObject.addCustomAction(ACTION_PLACE_TGS);
refObject.addCustomAction(ACTION_DEAL_ACTION_CARDS);
refObject.addCustomAction(ACTION_RETURN_STRATEGY_CARDS);

// Watch out for multiple players using the action at the same time.
const MIN_DELAY_BETWEEN_REPEATS: number = 3000; // msecs
let _lastRefreshAllPlanetCardsTimestamp: number = 0;
let _lastPlaceTgsTimestamp: number = 0;
let _lastDealActionCardsTimestamp: number = 0;
let _lastReturnStrategyCardsTimestamp: number = 0;

const _initiativeOrder: InitiativeOrder = new InitiativeOrder();
const _placeTGsUnpicked: PlaceTgsUnpicked = new PlaceTgsUnpicked();
const _dealActionCards: DealActionCards = new DealActionCards();
const _returnStrategyCards: ReturnStrategyCard = new ReturnStrategyCard();
const _readyLib: ReadyLib = new ReadyLib();
const _refreshAllPlanets: RefreshAllPlanets = new RefreshAllPlanets();

refObject.onCustomAction.add(
  (_obj: GameObject, player: Player, identifier: string) => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const playerColor: Color = world.getSlotColor(player.getSlot());

    const now: number = Date.now();

    // Refresh all planet cards.
    if (
      identifier === ACTION_REFRESH_ALL_PLANET_CARDS &&
      now - _lastRefreshAllPlanetCardsTimestamp > MIN_DELAY_BETWEEN_REPEATS
    ) {
      _lastRefreshAllPlanetCardsTimestamp = now;

      _refreshAllPlanets.refresh();

      const msg: string = `${playerName} refreshed all planet cards`;
      Broadcast.chatAll(msg, playerColor);
    }

    // Place TGs and set turns.
    if (
      identifier === ACTION_PLACE_TGS &&
      now - _lastPlaceTgsTimestamp > MIN_DELAY_BETWEEN_REPEATS
    ) {
      _lastPlaceTgsTimestamp = now;

      _initiativeOrder.setTurnOrderFromStrategyCards();
      _placeTGsUnpicked.placeTgsUnpicked();

      const msg: string = `${playerName} placed TGs and set turns`;
      Broadcast.chatAll(msg, playerColor);
    }

    // Deal action cards.
    else if (
      identifier === ACTION_DEAL_ACTION_CARDS &&
      now - _lastDealActionCardsTimestamp > MIN_DELAY_BETWEEN_REPEATS
    ) {
      _lastDealActionCardsTimestamp = now;

      _dealActionCards.dealAllActionCards();

      const msg: string = `${playerName} dealt action cards`;
      Broadcast.chatAll(msg, playerColor);
    }

    // Return strategy cards.
    if (
      identifier === ACTION_RETURN_STRATEGY_CARDS &&
      now - _lastReturnStrategyCardsTimestamp > MIN_DELAY_BETWEEN_REPEATS
    ) {
      _lastReturnStrategyCardsTimestamp = now;

      _returnStrategyCards.returnAllStrategyCardsRespecingPoliticalStability();
      _readyLib.readyAll();

      const msg: string = `${playerName} returned strategy cards`;
      Broadcast.chatAll(msg, playerColor);
    }
  }
);

// Add the UI.

const SCALE = 2;

const _title = new Text()
  .setFontSize(26 * SCALE)
  .setText("TWILIGHT IMPERIUM")
  .setJustification(TextJustification.Center)
  .setFont("ambroise-firmin-bold.otf", refPackageId);

const _uiElement = new UIElement();
_uiElement.zoomVisibility = UIZoomVisibility.Both;
_uiElement.anchorY = 0;
_uiElement.position = new Vector(0, 12, 0.15);
_uiElement.rotation = new Rotator(0, 90, 0);
_uiElement.widget = _title;
_uiElement.scale = 1 / SCALE;

refObject.addUI(_uiElement);
