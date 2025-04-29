/**
 * Make flat unit tokens (tintable unit image with white border).
 *
 * Assumes:
 * - assets/Textures/icon/${unit}-outlined.png
 * - assets/Textures/icon/${unit}-mask.png
 * - assets/Textures/icon/${unit}-sustained.png
 * - assets/Textures/icon/${unit}-sustained-mask.png
 *
 * Input: N/A
 *
 * Output:
 * - assets/Templates/unit/${unit}-token.json
 */

import fs from "fs";
import path from "path";

import { SOURCE_TO_UNIT_ATTRS_DATA } from "../../src/lib/unit-lib/data/unit-attrs.data";
import { UnitType } from "../../src/lib/unit-lib/schema/unit-attrs-schema";
import { UNIT_TOKEN_TEMPLATE_DATA } from "./data/unit-token.template-data";
import { getGuid } from "./lib/guid";

const seen: Set<UnitType> = new Set();
for (const unitAttrsDataArray of Object.values(SOURCE_TO_UNIT_ATTRS_DATA)) {
  for (const unitAttrsData of unitAttrsDataArray) {
    const unit: UnitType = unitAttrsData.unit;
    if (seen.has(unit)) {
      continue;
    }
    seen.add(unit);

    const source: string = unit === "mech" ? "pok" : "base";

    const template = JSON.parse(JSON.stringify(UNIT_TOKEN_TEMPLATE_DATA));

    let templateFile: string = `unit/${unit}-token.json`;

    const guid: string = getGuid(templateFile);

    template.GUID = guid;
    template.Name = `${unit} Token`;
    template.Metadata = `unit:${source}/${unit}.token`;
    template.Models[0].Model = `icon/unit/${unit}-outlined.png`;
    template.Models[0].Texture = `icon/unit/${unit}-outlined.png`;
    template.Models[0].ExtraMap = `icon/unit/${unit}-mask.png`;
    template.Models[1].Model = `icon/unit/${unit}-outlined.png`;
    template.Models[1].Texture = `icon/unit/${unit}-sustained.png`;
    template.Models[1].ExtraMap = `icon/unit/${unit}-sustained-mask.png`;
    template.Collision[0].Model = `icon/unit/${unit}-outlined.png`;

    templateFile = "./assets/Templates/" + templateFile;
    const templateDir = path.dirname(templateFile);
    const templateData = Buffer.from(JSON.stringify(template, null, 2));
    fs.mkdirSync(templateDir, { recursive: true });
    fs.writeFileSync(templateFile, templateData);
  }
}
