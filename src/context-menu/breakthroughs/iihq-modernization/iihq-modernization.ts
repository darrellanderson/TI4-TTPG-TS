import { Card, GameObject, Player, Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard, CardUtil } from "ttpg-darrell";

export const ACTION_IIHQ_MODERNIZATION: string =
  "*Fetch planet/legendary cards";

/**
 * Fetch Custodia Vigilia planet and legendary cards.
 */
export class RightClickIihqModernizationBT extends AbstractRightClickCard {
  constructor() {
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_IIHQ_MODERNIZATION) {
        this._fetchPlanetAndLegendaryCards(object, player);
      }
    };
    super(
      "card.breakthrough:thunders-edge/iihq-modernization",
      ACTION_IIHQ_MODERNIZATION,
      customActionHandler
    );
  }

  _fetchPlanetAndLegendaryCards(object: GameObject, _player: Player): void {
    const cardUtil: CardUtil = new CardUtil();
    const above: Vector = object.getPosition().add(new Vector(0, 0, 3));

    const planetCard: Card | undefined = cardUtil.fetchCard(
      "card.planet:codex.vigil/custodia-vigilia"
    );
    if (planetCard) {
      planetCard.setPosition(above);
      planetCard.snapToGround();
    }

    const legendaryCard: Card | undefined = cardUtil.fetchCard(
      "card.legendary-planet:codex.vigil/custodia-vigilia"
    );
    if (legendaryCard) {
      legendaryCard.setPosition(above);
      legendaryCard.snapToGround();
    }
  }
}
