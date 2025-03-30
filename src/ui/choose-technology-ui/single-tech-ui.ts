import {
  Button,
  Canvas,
  Card,
  CardHolder,
  LayoutBox,
  Player,
  Widget,
} from "@tabletop-playground/api";
import { CardUtil, ThrottleClickHandler } from "ttpg-darrell";
import { Tech } from "../../lib/tech-lib/tech/tech";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { ButtonUI } from "../button-ui/button-ui";
import { FindPlayerTechDeck } from "../../lib/tech-lib/find-player-tech-deck/find-player-tech-deck";

export class SingleTechUI extends AbstractUI {
  private readonly _tech: Tech;

  private readonly _onTechClicked = new ThrottleClickHandler<Button>(
    (_button: Button, player: Player): void => {
      const playerSlot: number = player.getSlot();
      const cardHolder: CardHolder | undefined =
        TI4.playerSeats.getCardHolderByPlayerSlot(playerSlot);
      const techDeck: Card | undefined = new FindPlayerTechDeck().getTechDeck(
        playerSlot
      );

      if (cardHolder && techDeck) {
        // Look for the tech in the tech deck.
        const nsid: string = this._tech.getNsid();
        const card: Card | undefined = new CardUtil().filterCards(
          techDeck,
          (candidateNsid: string): boolean => nsid === candidateNsid
        );
        if (card) {
          cardHolder.insert(card, 0);
        }
      }
    }
  ).get();

  constructor(scale: number, tech: Tech) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
      h: CONFIG.BUTTON_HEIGHT * scale * 1.1,
    };

    const canvas: Canvas = new Canvas();

    const techButtonUi: ButtonUI = new ButtonUI(scale);
    techButtonUi.getButton().setText(tech.getName());

    canvas.addChild(
      techButtonUi.getButton(),
      0,
      0,
      techButtonUi.getSize().w,
      techButtonUi.getSize().h
    );

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(canvas);

    super(box, size);
    this._tech = tech;
    techButtonUi.getButton().onClicked.add(this._onTechClicked);
  }
}
