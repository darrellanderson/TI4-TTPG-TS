import {
  Border,
  Text,
  UIElement,
  Vector,
  Widget,
  world,
} from "@tabletop-playground/api";
import { System } from "../system/system";

export class SystemLabels {
  private readonly _system: System;
  private _uis: Array<UIElement> = [];

  constructor(system: System) {
    this._system = system;
  }

  attachLabels(): this {
    const addText = (text: string, pos: Vector): void => {
      const ui: UIElement = new UIElement();
      ui.widget = new Border().setChild(
        new Text().setFontSize(10).setText(text)
      );
      ui.position = pos.add([0, 0, 0.5]);
      world.addUI(ui);
      this._uis.push(ui);
    };

    addText(
      `System ${this._system.getSystemTileNumber()}`,
      this._system.getObj().getPosition()
    );

    return this;
  }

  detachLabels(): this {
    for (const ui of this._uis) {
      world.removeUIElement(ui);
    }
    this._uis = [];
    return this;
  }
}
