import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

const CARD_NSID: string = "card.tf-ability:twilights-fall/telepathic";
const ACTION_NAME: string = "*Fetch Naalu 0";
const TOKEN_NSID: string = "token:base/naalu-zero";

export class TFTelepathicNaalu0 extends AbstractRightClickCard {
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
    const token: GameObject | undefined = TI4.spawn.spawn(TOKEN_NSID, pos);
    token?.snapToGround();
  }
}
