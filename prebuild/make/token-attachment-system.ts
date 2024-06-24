/**
 * Create system attachment tokens.
 *
 * Input: prebuild/token/attachment/system/*.jpg
 *
 * Output:
 * - assets/Templates/token/attachment/system/*.json
 * - assets/Textures/token/attachment/system/*.jpg
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

import { SOURCE_TO_SYSTEM_ATTACHMENT_DATA } from "../../src/lib/system-lib/data/system-attachment.data";
import { TOKEN_SYSTEM_ATTACHMENT_TEMPLATE } from "./token-attachment-system.data";

type AttachmentInfo = {
  guid: string;
  name: string;
  nsid: string;
  imgFileFace: string; // paths are relative to prebuild or assets/Textures
  imgFileBack: string;
  modelFileFace: string;
  modelFileBack: string;
  modelCollider: string;
  modelScale: number;
  templateFile: string;
};

// Assemble info records.
const infos: Array<AttachmentInfo> = [];
for (const [source, systemAttachmentSchemas] of Object.entries(
  SOURCE_TO_SYSTEM_ATTACHMENT_DATA
)) {
  for (const systemAttachmentSchema of systemAttachmentSchemas) {
    const name: string = systemAttachmentSchema.name;
    const nsidName: string = systemAttachmentSchema.nsidName;
    const nsid: string = `token.attachment.system:${source}/${nsidName}`;

    let imgFileFace: string = `token/attachment/system/${source}/${nsidName}.jpg`;
    let imgFileBack: string = imgFileFace;
    if (systemAttachmentSchema.imgFaceDown) {
      imgFileBack = `token/attachment/system/${source}/${nsidName}.back.jpg`;
    }
    let modelFileFace: string = "token/round.obj";
    let modelFileBack: string = "token/round.obj";
    let modelCollider: string = "token/round.col.obj";
    const modelScale = systemAttachmentSchema.modelScale ?? 1;

    // Rewrite some outliers.
    if (nsidName.startsWith("dimensional-tear")) {
      imgFileFace = `token/attachment/system/pok/dimensional-tear.jpg`;
    }
    if (nsidName.startsWith("wormhole-") && nsidName.endsWith(".creuss")) {
      imgFileBack = "";
      modelFileFace = "token/wormhole-creuss.obj";
      modelFileBack = ""; // wormhole.obj has face and back in same image
      modelCollider = "token/wormhole-creuss.col.obj";
    }

    const templateFile: string = `token/attachment/system/${source}/${nsidName}.json`;

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
      modelFileFace,
      modelFileBack,
      modelCollider,
      modelScale,
      templateFile,
    });
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
  json.Models[0].Model = info.modelFileFace;
  json.Models[0].Texture = info.imgFileFace;
  json.Collision[0].Model = info.modelCollider;
  json.Models[1].Model = info.modelFileBack;
  json.Models[1].Texture = info.imgFileBack;
  json.Models[0].Scale.X *= info.modelScale;
  json.Models[0].Scale.Y *= info.modelScale;
  json.Models[1].Scale.X *= info.modelScale;
  json.Models[1].Scale.Y *= info.modelScale;
  json.Collision[0].Scale.X *= info.modelScale;
  json.Collision[0].Scale.Y *= info.modelScale;

  // Generally tokens have different front/back models, with separate images.
  // Some have a single model with both front/back in the same image.
  if (info.modelFileBack === "") {
    json.Models.pop();
  }

  if (info.modelCollider === "") {
    json.Collision = [];
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
