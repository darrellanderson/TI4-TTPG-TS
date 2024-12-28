import {
  Canvas,
  ImageWidget,
  LayoutBox,
  Player,
  refPackageId,
  Widget,
} from "@tabletop-playground/api";

import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { System } from "../../../lib/system-lib/system/system";

const HALF_HEX_W_PX: number = 250;
const packageId: string = refPackageId;

export class CombatUIHex extends AbstractUI {
  private readonly _canvas: Canvas;

  private readonly _onSystemActivatedHandler = (
    _system: System,
    _player: Player
  ): void => {
    this.update();
  };

  constructor(scale: number) {
    const halfScaledHexWidth: number = HALF_HEX_W_PX * scale;
    const halfScaledHexHeight: number = halfScaledHexWidth * 0.866;

    const canvas: Canvas = new Canvas();
    const size: UI_SIZE = {
      w: halfScaledHexWidth * 2,
      h: halfScaledHexHeight * 2,
    };

    const canvasBox: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(canvas);

    super(canvasBox, size);

    this._canvas = canvas;
    TI4.onSystemActivated.add(this._onSystemActivatedHandler);

    this.update();
  }

  destroy(): void {
    TI4.onSystemActivated.remove(this._onSystemActivatedHandler);
  }

  update(): void {
    for (const child of this._canvas.getChildren()) {
      this._canvas.removeChild(child);
    }

    const system: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    let imgFile: string = "tile/system/tile-000.png";
    let imgPackageId: string = packageId;
    if (system) {
      imgFile = system.getImg();
      imgPackageId = system.getImgPackageId();
    }

    const size: UI_SIZE = this.getSize();
    const img = new ImageWidget()
      .setImage(imgFile, imgPackageId)
      .setImageSize(size.w, size.h);
    this._canvas.addChild(img, 0, -(size.w - size.h) / 2, size.w, size.w); // hex is square
  }
}
