import {
  GameObject,
  GameWorld,
  ImageWidget,
  Player,
  refObject,
  refPackageId,
  UIElement,
  Vector,
} from "@tabletop-playground/api";

import { System } from "lib/system-lib/system/system";

const PACKAGE_ID: string = refPackageId;

export class CombatArenaObj {
  private readonly _obj: GameObject;
  private readonly _img: ImageWidget;

  private readonly _onSystemActivatedHandler = (
    system: System,
    _player: Player
  ): void => {
    this._setSystemImage(system.getSystemTileNumber());
  };

  constructor(obj: GameObject) {
    this._obj = obj;

    console.log("XXXX COMBAT ARENA OBJ");

    this._img = new ImageWidget();
    this._addUI();

    TI4.onSystemActivated.add(this._onSystemActivatedHandler);
    this._obj.onDestroyed.add(() => {
      TI4.onSystemActivated.remove(this._onSystemActivatedHandler);
    });

    this._setSystemImage(18);
  }

  _addUI(): void {
    const extent: Vector = this._obj.getExtent(false, false);

    // Inset slightly, will have a white border.
    const d: number = (Math.max(extent.x, extent.y) * 17.32) / 18.32;
    this._img.setImageSize(d * 20, d * 20);

    const ui: UIElement = new UIElement();
    ui.position = new Vector(0, 0, extent.z + 0.02);
    ui.useWidgetSize = true;
    ui.widget = this._img;
    this._obj.addUI(ui);
  }

  _setSystemImage(systemTileNumber: number): void {
    const s: string = systemTileNumber.toString().padStart(3, "0");
    const imgAsset: string = `tile/system/tile-${s}.png`;
    this._img.setImage(imgAsset, PACKAGE_ID);
  }
}

export function delayedCreateBuildArea(
  obj: GameObject,
  executionReason: string
): void {
  if (executionReason !== "unittest") {
    process.nextTick(() => {
      if (obj.isValid()) {
        new CombatArenaObj(obj);
      }
    });
  }
}
delayedCreateBuildArea(refObject, GameWorld.getExecutionReason());
