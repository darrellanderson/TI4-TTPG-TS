/**
 * Create a collider model from a Wavefront OBJ model.
 * The tooling used here isn't final, hence the crazy import paths.
 *
 * Input: "assets/Models/token/mirage.obj"
 * Output: "assets/Models/token/mirage.col.obj"
 */

import fs from "fs";
import path from "path";

import {
  HullModel,
  HullVector3d,
} from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/model/hull-model/hull-model";
import { WavefrontObj } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/wavefront-obj/wavefront-obj";

const modelFile: string = path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "Models",
  "token",
  "avernus.obj"
);
if (!fs.existsSync(modelFile)) {
  throw new Error(`missing "${modelFile}`);
}

// Load OBJ file.
const data: string = fs.readFileSync(modelFile, "utf8");
const wavefrontObj: WavefrontObj = new WavefrontObj().load(data);
let vertices: Array<HullVector3d> = wavefrontObj.getVertices();
console.log(`loaded "${modelFile}" with ${vertices.length} vertices`);

// OBJ swap Y and Z.
vertices = vertices.map((vertex: HullVector3d): HullVector3d => {
  return {
    x: vertex.x,
    y: vertex.z,
    z: vertex.y,
  };
});

// Calculate height, assumes the model is centered at the origin.
let height: number = 0;
for (const vertex of vertices) {
  height = Math.max(height, vertex.z);
}
height *= 2;

const hullModel: HullModel = new HullModel(vertices, height);
let hull: Array<HullVector3d> = hullModel.getHull();
console.log(`hull |${hull.length}|`);

hullModel.quantizeHull(0.1);
hull = hullModel.getHull();
console.log(`hull quantized |${hull.length}|`);

const outputFile: string = modelFile.replace(/.obj$/, ".col.obj");
console.log(`writing "${outputFile}"`);
const output: string = hullModel.toModel();
fs.writeFileSync(outputFile, output);

console.log("done");
