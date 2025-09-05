import {
  Color,
  Container,
  GameObject,
  ObjectType,
  Player,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { DeletedItemsContainer, NSID } from "ttpg-darrell";
import { AbstractSlashCommand } from "../abstract-slash-command/abstract-slash-command";

export class SlashToggleUnits implements AbstractSlashCommand {
  getSlashCommand(): `/${string}` {
    return "/toggleunits";
  }

  getDescription(): string {
    return "Toggle units between their plastic and token versions.";
  }

  isHostOnly(): boolean {
    return true;
  }

  run(_argv: Array<string>, _player: Player): void {
    // Get all units, even in containers.
    const units: Array<GameObject> = [];
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("unit:")) {
        units.push(obj);
      }
    }

    // Replace with alt version.
    for (const oldUnit of units) {
      const oldNsid: string = NSID.get(oldUnit);
      let newNsid: string;
      if (oldNsid.endsWith(".token")) {
        newNsid = oldNsid.replace(/\.token$/, "");
      } else {
        newNsid = `${oldNsid}.token`;
      }

      const container: Container | undefined = oldUnit.getContainer();
      const pos: Vector = oldUnit.getPosition();
      const rot: Rotator = oldUnit.getRotation();
      const color: Color = oldUnit.getPrimaryColor();
      const owner: number = oldUnit.getOwningPlayerSlot();
      const objType: ObjectType = oldUnit.getObjectType();
      const tags: Array<string> = oldUnit.getTags();

      if (container) {
        const above: Vector = container.getPosition().add([0, 0, 10]);
        container.take(oldUnit, above);
      }
      DeletedItemsContainer.destroyWithoutCopying(oldUnit);

      // Plastic/tokens have different heights, spawn above and snap down.
      const newUnit: GameObject | undefined = TI4.spawn.spawn(
        newNsid,
        pos.add([0, 0, 3]),
        rot
      );
      if (newUnit) {
        newUnit.snapToGround();
        newUnit.setPrimaryColor(color);
        newUnit.setOwningPlayerSlot(owner);
        newUnit.setObjectType(objType);
        newUnit.setTags(tags);
        if (container) {
          container.addObjects([newUnit]);
        }
      }
    }
  }
}
