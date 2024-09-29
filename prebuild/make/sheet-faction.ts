/**
 * Create faction icon PNGs with transparency.
 *
 * Assumes:
 * - assets/Textures/faction-sheet/*.face.jpg
 * - assets/Textures/faction-sheet/*.back.jpg
 *
 * Input: N/A
 *
 * Output:
 * - assets/Templates/faction-sheet/*.json
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

import { SOURCE_TO_FACTION_DATA } from "../../src/lib/faction-lib/data/faction.data";
import { FACTION_SHEET_TEMPLATE_DATA } from "./data/faction-sheet.template-data";
for (const [source, factionDataArray] of Object.entries(
  SOURCE_TO_FACTION_DATA,
)) {
  for (const factionData of factionDataArray) {
    console.log(`processing ${factionData.abbr}`);

    let srcNsidName = factionData.nsidName;
    if (srcNsidName.includes("keleres")) {
      srcNsidName = "keleres";
    }

    const face: string = `faction-sheet/${srcNsidName}.face.jpg`;
    const back: string = `faction-sheet/${srcNsidName}.back.jpg`;
    if (!fs.existsSync(`./assets/Textures/${face}`)) {
      throw new Error(`Missing faction sheet: ${face}`);
    }
    if (!fs.existsSync(`./assets/Textures/${back}`)) {
      throw new Error(`Missing faction sheet: ${back}`);
    }

    const template = JSON.parse(JSON.stringify(FACTION_SHEET_TEMPLATE_DATA));

    let templateFile: string = `faction-sheet/${factionData.nsidName}.json`;

    const guid: string = crypto
      .createHash("sha256")
      .update(templateFile)
      .digest("hex")
      .substring(0, 32)
      .toUpperCase();

    template.GUID = guid;
    template.Name = `${factionData.abbr}`;
    template.Metadata = `sheet.faction:${source}/${factionData.nsidName}`;
    template.FrontTexture = face;
    template.BackTexture = back;
    template.CardNames["0"] = template.Name;
    template.CardMetadata["0"] = template.Metadata;

    templateFile = "./assets/Templates/" + templateFile;
    const templateDir = path.dirname(templateFile);
    const templateData = Buffer.from(JSON.stringify(template, null, 2));
    fs.mkdirSync(templateDir, { recursive: true });
    fs.writeFileSync(templateFile, templateData);
  }
}
