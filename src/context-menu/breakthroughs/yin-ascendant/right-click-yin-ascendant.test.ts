import { Player } from "@tabletop-playground/api";
import {
  ACTION_YIN_ASCENDANT,
  RightClickYinAscendant,
} from "./right-click-yin-ascendant";
import { MockCard, MockPlayer } from "ttpg-mock";

it("constructor/init/event", () => {
  const rightClickYinAscendant: RightClickYinAscendant =
    new RightClickYinAscendant();
  rightClickYinAscendant.init();

  const card: MockCard = MockCard.simple(
    "card.breakthrough:thunders-edge/yin-ascendant"
  );
  process.flushTicks(); // register the custom action handler

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, ACTION_YIN_ASCENDANT);
});

it("_getInUseAllianceCardNsids", () => {
  const rightClickYinAscendant: RightClickYinAscendant =
    new RightClickYinAscendant();
  let nsids: Array<string>;

  nsids = rightClickYinAscendant._getInUseAllianceCardNsids();
  expect(nsids).toEqual([]);

  MockCard.simple("card.alliance:my-source/my-name");

  nsids = rightClickYinAscendant._getInUseAllianceCardNsids();
  expect(nsids).toEqual(["card.alliance:my-source/my-name"]);
});
