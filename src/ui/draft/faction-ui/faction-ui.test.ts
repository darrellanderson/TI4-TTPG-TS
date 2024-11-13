import { Widget } from "@tabletop-playground/api";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { FactionUI } from "./faction-ui";

it("getWidget", () => {
  const faction: Faction | undefined =
    TI4.factionRegistry.getByNsidName("arborec");
  if (!faction) {
    throw new Error("Faction not found");
  }

  const factionUi = new FactionUI(1);
  const widget: Widget = factionUi.getWidget(faction);
  expect(widget).toBeDefined();

  const size = factionUi.getSize();
  expect(size.w).toBeDefined();
  expect(size.h).toBeDefined();
});
