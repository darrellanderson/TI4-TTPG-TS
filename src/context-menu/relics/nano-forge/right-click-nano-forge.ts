import {
  Container,
  GameObject,
  Player,
  Vector,
} from "@tabletop-playground/api";
import { AbstractRightClickCard, Find } from "ttpg-darrell";

export const ACTION_FETCH_NANO_FORGE: string = "*Fetch Nano Forge Token";

export const NANO_FORGE_NSID: string = "card.relic:codex.affinity/nanoforge";
export const NANO_FORGE_TOKEN_NSID: string =
  "token.attachment.planet:codex.affinity/nanoforge";

export class RightClickNanoForge extends AbstractRightClickCard {
  constructor() {
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_FETCH_NANO_FORGE) {
        const pos: Vector = object.getPosition().add([0, 0, 3]);
        this.fetchNanoForgeToken(pos);
      }
    };
    super(NANO_FORGE_NSID, ACTION_FETCH_NANO_FORGE, customActionHandler);
  }

  fetchNanoForgeToken(pos: Vector): void {
    const find: Find = new Find();
    const nanoForgeToken: GameObject | undefined = find.findGameObject(
      NANO_FORGE_TOKEN_NSID
    );
    if (nanoForgeToken) {
      const container: Container | undefined = nanoForgeToken.getContainer();
      if (container) {
        container.take(nanoForgeToken, pos);
      }
      nanoForgeToken.setPosition(pos);
      nanoForgeToken.snapToGround();
    }
  }
}
