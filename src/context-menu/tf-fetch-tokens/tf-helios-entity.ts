import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

const CARD_NSID: string = "card.tf-unit-upgrade:twilights-fall/helios-entity";
const ACTION_NAME: string = "*Fetch Helios Tokens";
const TOKEN_NSIDS: Array<string> = [
  "token.attachment.planet:thunders-edge/helios",
  "token.attachment.planet:thunders-edge/helios",
  "token.attachment.planet:thunders-edge/helios",
];

/**
 * Bastion Space Dock: ... resource value of planet is increased by 2 ...
 */
export class TFHeliosEntity extends AbstractRightClickCard {
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
