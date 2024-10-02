/**
 * Create unit containers, assumes icons and masks are already created.
 *
 * Output:
 * - assets/Templates/containers/unit/*.json
 */

import fs from "fs";
import path from "path";

import { SOURCE_TO_UNIT_ATTRS_DATA } from "../../src/lib/unit-lib/data/unit-attrs.data";
import { UnitType } from "../../src/lib/unit-lib/schema/unit-attrs-schema";
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

const seen: Set<UnitType> = new Set();
for (const unitAttrsDataArray of Object.values(SOURCE_TO_UNIT_ATTRS_DATA)) {
  for (const unitAttrsData of unitAttrsDataArray) {
    const unit: UnitType = unitAttrsData.unit;
    if (seen.has(unit)) {
      continue;
    }
    seen.add(unit);

    const source: string = unit === "mech" ? "pok" : "base";

    const template = JSON.parse(JSON.stringify(CONTAINER_TEMPLATE_DATA));

    let templateFile: string = `container/unit/${unit}.json`;

    const guid: string = getGuid(templateFile);

    template.GUID = guid;
    template.Name = capitalizeFirstLetterHypenated(unit);
    template.Metadata = `container.unit:${source}/${unit}`;
    template.Models[0].Texture = `icon/unit/${unit}.jpg`;
    template.Models[0].ExtraMap = `icon/unit/${unit}-mask.png`;

    templateFile = "./assets/Templates/" + templateFile;
    const templateDir = path.dirname(templateFile);
    const templateData = Buffer.from(JSON.stringify(template, null, 2));
    fs.mkdirSync(templateDir, { recursive: true });
    fs.writeFileSync(templateFile, templateData);
  }
}
