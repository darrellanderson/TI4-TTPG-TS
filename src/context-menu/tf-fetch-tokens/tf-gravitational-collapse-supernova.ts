import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard } from "ttpg-darrell";

const CARD_NSID: string = "card.tf-paradigm:twilights-fall/gravitational-collapse";
const ACTION_NAME: string = "*Fetch Supernova";
const TILE_NSID: string = "tile.system:pok/81";

export class TFGravitationalCollapseSupernova extends AbstractRightClickCard {
  constructor() {
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_NAME) {
        this._fetchTile(object);
      }
    };
    super(CARD_NSID, ACTION_NAME, customActionHandler);
  }

  _fetchTile(object: GameObject): void {
    const pos: Vector = object.getPosition().add([0, 0, 10]);
    const tile: GameObject | undefined = TI4.spawn.spawn(TILE_NSID, pos);
    tile?.snapToGround();
  }
}
