/**
 * Create planet attachment tokens.
 *
 * Input: prebuild/token/attachment/planet/*.jpg
 *
 * Output:
 * - assets/Templates/token/attachment/planet/*.json
 * - assets/Textures/token/attachment/planet/*.jpg
 */

import fs from "fs";
import path from "path";

import { SOURCE_TO_PLANET_ATTACHMENT_DATA } from "../../src/lib/system-lib/data/planet-attachment.data";
import { TOKEN_SYSTEM_ATTACHMENT_TEMPLATE } from "./data/token.template-data";
import { getGuid } from "./lib/guid";

type AttachmentInfo = {
  guid: string;
  name: string;
  nsid: string;
  imgFileFace: string; // paths are relative to prebuild or assets/Textures
  imgFileBack: string;
  modelScale: number;
  templateFile: string;
};

// Assemble info records.
const infos: Array<AttachmentInfo> = [];
for (const [source, planetAttachmentSchemas] of Object.entries(
  SOURCE_TO_PLANET_ATTACHMENT_DATA
)) {
  for (const planetAttachmentSchema of planetAttachmentSchemas) {
    const name: string = planetAttachmentSchema.name;
    const nsidName: string = planetAttachmentSchema.nsidName;
    const nsid: string = `token.attachment.planet:${source}/${nsidName}`;

    const imgFileFace: string = `token/attachment/planet/${nsidName}.jpg`;
    let imgFileBack: string = imgFileFace;
    if (planetAttachmentSchema.imgFaceDown) {
      imgFileBack = `token/attachment/planet/${nsidName}.back.jpg`;
    }
    const modelScale = planetAttachmentSchema.modelScale ?? 1;

    const templateFile: string = `token/attachment/planet/${nsidName}.json`;

    const guid: string = getGuid(templateFile);

    infos.push({
      guid,
      name,
      nsid,
      imgFileFace,
      imgFileBack,
      modelScale,
      templateFile,
    });
  }
}

// Swap to PNG if no JPG.
for (const info of infos) {
  if (!fs.existsSync("./prebuild/" + info.imgFileFace)) {
    const png: string = info.imgFileFace.replace(/\.jpg$/, ".png");
    if (fs.existsSync("./prebuild/" + png)) {
      info.imgFileFace = png;
    }
  }
  if (!fs.existsSync("./prebuild/" + info.imgFileBack)) {
    const png: string = info.imgFileBack.replace(/\.jpg$/, ".png");
    if (fs.existsSync("./prebuild/" + png)) {
      info.imgFileBack = png;
    }
  }
}
// Validate the input files.
const errors: Array<string> = [];
for (const info of infos) {
  if (!fs.existsSync("./prebuild/" + info.imgFileFace)) {
    errors.push(`File face not found: "${info.imgFileFace}"`);
  }
  if (!fs.existsSync("./prebuild/" + info.imgFileBack)) {
    errors.push(`File back not found: "${info.imgFileBack}"`);
  }
}
if (errors.length > 0) {
  throw new Error(errors.join("\n"));
}

for (const info of infos) {
  console.log(`Building token: ${info.name}`);

  const json = JSON.parse(JSON.stringify(TOKEN_SYSTEM_ATTACHMENT_TEMPLATE));
  json.GUID = info.guid;
  json.Name = info.name;
  json.Metadata = info.nsid;
  json.Models[0].Texture = info.imgFileFace;
  json.Models[1].Texture = info.imgFileBack;
  json.Models[0].Scale.X *= info.modelScale;
  json.Models[0].Scale.Y *= info.modelScale;
  json.Models[1].Scale.X *= info.modelScale;
  json.Models[1].Scale.Y *= info.modelScale;
  json.Collision[0].Scale.X *= info.modelScale;
  json.Collision[0].Scale.Y *= info.modelScale;

  const templateFile: string = "./assets/Templates/" + info.templateFile;
  const templateDir: string = path.dirname(templateFile);
  const templateData: Buffer = Buffer.from(JSON.stringify(json, null, 2));

  fs.mkdirSync(templateDir, { recursive: true });
  fs.writeFileSync(templateFile, templateData);

  fs.cpSync(
    "./prebuild/" + info.imgFileFace,
    "./assets/Textures/" + info.imgFileFace
  );
  if (info.imgFileFace !== info.imgFileBack && info.imgFileBack !== "") {
    fs.cpSync(
      "./prebuild/" + info.imgFileBack,
      "./assets/Textures/" + info.imgFileBack
    );
  }
}
