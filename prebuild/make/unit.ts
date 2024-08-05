/**
 * Create unit templates.
 *
 * Assumes:
 * - assets/Models/unit/${unit}.shared.obj (use a common texture for batch draw calls)
 * - assets/Models/unit/${unit}.col.obj
 * - assets/Textures/unit/shared.jpg
 *
 * Input: N/A
 *
 * Output:
 * - assets/Templates/unit/${unit}.json
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

import { SOURCE_TO_UNIT_ATTRS_DATA } from "../../src/lib/unit-lib/data/unit-attrs.data";
import { UnitType } from "../../src/lib/unit-lib/schema/unit-attrs-schema";
import { UNIT_TEMPLATE_DATA } from "./data/unit.template-data";

function getWrenchZ(model: string): number {
  if (!fs.existsSync(model)) {
    throw new Error(`File not found: "${model}"`);
  }

  let minZ = 0;
  const lines: Array<string> = fs.readFileSync(model, "utf8").split("\n");
  for (const line of lines) {
    if (line.startsWith("v ")) {
      const values: Array<string> = line.split(" ");
      const z: number = parseFloat(values[3] ?? "9999");
      minZ = Math.min(minZ, z);
    }
  }
  return minZ;
}

const seen: Set<UnitType> = new Set();
for (const [source, unitAttrsDataArray] of Object.entries(
  SOURCE_TO_UNIT_ATTRS_DATA
)) {
  for (const unitAttrsData of unitAttrsDataArray) {
    const unit: UnitType = unitAttrsData.unit;
    if (seen.has(unit)) {
      continue;
    }
    seen.add(unit);

    const template = JSON.parse(JSON.stringify(UNIT_TEMPLATE_DATA));

    let templateFile: string = `unit/${unit}.json`;

    const guid: string = crypto
      .createHash("sha256")
      .update(templateFile)
      .digest("hex")
      .substring(0, 32)
      .toUpperCase();

    template.GUID = guid;
    template.Name = `${unit}`;
    template.Metadata = `unit:${source}/${unit}`;
    template.Models[0].Model = `/unit/${unit}.shared.obj`;
    template.Collision[0].Model = `/unit/${unit}.col.obj`;

    template.Models[1].Offset.Z =
      getWrenchZ(`assets/Models/unit/${unit}.shared.obj`) * 0.8;

    if (unit === "mech") {
      template.Models[0].Scale = {
        X: 1.1,
        Y: 1.1,
        Z: 1.1,
      };
      template.Collision[0].Scale = {
        X: 1.1,
        Y: 1.1,
        Z: 1.1,
      };
      template.Models[1].Offset.Z *= 1.1 / 0.8;
    }
    template.Models[1].Offset.Z -= 0.01;

    templateFile = "./assets/Templates/" + templateFile;
    const templateDir = path.dirname(templateFile);
    const templateData = Buffer.from(JSON.stringify(template, null, 2));
    fs.mkdirSync(templateDir, { recursive: true });
    fs.writeFileSync(templateFile, templateData);
  }
}
