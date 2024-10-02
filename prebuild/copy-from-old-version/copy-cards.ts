import { AbstractCopyCards } from "./abstract-copy-cards";

import { SOURCE_TO_FACTION_DATA } from "../../src/lib/faction-lib/data/faction.data";
import path from "path";
const factionNsidNames: Array<string> = [];
for (const factionDataArray of Object.values(SOURCE_TO_FACTION_DATA)) {
  for (const factionData of factionDataArray) {
    factionNsidNames.push(factionData.nsidName);
  }
}

const filterFaction = (srcFilename: string): boolean => {
  const nsidName: string = path.basename(srcFilename).split(".")[0] ?? "n/a";
  if (factionNsidNames.includes(nsidName)) {
    return true;
  }
  return false;
};

const filterTech = (srcFilename: string): boolean => {
  const dirName: string = path.dirname(srcFilename);
  const dirParts: Array<string> = dirName.split("/");
  const last: string = dirParts.pop() ?? "n/a";
  const secondLast: string = dirParts.pop() ?? "n/a";
  if (
    secondLast === "blue" ||
    secondLast === "red" ||
    secondLast === "yellow" ||
    secondLast === "unit_upgrade"
  ) {
    const result: boolean = factionNsidNames.includes(last);
    if (!result) {
      console.log("xxx", last);
    }
    return result;
  }
  return true;
};

new AbstractCopyCards("action").go();
new AbstractCopyCards("agenda").go();
new AbstractCopyCards("alliance").go();
new AbstractCopyCards("exploration/cultural").go();
new AbstractCopyCards("exploration/industrial").go();
new AbstractCopyCards("exploration/hazardous").go();
new AbstractCopyCards("exploration/frontier").go();
new AbstractCopyCards("faction_reference").setFilter(filterFaction).go();
new AbstractCopyCards("faction_token").setFilter(filterFaction).go();
new AbstractCopyCards("leader/agent").go();
new AbstractCopyCards("leader/commander").go();
new AbstractCopyCards("leader/hero").go();
new AbstractCopyCards("leader/mech").go();
new AbstractCopyCards("legendary_planet").go();
new AbstractCopyCards("objective").go();
new AbstractCopyCards("other").go();
new AbstractCopyCards("planet").go();
new AbstractCopyCards("promissory").go();
new AbstractCopyCards("relic").go();
new AbstractCopyCards("technology/red").setFilter(filterTech).go();
new AbstractCopyCards("technology/blue").setFilter(filterTech).go();
new AbstractCopyCards("technology/yellow").setFilter(filterTech).go();
new AbstractCopyCards("technology/unit_upgrade").setFilter(filterTech).go();
new AbstractCopyCards("unknown").go();
