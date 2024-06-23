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
    let modelFileFace: string = "token/attachment/system/round.obj";
    let modelFileBack: string = "token/attachment/system/round.obj";

    if (nsidName.startsWith("wormhole-") && nsidName.endsWith(".creuss")) {
      imgFileBack = `token/attachment/system/base/wormhole.creuss.back.jpg`;
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
      templateFile,
    });
  }
}

// Validate the input files.
for (const info of infos) {
  if (!fs.existsSync("./prebuild/" + info.imgFileFace)) {
    console.error(`File not found: "${info.imgFileFace}"`);
  }
  if (!fs.existsSync("./prebuild/" + info.imgFileBack)) {
    console.error(`File not found: "${info.imgFileBack}"`);
  }
}

throw new Error("stop!");

for (const info of infos) {
  const json = JSON.parse(JSON.stringify(TOKEN_SYSTEM_ATTACHMENT_TEMPLATE));
  json.GUID = info.guid;
  json.Name = info.name;
  json.Metadata = info.nsid;
  json.Models[0].Model = info.modelFileFace;
  json.Models[0].Texture = info.imgFileFace;
  json.Models[1].Model = info.modelFileBack;
  json.Models[1].Texture = info.imgFileBack;

  const templateFile: string = "./assets/Templates/" + info.templateFile;
  const templateDir: string = path.dirname(templateFile);
  const templateData: Buffer = Buffer.from(JSON.stringify(json, null, 2));

  fs.mkdirSync(templateDir, { recursive: true });
  fs.writeFileSync(templateFile, templateData);

  fs.cpSync(
    "./prebuild/" + info.imgFileFace,
    "./assets/Textures/" + info.imgFileBack
  );
  fs.cpSync(
    "./prebuild/" + info.imgFileBack,
    "./assets/Textures/" + info.imgFileBack
  );
}
