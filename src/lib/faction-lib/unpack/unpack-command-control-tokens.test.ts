import { MockContainer, MockGameObject } from "ttpg-mock";
import { Faction } from "../faction/faction";
import { UnpackCommandControlTokens } from "./unpack-command-control-tokens";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "sheet:base/command",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.token.control:base/generic",
    owningPlayerSlot: playerSlot,
  });
  new MockGameObject({ templateMetadata: "token:base/scoreboard" });

  const unpack = new UnpackCommandControlTokens(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});
