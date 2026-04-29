/**
 * Extract descriptions from a TTS json save file.
 * Match object names to the name portions of TTPG nsids.
 * Output a JSON file mapping TTPG nsids to descriptions.
 */

import * as fs from "fs-extra";
import klawSync from "klaw-sync"; // walk file system
import * as path from "path";

import { levenshteinDistance } from "./lib/levenshtein-distance";

function getAllNsids(): Array<string> {
  const root: string = "assets/Templates";
  const jsonFilenames = klawSync(root, {
    filter: (item) => path.extname(item.path) === ".json",
    nodir: true,
    traverseAll: true,
  })
    .map((item) => item.path)
    .filter((jsonFilename: string): boolean => {
      // Restrict to templates.
      const json = fs.readJSONSync(jsonFilename);
      const templateId = json.GUID;
      const nsid = json.Metadata;
      return typeof templateId === "string" && typeof nsid === "string";
    });

  const allNsids: Array<string> = [];

  for (const jsonFilename of jsonFilenames) {
    const json = fs.readJSONSync(jsonFilename);
    const nsid = json.Metadata;

    if (json.Type === "Card" && typeof json.CardMetadata === "object") {
      // Deck, extract all card NSIDs.
      const cardNsids: Array<string> = Object.values(json.CardMetadata);
      for (const cardNsid of cardNsids) {
        if (cardNsid.length > 0) {
          allNsids.push(cardNsid);
        }
      }
    } else if (nsid.length > 0) {
      allNsids.push(nsid);
    }
  }

  return allNsids
    .map((nsid: string): string => {
      nsid = nsid.trim();
      // Remove any trailing attributes after a pipe character.
      const pipeIdx: number = nsid.indexOf("|");
      if (pipeIdx !== -1) {
        return nsid.substring(0, pipeIdx);
      }
      return nsid;
    })
    .filter((nsid: string): boolean => nsid.length > 0);
}
const ALL_NSIDS: Array<string> = getAllNsids();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNameToDescription(
  jsonFilename: string = "prebuild/make/data/tooltips.json",
): { [key: string]: string } {
  const nameToDescription: { [key: string]: string } = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _parseJson = (json: any) => {
    if (Array.isArray(json)) {
      for (const item of json) {
        _parseJson(item);
      }
      return;
    }
    if (typeof json !== "object" || json === null) {
      return;
    }
    for (const value of Object.values(json)) {
      _parseJson(value);
    }

    // Check if this object has a name and description.
    const name: string | undefined = json.Nickname;
    let description: string | undefined = json.Description;
    if (description && description.endsWith(".")) {
      // Remove trailing period to be consistent with other descriptions.
      description = description.slice(0, -1);
    }

    if (
      typeof name === "string" &&
      typeof description === "string" &&
      name.length > 0 &&
      description.length > 0
    ) {
      nameToDescription[name] = description;
    }
  };

  const jsonStr: string = fs.readFileSync(jsonFilename, "utf-8");
  _parseJson(JSON.parse(jsonStr));
  return nameToDescription;
}

function getNsidName(nsid: string): string {
  const srcIdx: number = nsid.indexOf("/");
  if (srcIdx === -1) {
    throw new Error(`Unable to parse NSID "${nsid}"`);
  }
  let name: string = nsid.substring(srcIdx + 1);

  const dotIdx: number = name.indexOf(".");
  if (dotIdx !== -1) {
    name = name.substring(0, dotIdx);
  }

  const pipeIdx: number = name.indexOf("|");
  if (pipeIdx !== -1) {
    name = name.substring(0, pipeIdx);
  }

  return name;
}

// Validate getNsidName works as expected.
const testNsidToName: { [key: string]: string } = {
  "test-type:test-src/test-name.test-suffix": "test-name",
  "test-type:test-src/test-name|test-attr": "test-name",
};
for (const [testNsid, expectedName] of Object.entries(testNsidToName)) {
  const testName = getNsidName(testNsid);
  if (testName !== expectedName) {
    throw new Error(`Expected "${expectedName}", got "${testName}"`);
  }
}

function getClosestNsids(name: string): Array<string> {
  let closestNsids: Array<string> = [];
  let closestDistance = Infinity;
  for (const nsid of ALL_NSIDS) {
    const nsidName = getNsidName(nsid);
    const distance = levenshteinDistance(
      name.toLowerCase().replace(/-/g, " ").replace(/'/g, " "),
      nsidName.toLowerCase().replace(/-/g, " "),
    );
    if (distance < closestDistance) {
      //console.log(`"${name}" -> "${nsidName}" (distance ${distance})`);
      closestDistance = distance;
      closestNsids = [nsid];
    } else if (distance === closestDistance) {
      closestNsids.push(nsid);
    }
  }
  return closestNsids;
}

const nameToDescription: { [key: string]: string } = getNameToDescription();
const nsidToDescription: { [key: string]: string } = {};
for (const [name, description] of Object.entries(nameToDescription)) {
  const closestNsids: Array<string> = getClosestNsids(name);
  for (const nsid of closestNsids) {
    nsidToDescription[nsid] = description;
  }
}

const json: string =
    JSON.stringify(
      nsidToDescription,
      Object.keys(nsidToDescription).sort(),
      4,
    ) + "\n",
  ts: string = `export const NSID_TO_DESCRIPTION: { [key: string]: string } = ${json};\n`;

const outputPath: string = "src/locale/extracted-descriptions.ts";
fs.writeFileSync(outputPath, ts, "utf-8");
