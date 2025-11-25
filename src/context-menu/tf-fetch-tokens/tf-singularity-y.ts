import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

const CARD_NSID: string = "card.tf-ability:twilights-fall/singularity-y";
const ACTION_NAME: string = "*Fetch Singularity Token";
const TOKEN_NSID: string = "token:base/nekro-y";

export class TFSingularityY extends AbstractRightClickCard {
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
