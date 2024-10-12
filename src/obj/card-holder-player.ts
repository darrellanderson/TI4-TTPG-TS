import { refHolder } from "@tabletop-playground/api";
import { CardHolderPlayerName } from "ttpg-darrell";

// Wait a frame to:
// (1) let creator finish setting up if a new object,
// (2) let player data become valid if (re)loading.
const obj = refHolder; // ref* gets cleared end of frame
process.nextTick(() => {
  if (obj.isValid()) {
    new CardHolderPlayerName(obj).setFontSizeAndPosition(64);
  }
});
