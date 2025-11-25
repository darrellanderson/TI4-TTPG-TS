import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

const CARD_NSID: string = "card.tf-unit-upgrade:twilights-fall/ahk-syl-fier";
const ACTION_NAME: string = "*Fetch Creuss Wormholes";
const TOKEN_NSIDS: Array<string> = [
  "token.attachment.system:base/wormhole-alpha.creuss",
  "token.attachment.system:base/wormhole-beta.creuss",
  "token.attachment.system:pok/wormhole-gamma.creuss",
];

/**
 * Creuss Cruiser: at the start of your turn, you may place or move a Creuss wormhole token into this system.
 */
export class TFAhkSylFier extends AbstractRightClickCard {
  constructor() {
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_NAME) {
        this._fetchToken(object);
      }
    };
    super(CARD_NSID, ACTION_NAME, customActionHandler);
  }

  _fetchToken(object: GameObject): void {
    const pos: Vector = object.getPosition().add([0, 0, 10]);
    for (const nsid of TOKEN_NSIDS) {
      const token: GameObject | undefined = TI4.spawn.spawn(nsid, pos);
      token?.snapToGround();
    }
  }
}
