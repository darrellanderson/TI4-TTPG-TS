import {
  Card,
  ImageWidget,
  Rotator,
  UIElement,
  UIZoomVisibility,
  Vector,
} from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { Planet } from "../planet/planet";
import { PlanetAttachment } from "./planet-attachment";

const TOP = {
  x0: 2.2,
  y0: -0.4,
  dx: -1.6,
  dy: 1.6,
  numCols: 2,
};
const BOT = {
  x0: 2.2,
  y0: 0.4,
  dx: -1.6,
  dy: -1.6,
  numCols: 2,
};

/**
 * Add attachment icons to planet cards.
 */
export class PlanetCardLayout {
  public layout(planet: Planet) {
    const card: Card | undefined = this._getCard(planet);
    if (card) {
      this._removeUIs(card);
      planet
        .getAttachments()
        .forEach((attachment: PlanetAttachment, index: number): void => {
          this._addImageCardFace(card, attachment, index);
          this._addImageCardBack(card, attachment, index);
        });
    }
  }

  _getCard(planet: Planet): Card | undefined {
    const cardNsid: string = planet.getPlanetCardNsid();
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    return new Find().findCard(cardNsid, owningPlayerSlot, skipContained);
  }

  _removeUIs(card: Card): void {
    for (const ui of card.getUIs()) {
      card.removeUIElement(ui);
    }
  }

  _addImageCardFace(card: Card, attachment: PlanetAttachment, index: number) {
    if (index >= 2) {
      index += 1; // obscures values
    }
    if (index >= 4) {
      index += 2; // obscures name, trait
    }

    const col: number = index % BOT.numCols;
    let row: number = Math.floor(index / TOP.numCols);
    if (row > 2) {
      row -= 0.5;
    }

    const ui: UIElement = new UIElement();
    ui.position = new Vector(
      BOT.x0 + row * BOT.dx,
      BOT.y0 + col * BOT.dy,
      -0.11
    );
    ui.rotation = new Rotator(180, 180, 0);
    ui.scale = 0.3;
    ui.widget = new ImageWidget()
      .setImage(attachment.getImg(), attachment.getImgPackageId())
      .setImageSize(50, 50);
    ui.zoomVisibility = UIZoomVisibility.Both;

    card.addUI(ui);
  }

  _addImageCardBack(card: Card, attachment: PlanetAttachment, index: number) {
    if (index >= 4) {
      index += 2; // obscures values, name, and trait
    }

    const col: number = index % TOP.numCols;
    const row: number = Math.floor(index / TOP.numCols);

    const ui: UIElement = new UIElement();
    ui.position = new Vector(
      TOP.x0 + row * TOP.dx,
      TOP.y0 + col * TOP.dy,
      0.11
    );
    ui.rotation = new Rotator(0, 0, 0);
    ui.scale = 0.3;
    ui.widget = new ImageWidget()
      .setImage(attachment.getImg(), attachment.getImgPackageId())
      .setImageSize(50, 50);
    ui.zoomVisibility = UIZoomVisibility.Both;

    card.addUI(ui);
  }
}
