/**
 * Look for repeated collisions, buzzing object style.
 */

import { GameObject, world } from "@tabletop-playground/api";

const idToMovementStoppedCount: Record<string, number> = {};

function handleOnMovementStopped(obj: GameObject) {
  const id: string = obj.getId();
  if (idToMovementStoppedCount[id] === undefined) {
    idToMovementStoppedCount[id] = 0;
  }
  idToMovementStoppedCount[id]++;
}

const skipContained: boolean = true;
for (const obj of world.getAllObjects(skipContained)) {
  obj.onMovementStopped.add(handleOnMovementStopped);
}

setTimeout(() => {
  console.log("Movement stopped counts:");
  for (const id in idToMovementStoppedCount) {
    console.log(`Object ${id}: ${idToMovementStoppedCount[id]} times`);
  }
}, 10000);
