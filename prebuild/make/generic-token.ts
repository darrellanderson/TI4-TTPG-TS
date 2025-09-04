/**
 * Create planet attachment tokens.
 *
 * Input: prebuild/token/*.jpg
 *
 * Output:
 * - assets/Templates/token/*.json
 * - assets/Textures/token/*.jpg
 */

import fs from "fs";
import path from "path";

import { SOURCE_TO_GENERIC_TOKENS } from "./data/generic-tokens.data";
import { TOKEN_SYSTEM_ATTACHMENT_TEMPLATE } from "./data/token.template-data";
import { getGuid } from "./lib/guid";

type GenericTokenInfo = {
  guid: string;
  name: string;
  nsid: string;
  imgFileFace: string;
  imgFileBack: string;
  modelScale: number;
  modelFace: string;
  modelBack: string;
  script: string;
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
    const rider: string = genericToken.isRider ? "|rider" : "";
    const nsid: string = `token:${source}/${nsidName}${rider}`;

    const imgFileFace: string = `token/${nsidName}.jpg`;
    let imgFileBack: string = imgFileFace;
    if (genericToken.imgBack) {
      imgFileBack = `token/${nsidName}.back.jpg`;
    }
    const modelScale = genericToken.modelScale ?? 1;
    const modelFace = genericToken.model ?? "round";
    let modelBack = genericToken.model ?? "round";
    const templateFile: string = `token/${nsidName}.json`;

    // Exceptions.
    if (modelBack === "scoreboard" || modelBack === "speaker") {
      modelBack = "";
    }

    const guid: string = getGuid(templateFile);

    infos.push({
      guid,
      name,
      nsid,
      imgFileFace,
      imgFileBack,
      modelScale,
      modelFace,
      modelBack,
      script: genericToken.script ?? "",
      templateFile,
    });
  }
}

// Swap to PNG if no JPG.
const prebuildDir: string = `${__dirname}/../`;
const assetsDir: string = `${__dirname}/../../assets/`;
for (const info of infos) {
  if (!fs.existsSync(prebuildDir + info.imgFileFace)) {
    const png: string = info.imgFileFace.replace(/\.jpg$/, ".png");
    if (fs.existsSync(prebuildDir + png)) {
      info.imgFileFace = png;
    }
  }
  if (!fs.existsSync(prebuildDir + info.imgFileBack)) {
    const png: string = info.imgFileBack.replace(/\.jpg$/, ".png");
    if (fs.existsSync(prebuildDir + png)) {
      info.imgFileBack = png;
    }
  }
}
// Validate the input files.
const errors: Array<string> = [];
for (const info of infos) {
  if (!fs.existsSync(prebuildDir + info.imgFileFace)) {
    errors.push(`File face not found: "${info.imgFileFace}"`);
  }
  if (!fs.existsSync(prebuildDir + info.imgFileBack)) {
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
  json.Models[0].Model = `token/${info.modelFace}.obj`;
  json.Models[1].Model = `token/${info.modelBack}.obj`;
  json.Models[0].Texture = info.imgFileFace;
  json.Models[1].Texture = info.imgFileBack;
  json.Models[0].Scale.X *= info.modelScale;
  json.Models[0].Scale.Y *= info.modelScale;
  json.Models[1].Scale.X *= info.modelScale;
  json.Models[1].Scale.Y *= info.modelScale;
  json.Collision[0].Model = `token/${info.modelFace}.col.obj`;
  json.Collision[0].Scale.X *= info.modelScale;
  json.Collision[0].Scale.Y *= info.modelScale;
  json.ScriptName = info.script;

  if (info.modelBack === "") {
    json.Models.pop();
  }

  if (info.nsid === "token:base/custodians") {
    json.Tags = ["token-custodians"];
    json.ShouldSnap = true;
    json.ScriptName = "ref-obj/custodians-token.js";
  }

  if (info.nsid === "token:base/speaker") {
    json.Tags = ["token-speaker"];
    json.ShouldSnap = true;
  }

  const templateFile: string = assetsDir + "Templates/" + info.templateFile;
  const templateDir: string = path.dirname(templateFile);
  const templateData: Buffer = Buffer.from(JSON.stringify(json, null, 2));

  fs.mkdirSync(templateDir, { recursive: true });
  fs.writeFileSync(templateFile, templateData);

  fs.cpSync(
    prebuildDir + info.imgFileFace,
    assetsDir + "Textures/" + info.imgFileFace
  );
  if (info.imgFileFace !== info.imgFileBack && info.imgFileBack !== "") {
    fs.cpSync(
      prebuildDir + info.imgFileBack,
      assetsDir + "Textures/" + info.imgFileBack
    );
  }
}
