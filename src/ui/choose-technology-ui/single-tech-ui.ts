import {
  Button,
  Canvas,
  Card,
  CardHolder,
  ImageWidget,
  LayoutBox,
  Player,
  refPackageId,
  Widget,
} from "@tabletop-playground/api";
import { CardUtil, ThrottleClickHandler } from "ttpg-darrell";
import { Tech } from "../../lib/tech-lib/tech/tech";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { ButtonUI } from "../button-ui/button-ui";
import { Faction } from "../../lib/faction-lib/faction/faction";
import { FindPlayerTechDeck } from "../../lib/tech-lib/find-player-tech-deck/find-player-tech-deck";
import { TechColorType } from "../../lib/tech-lib/schema/tech-schema";

const packageId: string = refPackageId;
const MAX_NAME_LENGTH: number = 20;

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
          card.setRotation([0, 0, 180]);
          cardHolder.insert(card, 0);
        }
      }
    }
  ).get();

  constructor(scale: number, tech: Tech, faction: Faction | undefined) {
    const size: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * scale,
      h: CONFIG.BUTTON_HEIGHT * scale * 1.3,
    };

    const canvas: Canvas = new Canvas();

    const techButtonUi: ButtonUI = new ButtonUI(scale);
    let name: string = tech.getName();
    if (name.length > MAX_NAME_LENGTH) {
      name = name.substring(0, MAX_NAME_LENGTH - 3) + "...";
    }
    techButtonUi.getButton().setText(name);

    // Add the tech button.
    const bsize: UI_SIZE = techButtonUi.getSize();
    canvas.addChild(techButtonUi.getWidget(), 0, 0, bsize.w, bsize.h);

    // Add prequisite tech colors.
    const prereqSize: number = bsize.h * 0.6;
    const margin: number = prereqSize * 0.2;
    let x: number = margin;
    const y: number = bsize.h - prereqSize * 0.4;
    const colors: Array<TechColorType> = ["blue", "green", "red", "yellow"];
    for (const color of colors) {
      const count: number = tech.getPrerequisites(color);
      const enabled: string = `ui/tech/${color}-enabled.png`;
      const disabled: string = `ui/tech/${color}-disabled.png`;
      for (let i = 0; i < count; i++) {
        const image: Widget = new ImageWidget().setImage(enabled, packageId);
        canvas.addChild(image, x, y, prereqSize, prereqSize);
        x += prereqSize;
      }
    }

    // Note if a faction tech.
    if (tech.isFactionTech() && faction) {
      const img: string = faction.getIcon();
      const imgPackageId: string = faction.getIconPackageId();
      console.log(img, imgPackageId);
      x = bsize.w - prereqSize - margin;
      const image: Widget = new ImageWidget().setImage(img, imgPackageId);
      canvas.addChild(image, x, y, prereqSize, prereqSize);
    }

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(canvas);

    super(box, size);
    this._tech = tech;
    techButtonUi.getButton().onClicked.add(this._onTechClicked);
  }
}
