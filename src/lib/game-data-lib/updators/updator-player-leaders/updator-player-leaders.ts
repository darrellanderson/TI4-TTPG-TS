import { Card } from "@tabletop-playground/api";
import { Find, PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { Faction } from "../../../faction-lib/faction/faction";

export class UpdatorPlayerLeaders implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData): void {
    gameData.players.forEach(
      (player: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const faction: Faction | undefined =
          TI4.factionRegistry.getByPlayerSlot(playerSlot);

        let agentActive: boolean = true;
        let commanderActive: boolean = true;
        let heroActive: boolean = true;

        const owningPlayerSlot: PlayerSlot | undefined = undefined;
        const skipContained: boolean = true;

        if (faction) {
          // Agent
          const agentNsids: Array<string> = faction.getAgentNsids();
          for (const nsid of agentNsids) {
            const card: Card | undefined = this._find.findCard(
              nsid,
              owningPlayerSlot,
              skipContained
            );
            if (card && !card.isFaceUp()) {
              agentActive = false;
            }
          }

          // Commander
          const commanderNsids: Array<string> = faction.getCommanderNsids();
          for (const nsid of commanderNsids) {
            const card: Card | undefined = this._find.findCard(
              nsid,
              owningPlayerSlot,
              skipContained
            );
            if (card && !card.isFaceUp()) {
              commanderActive = false;
            }
          }

          // Hero
          const heroNsids: Array<string> = faction.getHeroNsids();
          for (const nsid of heroNsids) {
            const card: Card | undefined = this._find.findCard(
              nsid,
              owningPlayerSlot,
              skipContained
            );
            if (card && !card.isFaceUp()) {
              heroActive = false;
            }
          }
        }

        player.leaders = {
          agent: agentActive ? "unlocked" : "locked",
          commander: commanderActive ? "unlocked" : "locked",
          hero: heroActive ? "unlocked" : "locked",
        };
      }
    );
  }
}
