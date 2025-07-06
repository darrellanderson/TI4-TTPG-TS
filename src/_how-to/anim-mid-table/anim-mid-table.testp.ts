import { AnimMidTable } from "./anim-mid-table";

function go() {
  new AnimMidTable().tour().then(() => {
    console.log("Animation complete");
  });
}

go();
