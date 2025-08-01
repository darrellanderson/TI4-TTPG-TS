import {
  Container,
  GameObject,
  Player,
  Vector,
} from "@tabletop-playground/api";
import { AbstractRightClickCard, Find } from "ttpg-darrell";

export const ACTION_FETCH_STELLAR_CONVERTER: string =
  "*Fetch Stellar Converter Token";

export const STELLAR_CONVERTER_NSID: string =
  "card.relic:pok/stellar-converter";
export const STELLAR_CONVERTER_TOKEN_NSID: string =
  "token.attachment.planet:pok/stellar-converter";

export class RightClickStellarConverter extends AbstractRightClickCard {
  constructor() {
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_FETCH_STELLAR_CONVERTER) {
        const pos: Vector = object.getPosition().add([0, 0, 3]);
        this.fetchNanoForgeToken(pos);
      }
    };
    super(
      STELLAR_CONVERTER_NSID,
      ACTION_FETCH_STELLAR_CONVERTER,
      customActionHandler
    );
  }

  fetchNanoForgeToken(pos: Vector): void {
    const find: Find = new Find();
    const token: GameObject | undefined = find.findGameObject(
      STELLAR_CONVERTER_TOKEN_NSID
    );
    if (token) {
      const container: Container | undefined = token.getContainer();
      if (container) {
        container.take(token, pos);
      }
      token.setPosition(pos);
      token.snapToGround();
    }
  }
}
