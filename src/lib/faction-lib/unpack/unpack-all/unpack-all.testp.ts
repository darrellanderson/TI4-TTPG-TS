import { refObject } from "@tabletop-playground/api";
import {
  AbstractUnpackTestP,
  FACTION,
  PLAYER_SLOT,
} from "../abstract-unpack/abstract-unpack.testp";
import { UnpackAll } from "./unpack-all";
import { Faction } from "lib/faction-lib/faction/faction";

new AbstractUnpackTestP(new UnpackAll(FACTION, PLAYER_SLOT));

refObject.addCustomAction("*Cycle All");
refObject.onCustomAction.add((_obj, player, identifier) => {
  if (identifier === "*Cycle All") {
    const factions: Array<Faction> = TI4.factionRegistry.getAllFactions();
    let unpack: UnpackAll | undefined = undefined;

    const runnable = () => {
      if (unpack) {
        player.sendChatMessage(
          "remove " + unpack.getFaction().getName(),
          [1, 1, 1, 1]
        );
        unpack.remove();
        unpack = undefined;
        setTimeout(runnable, 500);
      } else {
        const faction: Faction | undefined = factions.shift();
        if (faction) {
          console.log("CYCLE ALL", faction.getName());
          unpack = new UnpackAll(faction, PLAYER_SLOT);
          player.sendChatMessage(
            "unpack " + unpack.getFaction().getName(),
            [1, 1, 1, 1]
          );
          unpack.unpack();
          setTimeout(runnable, 500);
        }
      }
    };
    process.nextTick(runnable);
  }
});
