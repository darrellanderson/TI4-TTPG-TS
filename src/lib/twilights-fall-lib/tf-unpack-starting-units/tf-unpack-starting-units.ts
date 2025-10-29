import { GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard, NSID, ParsedNSID } from "ttpg-darrell";
import { Faction } from "../../faction-lib/faction/faction";
import { UnpackStartingUnits } from "../../faction-lib/unpack/unpack-starting-units/unpack-starting-units";

const ACTION_NAME: string = "*TF Unpack starting units";

class RightClickTfUnpackStartingUnits extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.faction-reference:";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_NAME) {
        this._unpackStartingUnits(object, player);
      }
    };
    super(cardNsidPrefix, ACTION_NAME, customActionHandler);
  }

  _unpackStartingUnits(object: GameObject, player: Player): void {
    const nsid: string = NSID.get(object);
    const playerSlot: number = player.getSlot();

    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (parsed) {
      const nsidName: string | undefined = parsed.nameParts[0];
      if (nsidName) {
        const faction: Faction | undefined =
          TI4.factionRegistry.getByNsidName(nsidName);
        if (faction) {
          new TFUnpackStartingUnits(faction, playerSlot).unpack();
        }
      }
    }
  }
}

export class TFUnpackStartingUnits {
  private readonly _faction: Faction;
  private readonly _playerSlot: number;

  static addContextMenuToFactionReferenceCards(): void {
    new RightClickTfUnpackStartingUnits().init();
  }

  constructor(faction: Faction, playerSlot: number) {
    this._faction = faction;
    this._playerSlot = playerSlot;
  }

  unpack(): void {
    new UnpackStartingUnits(this._faction, this._playerSlot).unpack();
  }
}
