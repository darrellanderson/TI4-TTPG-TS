import { CreateDeck } from "./lib/create-deck";

async function go() {
  await new CreateDeck("action").go();
  await new CreateDeck("agenda").go();
  await new CreateDeck("alliance").go();
  await new CreateDeck("exploration/cultural").go();
  await new CreateDeck("exploration/industrial").go();
  await new CreateDeck("exploration/hazardous").go();
  await new CreateDeck("exploration/frontier").go();
  await new CreateDeck("faction-reference")
    .setSizePx(969, 682)
    .setSizeWorld(8.8, 6.3)
    .go();
  await new CreateDeck("faction-token").go();
  await new CreateDeck("leader/agent").setIsPortrait(false).go();
}
go();
