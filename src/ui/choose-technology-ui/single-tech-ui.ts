import {
  Button,
  Canvas,
  ImageWidget,
  LayoutBox,
  refPackageId,
  Widget,
} from "@tabletop-playground/api";

import { Faction } from "../../lib/faction-lib/faction/faction";
import { PlayerTechSummary } from "../../lib/tech-lib/player-tech-summary/player-tech-summary";
import { Tech } from "../../lib/tech-lib/tech/tech";
import { TechColorType } from "../../lib/tech-lib/schema/tech-schema";

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { ButtonUI } from "../button-ui/button-ui";

const packageId: string = refPackageId;
const MAX_NAME_LENGTH: number = 20;

export class SingleTechUI extends AbstractUI {
  private readonly _button: Button;

  constructor(
    scale: number,
    tech: Tech,
    faction: Faction | undefined,
    playerTechSummary: PlayerTechSummary
  ) {
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
    techButtonUi
      .getButton()
      .setEnabled(!playerTechSummary.isOwned(tech.getNsid()))
      .setText(name);

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
        const isEnabled: boolean = i < playerTechSummary.getOwnedCount(color);
        const use: string = isEnabled ? enabled : disabled;
        const image: Widget = new ImageWidget().setImage(use, packageId);
        canvas.addChild(image, x, y, prereqSize, prereqSize);
        x += prereqSize;
      }
    }

    // Note if a faction tech.
    if (tech.isFactionTech() && faction) {
      const img: string = faction.getIcon();
      const imgPackageId: string = faction.getIconPackageId();
      x = bsize.w - prereqSize - margin;
      const image: Widget = new ImageWidget().setImage(img, imgPackageId);
      canvas.addChild(image, x, y, prereqSize, prereqSize);
    }

    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(canvas);

    super(box, size);
    this._button = techButtonUi.getButton();
  }

  getButton(): Button {
    return this._button;
  }
}
