import { Card, GameObject, Player } from "@tabletop-playground/api";
import { AbstractRightClickCard, CardUtil, Find } from "ttpg-darrell";

const ACTION_DRAW_ABILITY: string = "*Draw Ability";
const ACTION_DRAW_GENOME: string = "*Draw Genome";
const ACTION_DRAW_UNIT_UPGRADE: string = "*Draw Unit Upgrade";

/**
 * Right click menu to draw a genome, ability, or unit upgrade.
 */
export class RightClickTFYinAscendant extends AbstractRightClickCard {
  private readonly _find: Find = new Find();
  private readonly _cardUtil: CardUtil = new CardUtil();

  constructor() {
    const nsid: string = "card.tf-ability:twilights-fall/yin-ascendant";
    const customActionHandler = (
      _object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      let deckSnapPointTag: string | undefined;
      if (identifier === ACTION_DRAW_ABILITY) {
        deckSnapPointTag = "deck-tf-ability";
      } else if (identifier === ACTION_DRAW_GENOME) {
        deckSnapPointTag = "deck-tf-genome";
      } else if (identifier === ACTION_DRAW_UNIT_UPGRADE) {
        deckSnapPointTag = "deck-tf-unit-upgrade";
      }

      if (deckSnapPointTag) {
        let deck: Card | undefined =
          this._find.findDeckOrDiscard(deckSnapPointTag);
        if (deck) {
          let card: Card | undefined;
          if (deck.getStackSize() > 1) {
            card = deck.takeCards(1, true, 0, false);
          } else {
            card = deck;
          }
          if (card) {
            this._cardUtil.dealToHolder(card, player.getSlot());
          }
        }
      }
    };
    super(nsid, ACTION_DRAW_ABILITY, customActionHandler);

    this.addCustomActionName(ACTION_DRAW_GENOME);
    this.addCustomActionName(ACTION_DRAW_UNIT_UPGRADE);

    this.setTooltip(ACTION_DRAW_ABILITY, "Draw an Ability card.");
    this.setTooltip(ACTION_DRAW_GENOME, "Draw a Genome card.");
    this.setTooltip(ACTION_DRAW_UNIT_UPGRADE, "Draw a Unit Upgrade card.");
  }
}
