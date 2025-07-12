import { GameObject, refObject } from "@tabletop-playground/api";
import { AnimHighlight } from "./anim-highlight";

const obj: GameObject = refObject;
const duration: number = 1000; // Duration in milliseconds

process.nextTick(() => {
  for (const line of obj.getDrawingLines()) {
    console.log(`Removing existing line: ${line.tag}`);
    obj.removeDrawingLineObject(line);
  }
  AnimHighlight.simple(obj, duration).then(() => {
    console.log("Highlight animation completed.");
  });
});
