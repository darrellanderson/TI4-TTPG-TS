/**
 * Create command and control tokens.
 *
 * Input: prebuild/token/command-control/*.jpg
 *
 * Output:
 * - assets/Templates/token/command/*.json
 * - assets/Templates/token/control/*.json
 * - assets/Textures/token/command-control/*.jpg
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

import { SOURCE_TO_FACTION_DATA } from "../../src/lib/faction-lib/data/faction.data";
import { COMMAND_TOKEN_TEMPLATE } from "./data/command.data";
import { CONTROL_TOKEN_TEMPLATE } from "./data/control.data";

for (const [source, factionDataArray] of Object.entries(
  SOURCE_TO_FACTION_DATA,
)) {
  for (const factionData of factionDataArray) {
    let templateFile: string;
    let guid: string;
    let templateDir: string;
    let templateData: Buffer;

    templateFile = `token/command/${factionData.nsidName}.json`;
    guid = crypto
      .createHash("sha256")
      .update(templateFile)
      .digest("hex")
      .substring(0, 32)
      .toUpperCase();
    console.log(factionData.nsidName, "command", guid);

    const textureNsidName: string = factionData.nsidName.includes("keleres")
      ? "keleres"
      : factionData.nsidName;
    const textureFile: string = `./assets/Textures/token/command-control/${textureNsidName}.jpg`;
    const textureDir: string = path.dirname(textureFile);
    fs.mkdirSync(textureDir, { recursive: true });
    fs.cpSync(
      `./prebuild/token/command-control/${textureNsidName}.jpg`,
      textureFile,
    );

    const commandToken = JSON.parse(JSON.stringify(COMMAND_TOKEN_TEMPLATE));
    commandToken.GUID = guid;
    commandToken.Name = `Command (${factionData.abbr})`;
    commandToken.Metadata = `token.command:${source}/${factionData.nsidName}`;
    commandToken.Models[0].Texture = `token/command-control/${textureNsidName}.jpg`;
    commandToken.Models[0].ExtraMap = "token/command-control/token-mask.png";

    templateFile = "./assets/Templates/" + templateFile;
    templateDir = path.dirname(templateFile);
    templateData = Buffer.from(JSON.stringify(commandToken, null, 2));
    fs.mkdirSync(templateDir, { recursive: true });
    fs.writeFileSync(templateFile, templateData);

    templateFile = `token/control/${factionData.nsidName}.json`;
    guid = crypto
      .createHash("sha256")
      .update(templateFile)
      .digest("hex")
      .substring(0, 32)
      .toUpperCase();
    console.log(factionData.nsidName, "control", guid);

    const controlToken = JSON.parse(JSON.stringify(CONTROL_TOKEN_TEMPLATE));
    controlToken.GUID = guid;
    controlToken.Name = `Control (${factionData.abbr})`;
    controlToken.Metadata = `token.control:${source}/${factionData.nsidName}`;
    controlToken.Models[0].Texture = `token/command-control/${textureNsidName}.jpg`;
    controlToken.Models[0].ExtraMap = "token/command-control/token-mask.png";

    templateFile = "./assets/Templates/" + templateFile;
    templateDir = path.dirname(templateFile);
    templateData = Buffer.from(JSON.stringify(controlToken, null, 2));
    fs.mkdirSync(templateDir, { recursive: true });
    fs.writeFileSync(templateFile, templateData);
  }
}

fs.cpSync(
  "./prebuild/token/command-control/token-mask.png",
  "./assets/Textures/token/command-control/token-mask.png",
);
