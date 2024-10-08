import { AbstractCopyCards } from "./abstract-copy-cards";

// TI4-TTPG still has Discordant Stars art assets in it.
// Do not copy those.
import { SOURCE_TO_FACTION_DATA } from "../../src/lib/faction-lib/data/faction.data";
import path from "path";
const factionNsidNames: Array<string> = ["keleres"];
for (const factionDataArray of Object.values(SOURCE_TO_FACTION_DATA)) {
  for (const factionData of factionDataArray) {
    factionNsidNames.push(factionData.nsidName);
  }
}

const filterFaction = (srcFilename: string): boolean => {
  const nsidName: string = path.basename(srcFilename).split(".")[0] ?? "n/a";
  const result: boolean = factionNsidNames.includes(nsidName);
  if (!result) {
    console.log("xxx filterFaction", nsidName, srcFilename);
  }
  return result;
};

const filterLeader = (srcFilename: string): boolean => {
  const dirName: string = path.dirname(srcFilename);
  const dirParts: Array<string> = dirName.split("/");
  const last: string = dirParts.pop() ?? "n/a";
  const result: boolean = factionNsidNames.includes(last);
  if (!result) {
    console.log("xxx filterLeader", last, srcFilename);
  }
  return result;
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
      console.log("xxx filterTech", last, srcFilename);
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
new AbstractCopyCards("leader/agent").setFilter(filterLeader).go();
new AbstractCopyCards("leader/commander").setFilter(filterLeader).go();
new AbstractCopyCards("leader/hero").setFilter(filterLeader).go();
new AbstractCopyCards("leader/mech").setFilter(filterLeader).go();
new AbstractCopyCards("legendary_planet").go();
new AbstractCopyCards("objective/public_1").go();
new AbstractCopyCards("objective/public_2").go();
new AbstractCopyCards("objective/secret").go();
new AbstractCopyCards("other").go();
new AbstractCopyCards("planet").go();
new AbstractCopyCards("promissory").go();
new AbstractCopyCards("relic").go();
new AbstractCopyCards("technology/blue").setFilter(filterTech).go();
new AbstractCopyCards("technology/green").setFilter(filterTech).go();
new AbstractCopyCards("technology/red").setFilter(filterTech).go();
new AbstractCopyCards("technology/yellow").setFilter(filterTech).go();
new AbstractCopyCards("technology/unit_upgrade").setFilter(filterTech).go();
new AbstractCopyCards("technology/unknown").setFilter(filterTech).go();
new AbstractCopyCards("unknown").go();
