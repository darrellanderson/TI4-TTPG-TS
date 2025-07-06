import { AnimMidTable } from "./anim-mid-table";

function go() {
  console.log("Starting AnimMidTable");
  new AnimMidTable().tour().then(() => {
    console.log("Animation complete");
  });
}

process.nextTick(() => {
  go();
});
