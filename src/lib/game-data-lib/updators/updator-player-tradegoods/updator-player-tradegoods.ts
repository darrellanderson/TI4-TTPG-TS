import { Card, GameObject, Vector, world } from "@tabletop-playground/api";
import { Atop, Facing, Find, NSID, PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { Faction } from "../../../faction-lib/faction/faction";

export class UpdatorPlayerTradegoods implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData): void {
    const skipContained: boolean = true;
    const owningPlayerSlot: number | undefined = undefined;

    // Ignore if on the strategy card mat.
    const strategyCardMat: GameObject | undefined = this._find.findGameObject(
      "mat:base/strategy-card",
      owningPlayerSlot,
      skipContained
    );
    let atopStrategyCardMat: Atop | undefined = undefined;
    if (strategyCardMat) {
      atopStrategyCardMat = new Atop(strategyCardMat);
    }

    // Ignore if on artuno the betrayer (nomad agent).
    const artuno: Card | undefined = this._find.findCard(
      "card.leader.agent:pok/artuno-the-betrayer",
      owningPlayerSlot,
      skipContained
    );
    let atopArtuno: Atop | undefined = undefined;
    if (artuno) {
      atopArtuno = new Atop(artuno);
    }

    // Get all tradegoods not atop the strategy card mat or artuno.
    const allTradegoods: Array<GameObject> = [];
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid === "token:base/tradegood-commodity-1" ||
        nsid === "token:base/tradegood-commodity-3"
      ) {
        const pos: Vector = obj.getPosition();
        if (atopStrategyCardMat && atopStrategyCardMat.isAtop(pos)) {
          continue;
        }
        if (atopArtuno && atopArtuno.isAtop(pos)) {
          continue;
        }
        allTradegoods.push(obj);
      }
    }

    // Sort by closest player.
    const playerSlotToTradegoods: Map<
      PlayerSlot,
      Array<GameObject>
    > = new Map();
    allTradegoods.forEach((obj: GameObject): void => {
      const pos: Vector = obj.getPosition();
      const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
      let tradegoods: Array<GameObject> | undefined =
        playerSlotToTradegoods.get(playerSlot);
      if (!tradegoods) {
        tradegoods = [];
        playerSlotToTradegoods.set(playerSlot, tradegoods);
      }
      tradegoods.push(obj);
    });

    gameData.players.forEach(
      (player: PerPlayerGameData, seatIndex: number): void => {
        let commodities: number = 0;
        let tradeGoods: number = 0;
        let maxCommodities: number = 0;

        // Count tradegoods/commodities.
        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const tradegoods: Array<GameObject> =
          playerSlotToTradegoods.get(playerSlot) ?? [];
        tradegoods.forEach((obj: GameObject): void => {
          const nsid: string = NSID.get(obj);
          let value = 0;
          if (nsid === "token:base/tradegood-commodity-1") {
            value = 1;
          } else if (nsid === "token:base/tradegood-commodity-3") {
            value = 3;
          }
          if (Facing.isFaceUp(obj)) {
            commodities += value;
          } else {
            tradeGoods += value;
          }
        });

        // Get max commodities.
        const faction: Faction | undefined =
          TI4.factionRegistry.getByPlayerSlot(playerSlot);
        if (faction) {
          maxCommodities = faction.getCommodities();
        }

        player.commodities = commodities;
        player.tradeGoods = tradeGoods;
        player.maxCommodities = maxCommodities;
      }
    );
  }
}
