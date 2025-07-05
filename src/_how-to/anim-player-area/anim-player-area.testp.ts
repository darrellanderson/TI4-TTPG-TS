import { AnimPlayerArea } from "./anim-player-area";

async function runTour() {
  console.log("Starting 15");
  await new AnimPlayerArea(15).fullTour();
  console.log("Starting 12");
  await new AnimPlayerArea(12).miniTour();
  console.log("done");
}

runTour();
