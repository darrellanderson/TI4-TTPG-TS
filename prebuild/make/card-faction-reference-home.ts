/**
 * Add home system image to faction reference cards.
 *
 * Apply this in-place to images in assets, along with
 * system images in assets/tile/system/tile-###.png
 */

import * as fs from "fs-extra";
import klawSync from "klaw-sync"; // walk file system
import * as path from "path";
import sharp, { Metadata } from "sharp";

const args = {
  i: "assets/Templates",
};

type CardSheetEntry = {
  top: number;
  left: number;
  width: number;
  height: number;
  nsid: string;
};

function getTemplateJsonFilenames(): Array<string> {
  const root: string = path.resolve(args.i);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`missing (-i) template directory "${root}"`);
  }

  console.log(`getTemplateJsonFilenames: scanning "${root}"`);
  return klawSync(root, {
    filter: (item) => path.extname(item.path) === ".json",
    nodir: true,
    traverseAll: true,
  }).map((item) => item.path);
}

async function getTemplateCardSheetEntries(
  templateJsonFilename: string
): Promise<Array<CardSheetEntry>> {
  const json: string = await fs.readFile(templateJsonFilename, {
    encoding: "utf-8",
  });

  const parsed = JSON.parse(json);
  if (parsed.Type !== "Card") {
    throw new Error("not a card template");
  }

  const numRows: number = parsed.NumHorizontal;
  const numCols: number = parsed.NumVertical;

  const root: string = path.resolve(args.i);
  const texture: string = parsed.FrontTexture;
  const textureWithPath: string = path.join(root, texture);
  if (!fs.existsSync(textureWithPath)) {
    throw new Error(`missing texture file "${textureWithPath}"`);
  }

  const metadata: Metadata = await sharp(textureWithPath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`could not get metadata for "${textureWithPath}"`);
  }

  const cardWidth: number = Math.ceil(metadata.width / numRows);
  const cardHeight: number = Math.ceil(metadata.height / numCols);

  const entries: Array<CardSheetEntry> = [];
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const index: number = row * numCols + col;
      const nsid: string = parsed.CardMetadata[index].Nsid;
      entries.push({
        top: col * cardHeight,
        left: row * cardWidth,
        width: cardWidth,
        height: cardHeight,
        nsid: nsid,
      });
    }
  }

  return entries;
}

async function main() {}

main();
