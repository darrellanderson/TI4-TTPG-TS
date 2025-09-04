/**
 * Create unit containers, assumes icons and masks are already created.
 *
 * Output:
 * - assets/Templates/containers/token/{command, control}.json
 */

import fs from "fs";
import path from "path";

import { CONTAINER_TEMPLATE_DATA } from "./data/container.template-data";
import { getGuid } from "./lib/guid";

function capitalizeFirstLetterHypenated(s: string): string {
  return s
    .split("-")
    .map((word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    })
    .join(" ");
}

const assetsDir: string = `${__dirname}/../../assets/`;
for (const token of ["command", "control"]) {
  const template = JSON.parse(JSON.stringify(CONTAINER_TEMPLATE_DATA));

  let templateFile: string = `container/token/${token}.json`;

  const guid: string = getGuid(templateFile);

  template.GUID = guid;
  template.Name = capitalizeFirstLetterHypenated(token);
  template.Metadata = `container.token.${token}:base/generic`;
  template.Models[0].Texture = `icon/token/${token}.jpg`;
  template.Models[0].ExtraMap = `icon/token/${token}-mask.png`;

  templateFile = `${assetsDir}Templates/${templateFile}`;
  const templateDir = path.dirname(templateFile);
  const templateData = Buffer.from(JSON.stringify(template, null, 2));
  fs.mkdirSync(templateDir, { recursive: true });
  fs.writeFileSync(templateFile, templateData);
}
