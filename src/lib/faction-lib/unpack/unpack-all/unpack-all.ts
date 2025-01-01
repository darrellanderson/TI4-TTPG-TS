import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";

import { UnpackControlTokens } from "../unpack-control-tokens/unpack-control-tokens";
import { UnpackCommandTokens } from "../unpack-command-tokens/unpack-command-tokens";
import { UnpackFactionAlliance } from "../unpack-faction-alliance/unpack-faction-alliance";
import { UnpackFactionExtras } from "../unpack-faction-extras/unpack-faction-extras";
import { UnpackFactionPromissory } from "../unpack-faction-promissory/unpack-faction-promissory";
import { UnpackFactionSheet } from "../unpack-faction-sheet/unpack-faction-sheet";
import { UnpackFactionTech } from "../unpack-faction-tech/unpack-faction-tech";
import { UnpackHomeSystem } from "../unpack-home-system/unpack-home-system";
import { UnpackLeaders } from "../unpack-leaders/unpack-leaders";
import { UnpackStartingTech } from "../unpack-starting-tech/unpack-starting-tech";
import { UnpackStartingUnits } from "../unpack-starting-units/unpack-starting-units";
import { UnpackHomePlanetCards } from "../unpack-home-planet-cards/unpack-home-planet-cards";

export class UnpackAll extends AbstractUnpack {
  private readonly _unpacks: Array<AbstractUnpack>;

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);

    this._unpacks = [
      new UnpackCommandTokens(faction, playerSlot),
      new UnpackControlTokens(faction, playerSlot),
      new UnpackFactionAlliance(faction, playerSlot),
      new UnpackFactionExtras(faction, playerSlot),
      new UnpackFactionPromissory(faction, playerSlot),
      new UnpackFactionSheet(faction, playerSlot),
      new UnpackFactionTech(faction, playerSlot),
      new UnpackHomeSystem(faction, playerSlot),
      new UnpackLeaders(faction, playerSlot),
      new UnpackStartingTech(faction, playerSlot),
      new UnpackStartingUnits(faction, playerSlot),

      // Do after unpacking home system tile.
      new UnpackHomePlanetCards(faction, playerSlot),
    ];
  }

  unpack(): void {
    for (const unpack of this._unpacks) {
      unpack.unpack();
    }
    TI4.events.onFactionChanged.trigger(this.getPlayerSlot());
  }

  remove(): void {
    for (const unpack of this._unpacks) {
      unpack.remove();
    }
    TI4.events.onFactionChanged.trigger(this.getPlayerSlot());
  }
}
