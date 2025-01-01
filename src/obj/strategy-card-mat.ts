import {
  Color,
  GameObject,
  Player,
  refObject,
  world,
} from "@tabletop-playground/api";
import { Broadcast } from "ttpg-darrell";

import { InitiativeOrder } from "../lib/strategy-card-lib/initiative-order/initiative-order";
import { PlaceTgsUnpicked } from "../lib/strategy-card-lib/place-tgs-unpicked/place-tgs-unpicked";
import { ReturnStrategyCard } from "../lib/strategy-card-lib/return-strategy-card/return-strategy-card";
import { ReadyLib } from "../lib/ready-lib/ready-lib";

const ACTION_PLACE_TGS = "*Place TGs and set turns";
const ACTION_RETURN_STRATEGY_CARDS = "*Return strategy cards";

refObject.addCustomAction(ACTION_PLACE_TGS);
refObject.addCustomAction(ACTION_RETURN_STRATEGY_CARDS);

const _initiativeOrder: InitiativeOrder = new InitiativeOrder();
const _placeTGsUnpicked: PlaceTgsUnpicked = new PlaceTgsUnpicked();
const _returnStrategyCards: ReturnStrategyCard = new ReturnStrategyCard();
const _readyLib: ReadyLib = new ReadyLib();

refObject.onCustomAction.add(
  (_obj: GameObject, player: Player, identifier: string) => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const playerColor: Color = world.getSlotColor(player.getSlot());

    if (identifier === ACTION_PLACE_TGS) {
      _initiativeOrder.setTurnOrderFromStrategyCards();
      _placeTGsUnpicked.placeTgsUnpicked();

      const msg: string = `${playerName} placed TGs and set turns`;
      Broadcast.chatAll(msg, playerColor);
    } else if (identifier === ACTION_RETURN_STRATEGY_CARDS) {
      _returnStrategyCards.returnAllStrategyCardsRespecingPoliticalStability();
      _readyLib.readyAll();

      const msg: string = `${playerName} returned strategy cards`;
      Broadcast.chatAll(msg, playerColor);
    }
  }
);
