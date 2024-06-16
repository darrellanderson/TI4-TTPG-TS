import {
  GameObject,
  ObjectType,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Planet } from "../planet/planet";
import { PlanetAttachment } from "./planet-attachment";

export class PlanetAttachmentLayout {
  static _getOffset(index: number): Vector {
    const steps = Math.floor(index / 3);
    const extra = steps % 2 === 1 ? 0.5 : 0;
    const phi = ((index + extra) * 120 * Math.PI) / 180;
    const r = 1.05;
    return new Vector(-Math.sin(phi) * r, -Math.cos(phi) * r, 0);
  }

  public layout(planet: Planet): void {
    const planetPos: Vector = planet.getPosition();

    // Lift everything in the area, including attachments.
    const r: number = planet.getRadius(); // world space
    const objs: Array<GameObject> = world
      .boxOverlap(planetPos, new Vector(r, r, 3))
      .sort((a, b) => a.getPosition().z - b.getPosition().z); // bottom to top
    for (const obj of objs) {
      obj.setPosition(obj.getPosition().add(new Vector(0, 0, 3)));
    }

    const attachments: Array<PlanetAttachment> = planet.getAttachments();
    for (let i = 0; i < attachments.length; i++) {
      const attachment: PlanetAttachment | undefined = attachments[i];
      if (attachment) {
        const offset: Vector = PlanetAttachmentLayout._getOffset(i);
        const pos: Vector = planetPos.add(offset).add(new Vector(0, 0, 1));
        attachment.getObj().setPosition(pos);
        attachment.getObj().snapToGround();
        attachment.getObj().setObjectType(ObjectType.Ground);
      }
    }

    // Drop everything lifted (in bottom to top order).
    for (const obj of objs) {
      obj.snapToGround();
    }
  }
}
