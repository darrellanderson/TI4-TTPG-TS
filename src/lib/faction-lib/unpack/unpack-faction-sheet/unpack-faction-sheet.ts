import { GameObject, ObjectType, Vector } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { DeletedItemsContainer, Find, Spawn } from "ttpg-darrell";

const GENERIC_FACTION_SHEET_NSID: string = "sheet.faction:base/generic";

export class UnpackFactionSheet extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const skipContained: boolean = true;
    const generic: GameObject | undefined = this._find.findGameObject(
      GENERIC_FACTION_SHEET_NSID,
      this.getPlayerSlot(),
      skipContained
    );
    if (!generic) {
      throw new Error(
        `Could not find generic faction sheet for ${this.getPlayerSlot()}`
      );
    }
    const pos: Vector = generic.getPosition().add([0, 0, 10]);

    const nsid: string = this.getFaction().getFactionSheetNsid();
    const factionSheet: GameObject = Spawn.spawnOrThrow(nsid, pos);
    factionSheet.setOwningPlayerSlot(this.getPlayerSlot());

    DeletedItemsContainer.destroyWithoutCopying(generic);
    factionSheet.snapToGround();
  }

  remove(): void {
    const skipContained: boolean = true;
    const factionSheet: GameObject | undefined = this._find.findGameObject(
      this.getFaction().getFactionSheetNsid(),
      this.getPlayerSlot(),
      skipContained
    );
    if (!factionSheet) {
      throw new Error(
        `Could not find faction sheet for ${this.getPlayerSlot()}`
      );
    }
    const pos: Vector = factionSheet.getPosition().add([0, 0, 10]);

    const nsid: string = GENERIC_FACTION_SHEET_NSID;
    const generic: GameObject = Spawn.spawnOrThrow(nsid, pos);
    generic.setOwningPlayerSlot(this.getPlayerSlot());

    DeletedItemsContainer.destroyWithoutCopying(factionSheet);
    generic.snapToGround();
    generic.setObjectType(ObjectType.Ground);
  }
}
