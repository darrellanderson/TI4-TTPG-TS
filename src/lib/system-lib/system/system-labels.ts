import {
  Border,
  DrawingLine,
  Text,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";
import { System } from "../system/system";
import { Planet } from "../planet/planet";

export class SystemLabels {
  private static readonly SCALE: number = 4;
  private readonly _system: System;
  private _uis: Array<UIElement> = [];
  private _lines: Array<DrawingLine> = [];

  static removePlanetLines(): void {
    for (const line of world.getDrawingLines()) {
      if (line.tag === "SystemLabels") {
        world.removeDrawingLineObject(line);
      }
    }
  }

  static getPlanetLine(planet: Planet): DrawingLine {
    const points: Array<Vector> = planet.getPositionAsCircle();
    const line = new DrawingLine();
    line.normals = [new Vector(0, 0, 1)];
    line.points = points;
    line.rounded = false;
    line.tag = "SystemLabels";
    line.thickness = 0.2;
    return line;
  }

  constructor(system: System) {
    this._system = system;
  }

  attach(): this {
    const addText = (text: string, pos: Vector): void => {
      const ui: UIElement = new UIElement();
      ui.widget = new Border().setChild(
        new Text().setFontSize(7 * SystemLabels.SCALE).setText(` ${text} `)
      );
      ui.position = pos.add([0, 0, 0.2]);
      ui.scale = 1 / SystemLabels.SCALE;
      world.addUI(ui);
      this._uis.push(ui);
    };

    const addLine = (planet: Planet): void => {
      const line = SystemLabels.getPlanetLine(planet);
      world.addDrawingLine(line);
      this._lines.push(line);
    };

    addText(
      `System ${this._system.getSystemTileNumber()}`,
      this._system.getObj().getPosition().add([-1.5, 0, 0])
    );

    for (const planet of this._system.getPlanets()) {
      addText(planet.getName(), planet.getPosition());
      for (const attachment of planet.getAttachments()) {
        addText(attachment.getName(), attachment.getObj().getPosition());
      }
      addLine(planet);
    }

    for (const getWormholesWithPositions of this._system.getWormholesWithPositions()) {
      addText(
        getWormholesWithPositions.wormhole,
        getWormholesWithPositions.position
      );
    }

    for (const attachment of this._system.getAttachments()) {
      addText(
        attachment.getName(),
        attachment.getObj().getPosition().add([1.5, 0, 0])
      );
    }

    return this;
  }

  detach(): this {
    for (const ui of this._uis) {
      world.removeUIElement(ui);
    }
    this._uis = [];
    for (const line of this._lines) {
      world.removeDrawingLineObject(line);
    }
    return this;
  }
}
