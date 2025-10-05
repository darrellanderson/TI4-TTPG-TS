/**
 * Several reports of upacking TI4 maps works for the host, but clients only
 * sometimes see the ~50 system tiles (apparently some will, most wont).
 * Leaving and re-joining fixes the state.
 *
 * Put this script on an object, right click THE TABLE for the create/pack and
 * unpack actions.
 */

import {
  Container,
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";

const CONTAINER_TEMPLATE_ID = "C134C94B496A8D48C79534A5BDBC8A3D";
const PAWN_TEMPLATE_ID = "E10BD70A49A3A579382262A507FC8A35";

const ACTION_PACK = "*Create and pack container";
const ACTION_UNPACK = "*Unpack container";

const CONTAINER_ID = "_my_container_";

world.addCustomAction(ACTION_PACK);
world.addCustomAction(ACTION_UNPACK);

function spawn(templateId: string): GameObject {
  const z: number = world.getTableHeight() + 10;
  const pos: Vector = new Vector(0, 0, z);
  const obj: GameObject | undefined = world.createObjectFromTemplate(
    templateId,
    pos
  );
  if (!obj) {
    throw new Error(`missing "${templateId}" template`);
  }

  return obj;
}

globalEvents.onCustomAction.add((_player: Player, identifier: string): void => {
  if (identifier === ACTION_PACK) {
    const container: Container = spawn(CONTAINER_TEMPLATE_ID) as Container;
    if (!(container instanceof Container)) {
      throw new Error("not a container");
    }
    container.snapToGround();
    container.setId(CONTAINER_ID);
    for (let i = 0; i < 50; i++) {
      const pawn: GameObject = spawn(PAWN_TEMPLATE_ID);
      container.addObjects([pawn]);
    }
  } else if (identifier === ACTION_UNPACK) {
    const container: Container = world.getObjectById(CONTAINER_ID) as Container;
    if (!(container instanceof Container)) {
      throw new Error("not a container");
    }
    const z = world.getTableHeight() + 10;
    let pos: Vector = new Vector(10, 0, z);
    while (container.getNumItems() > 0) {
      const pawn: GameObject | undefined = container.takeAt(0, pos);
      pos = pos.rotateAngleAxis(15, [0, 0, 1]).multiply(1.01);
      pos.z = z;
      if (pawn) {
        pawn.snapToGround();
      }
    }
  }
});
