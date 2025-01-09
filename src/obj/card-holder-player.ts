import { Color, refHolder } from "@tabletop-playground/api";
import { CardHolderPlayerName } from "ttpg-darrell";

// Wait a frame to:
// (1) let creator finish setting up if a new object,
// (2) let player data become valid if (re)loading.
const obj = refHolder; // ref* gets cleared end of frame
let cardHolderPlayerName: CardHolderPlayerName | undefined = undefined;

process.nextTick(() => {
  if (obj.isValid()) {
    cardHolderPlayerName = new CardHolderPlayerName(obj).setFontSizeAndPosition(
      64
    );
  }
});

TI4.events.onPlayerChangedColor.add((playerSlot: number) => {
  if (playerSlot === obj.getOwningPlayerSlot()) {
    const color: Color | undefined =
      TI4.playerColor.getSlotWidgetColor(playerSlot);
    if (cardHolderPlayerName && color) {
      cardHolderPlayerName.setColor(color);
    }
  }
});
