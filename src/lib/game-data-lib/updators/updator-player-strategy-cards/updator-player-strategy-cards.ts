import { GameObject, Vector, world } from "@tabletop-playground/api";
import {
  GameData,
  PerPlayerGameData,
} from "lib/game-data-lib/game-data/game-data";
import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
import { Atop, Facing, Find, NSID, PlayerSlot } from "ttpg-darrell";

export class UpdatorPlayerStrategyCards implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData): void {
    const matNsid: string = "mat:base/strategy-card";
    const owningPlayerSlot: PlayerSlot | undefined = undefined;
    const skipContained: boolean = true;
    const strategyCardMat: GameObject | undefined = this._find.findGameObject(
      matNsid,
      owningPlayerSlot,
      skipContained
    );
    if (strategyCardMat === undefined) {
      return;
    }
    const atopStrategyCardMat: Atop = new Atop(strategyCardMat);

    const playerSlotToStrategyCards: Map<
      PlayerSlot,
      Array<GameObject>
    > = new Map();
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const pos: Vector = obj.getPosition();
      if (
        nsid.startsWith("tile.strategy-card:") &&
        !atopStrategyCardMat.isAtop(pos)
      ) {
        const playerSlot: PlayerSlot =
          this._find.closestOwnedCardHolderOwner(pos);
        let strategyCards: Array<GameObject> | undefined =
          playerSlotToStrategyCards.get(playerSlot);
        if (strategyCards === undefined) {
          strategyCards = [];
          playerSlotToStrategyCards.set(playerSlot, strategyCards);
        }
        strategyCards.push(obj);
      }
    }

    gameData.players.forEach((player: PerPlayerGameData, seatIndex: number) => {
      const playerSlot: PlayerSlot =
        TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
      const strategyCards: Array<GameObject> =
        playerSlotToStrategyCards.get(playerSlot) ?? [];
      player.strategyCards = strategyCards.map((obj: GameObject): string => {
        return obj.getName();
      });
      player.strategyCardsFaceDown = strategyCards
        .filter((obj: GameObject): boolean => {
          const isFaceUp: boolean = Facing.isFaceUp(obj);
          return !isFaceUp;
        })
        .map((obj: GameObject): string => {
          return obj.getName();
        });
    });
  }
}
