import { world, Zone } from "@tabletop-playground/api";

for (const zone of world.getAllZones()) {
  zone.destroy();
}

const zone: Zone = world.createZone([0, 0, world.getTableHeight() + 2]);
zone.setScale([10, 10, 5]);
zone.setColor([1, 0, 0, 0.1]);
zone.setAlwaysVisible(true);

function reportOverlap(): void {
  const ids: Array<string> = zone
    .getOverlappingObjects()
    .map((obj) => obj.getId());
  console.log("ZONE OVERLAP: " + ids.join(", "));
}

function getExtents(): void {
  for (const obj of zone.getOverlappingObjects()) {
    obj.getExtent(false, false);
  }
}

setTimeout(reportOverlap, 1000);
setTimeout(getExtents, 2000);
setTimeout(reportOverlap, 3000);
