import { world } from "@tabletop-playground/api";

// Right-click delete on a layout-all object does not always work,
// the object falls below the table and is not deleted.
for (const obj of world.getAllObjects()) {
  if (obj.getScriptFilename().includes("layout-all.testp")) {
    console.log("xxx", obj.getScriptFilename(), obj.getPosition().toString());
    obj.destroy();
  }
}
