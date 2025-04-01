import { Color, GameObject } from "@tabletop-playground/api";
import { Spawn } from "ttpg-darrell";
import { Faction } from "../faction-lib/faction/faction";

export class SpawnControlToken {
  spawnControlToken(playerSlot: number): GameObject | undefined {
    const color: Color = TI4.playerColor.getSlotPlasticColorOrThrow(playerSlot);
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    if (color && faction) {
      const nsid: string = faction.getControlTokenNsid();
      const token: GameObject | undefined = Spawn.spawn(nsid);
      if (token) {
        token.setOwningPlayerSlot(playerSlot);
        token.setPrimaryColor(color);
      }
      return token;
    }
  }

  spawnControlTokenOrThrow(playerSlot: number): GameObject {
    const controlToken: GameObject | undefined =
      this.spawnControlToken(playerSlot);
    if (!controlToken) {
      throw new Error(
        `spawnControlTokenOrThrow: no control token for player slot ${playerSlot}`
      );
    }
    return controlToken;
  }
}
