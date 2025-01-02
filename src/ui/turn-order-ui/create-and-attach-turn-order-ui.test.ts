import { MockCardHolder } from "ttpg-mock";
import { CreateAndAttachTurnOrderUI } from "./create-and-attach-turn-order-ui";

it("init/destroy", () => {
  // Create a card holder for PlayerSeats to detect.
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });

  const createAndAttachTurnOrderUI = new CreateAndAttachTurnOrderUI();
  createAndAttachTurnOrderUI.init();
  createAndAttachTurnOrderUI.init(); // repeat to destroy first, re-add

  TI4.config.onConfigChanged.trigger(TI4.config);

  createAndAttachTurnOrderUI.destroy();
});
