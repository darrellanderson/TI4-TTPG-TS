/**
 * Create planet attachment tokens.
 *
 * Input: prebuild/token/*.jpg
 *
 * Output:
 * - assets/Templates/token/*.json
 * - assets/Textures/token/*.jpg
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

import { SOURCE_TO_GENERIC_TOKENS } from "./data/generic-tokens.data";
import { TOKEN_SYSTEM_ATTACHMENT_TEMPLATE } from "./data/token.template-data";

type GenericTokenInfo = {
  guid: string;
  name: string;
  nsid: string;
  imgFileFace: string;
  imgFileBack: string;
  modelScale: number;
  model: string;
  templateFile: string;
};

// Assemble info records.
const infos: Array<GenericTokenInfo> = [];
for (const [source, genericTokens] of Object.entries(
  SOURCE_TO_GENERIC_TOKENS
)) {
  for (const genericToken of genericTokens) {
    const name: string = genericToken.name;
    const nsidName: string = genericToken.nsidName;
    const nsid: string = `token:${source}/${nsidName}`;

    const imgFileFace: string = `token/${nsidName}.jpg`;
    let imgFileBack: string = imgFileFace;
    if (genericToken.imgBack) {
      imgFileBack = `token/${nsidName}.back.jpg`;
    }
    const modelScale = genericToken.modelScale ?? 1;
    const model = genericToken.model ?? "";
    const templateFile: string = `token/${nsidName}.json`;

    const guid: string = crypto
      .createHash("sha256")
      .update(templateFile)
      .digest("hex")
      .substring(0, 32)
      .toUpperCase();

    infos.push({
      guid,
      name,
      nsid,
      imgFileFace,
      imgFileBack,
      modelScale,
      model,
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

  if (info.model !== "") {
    json.Models[0].Model = `token/${info.model}.obj`;
    json.Models.pop();
  }

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
