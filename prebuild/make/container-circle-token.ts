/**
 * Create unit containers, assumes icons and masks are already created.
 *
 * Output:
 * - assets/Templates/containers/token/{command, control}.json
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

import { CONTAINER_TEMPLATE_DATA } from "./data/container.template-data";

const CLIP_CIRCLE_TOKENS: Array<string> = [
  "fighter-1",
  "fighter-3",
  "infantry-1",
  "infantry-3",
  "tradegood-commodity-1",
  "tradegood-commodity-3",
];

for (const token of CLIP_CIRCLE_TOKENS) {
  const template = JSON.parse(JSON.stringify(CONTAINER_TEMPLATE_DATA));

  let templateFile: string = `container/token/${token}.json`;

  const guid: string = crypto
    .createHash("sha256")
    .update(templateFile)
    .digest("hex")
    .substring(0, 32)
    .toUpperCase();

  template.GUID = guid;
  template.Name = `${token}`;
  template.Metadata = `container.token:base/${token}`;
  template.Models[0].Texture = `icon/token/${token}.jpg`;
  template.Models[0].ExtraMap = `icon/token/circle-mask.png`;

  if (token.includes("infantry")) {
    template.Models[0].PrimaryColor = {
      R: 255,
      G: 141,
      B: 58,
    };
    template.Models[0].UseOverrides = false;
  } else if (token.includes("fighter")) {
    template.Models[0].PrimaryColor = {
      R: 55,
      G: 149,
      B: 255,
    };
    template.Models[0].UseOverrides = false;
  } else if (token.includes("tradegood-commodity")) {
    template.Models[0].PrimaryColor = {
      R: 121,
      G: 148,
      B: 181,
    };
    template.Models[0].UseOverrides = false;
  }

  templateFile = "./assets/Templates/" + templateFile;
  const templateDir = path.dirname(templateFile);
  const templateData = Buffer.from(JSON.stringify(template, null, 2));
  fs.mkdirSync(templateDir, { recursive: true });
  fs.writeFileSync(templateFile, templateData);
}
