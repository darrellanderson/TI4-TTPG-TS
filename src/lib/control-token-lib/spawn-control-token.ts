import { GameObject } from "@tabletop-playground/api";
import { Faction } from "lib/faction-lib/faction/faction";
import { Spawn } from "ttpg-darrell";

export class SpawnControlToken {
  spawnControlToken(playerSlot: number): GameObject | undefined {
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    if (faction) {
      const nsid: string = faction.getControlTokenNsid();
      const token: GameObject | undefined = Spawn.spawn(nsid);
      if (token) {
        token.setOwningPlayerSlot(playerSlot);
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
