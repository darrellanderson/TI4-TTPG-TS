import { refObject } from "@tabletop-playground/api";

refObject.onGrab.add(() => {
  console.log("XX Grabbed");
  const myBool: boolean = true;
  while (myBool) {
    // freeze process
  }
});
