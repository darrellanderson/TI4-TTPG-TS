import { globalEvents, world } from "@tabletop-playground/api";

const cardObj = world.getObjectById("my-card");
const meepleObj = world.getObjectById("my-meeple");
if (!cardObj || !meepleObj) {
  throw new Error("Missing");
}

const extent = cardObj.getExtent(false, false);
const r = Math.min(extent.x, extent.y) * 0.8;
const above = cardObj.getPosition().add([r, r, 10]);
let remaining = 1000;

const handler = () => {
  if (remaining % 10 === 0) {
    meepleObj.setPosition(above);
    meepleObj.snapToGround();
    console.log("rot", cardObj.getRotation().toString());
  }
  if (remaining-- <= 0) {
    globalEvents.onTick.remove(handler);
  }
};
globalEvents.onTick.add(handler);
