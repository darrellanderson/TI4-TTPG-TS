import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

const CARD_NSID: string = "card.tf-ability:twilights-fall/dimensional-tear";
const ACTION_NAME: string = "*Fetch Tear Tokens";
const TOKEN_NSIDS: Array<string> = [
  "token.attachment.system:pok/dimensional-tear.vuilraith",
  "token.attachment.system:pok/dimensional-tear.vuilraith",
  "token.attachment.system:pok/dimensional-tear.vuilraith",
];

/**
 * Systems that contain your space docks are also gravity rifts.
 */
export class TFDimensionalTear extends AbstractRightClickCard {
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
