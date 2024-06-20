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

for (const line of world.getDrawingLines()) {
  if (line.tag === "SystemLabels") {
    world.removeDrawingLineObject(line);
  }
}

export class SystemLabels {
  private static readonly SCALE: number = 4;
  private readonly _system: System;
  private _uis: Array<UIElement> = [];
  private _lines: Array<DrawingLine> = [];

  static getPlanetLine(planet: Planet, z: number): DrawingLine {
    const points: Array<Vector> = [];
    const center: Vector = planet.getPosition();
    const r: number = planet.getRadius();
    const deltaPhi = (Math.PI * 2) / 16;
    for (let phi = 0; phi <= Math.PI * 2 + 0.01; phi += deltaPhi) {
      const p = new Vector(Math.cos(phi) * r, Math.sin(phi) * r, z);
      points.push(p.add(center));
    }

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
      const line = SystemLabels.getPlanetLine(planet, 0.2);
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

    for (const {
      wormhole,
      position,
    } of this._system.getWormholesWithPositions()) {
      addText(wormhole, position);
    }

    for (const attachment of this._system.getAttachments()) {
      addText(attachment.getName(), attachment.getObj().getPosition());
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
