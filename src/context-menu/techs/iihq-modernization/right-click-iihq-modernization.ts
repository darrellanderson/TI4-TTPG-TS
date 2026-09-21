import { Card, GameObject, Player, Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard, CardUtil, Find } from "ttpg-darrell";

export const ACTION_NAME_IIHQ_MODERNIZATION: string =
  "Fetch Custodia Vigilia planet card and legendary card";

export const IIHQ_MODERNIZATION_NSID: string =
  "card.technology.yellow:codex.vigil/iihq-modernization";
export const LEGENDARY_NSID: string =
  "card.legendary-planet:codex.vigil/custodia-vigilia";
export const PLANET_NSID: string = "card.planet:codex.vigil/custodia-vigilia";

export class RightClickIihqModernization extends AbstractRightClickCard {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  constructor() {
    const customActionHandler = (
      object: GameObject,
      _player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_NAME_IIHQ_MODERNIZATION) {
        const pos: Vector = object.getPosition();
        const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);

        const card: Card | undefined = this.getPlanetCard();
        if (card) {
          this.dealCardToPlayer(card, playerSlot);
        }

        const legendaryCard: Card | undefined = this.getLegendaryCard();
        if (legendaryCard) {
          this.dealCardToPlayer(legendaryCard, playerSlot);
        }
      }
    };
    super(
      IIHQ_MODERNIZATION_NSID,
      ACTION_NAME_IIHQ_MODERNIZATION,
      customActionHandler
    );
  }

  getPlanetCard(): Card | undefined {
    const planetCard: Card | undefined = this._cardUtil.fetchCard(PLANET_NSID);
    return planetCard;
  }

  getLegendaryCard(): Card | undefined {
    const legendaryCard: Card | undefined =
      this._cardUtil.fetchCard(LEGENDARY_NSID);
    return legendaryCard;
  }

  dealCardToPlayer(card: Card, playerSlot: number): void {
    this._cardUtil.dealToHolder(card, playerSlot);
  }
}
