/**
 * Create unit containers, assumes icons and masks are already created.
 *
 * Output:
 * - assets/Templates/containers/unit/*.json
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

import { SOURCE_TO_UNIT_ATTRS_DATA } from "../../src/lib/unit-lib/data/unit-attrs.data";
import { UnitType } from "../../src/lib/unit-lib/schema/unit-attrs-schema";
import { CONTAINER_TEMPLATE_DATA } from "./data/container.template-data";

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

    const guid: string = crypto
      .createHash("sha256")
      .update(templateFile)
      .digest("hex")
      .substring(0, 32)
      .toUpperCase();

    template.GUID = guid;
    template.Name = `${unit}`;
    template.Metadata = `container.unit:${source}/${unit}`;
    template.Models[0].Texture = `icon/unit/${unit}.jpg`;
    template.Models[0].ExtraMap = `icon/unit/${unit}-mask.png`;

    // "Top" has the unit icon, script attaches icon as billboard UI.
    template.Flippable = true;

    templateFile = "./assets/Templates/" + templateFile;
    const templateDir = path.dirname(templateFile);
    const templateData = Buffer.from(JSON.stringify(template, null, 2));
    fs.mkdirSync(templateDir, { recursive: true });
    fs.writeFileSync(templateFile, templateData);
  }
}
