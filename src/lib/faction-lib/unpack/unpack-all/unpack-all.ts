import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";

import { UnpackControlTokens } from "../unpack-control-tokens/unpack-control-tokens";
import { UnpackCommandTokens } from "../unpack-command-tokens/unpack-command-tokens";
import { UnpackFactionSheet } from "../unpack-faction-sheet/unpack-faction-sheet";
import { UnpackFactionTech } from "../unpack-faction-tech/unpack-faction-tech";

export class UnpackAll extends AbstractUnpack {
  private readonly _unpacks: Array<AbstractUnpack>;

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);

    this._unpacks = [
      new UnpackCommandTokens(faction, playerSlot),
      new UnpackControlTokens(faction, playerSlot),
      new UnpackFactionSheet(faction, playerSlot),
      new UnpackFactionTech(faction, playerSlot),
    ];
  }

  unpack(): void {
    for (const unpack of this._unpacks) {
      unpack.unpack();
    }
  }

  remove(): void {
    for (const unpack of this._unpacks) {
      unpack.remove();
    }
  }
}
