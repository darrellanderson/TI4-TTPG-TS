import * as fs from "fs";

import { SOURCE_TO_SYSTEM_DATA } from "../../src/lib/system-lib/data/system.data";
import { SystemSchemaType } from "../../src/lib/system-lib/schema/system-schema";
import sharp from "sharp";

async function _generate1024(
  srcBuffer: Buffer,
  dst1024filename: string
): Promise<void> {
  const jpg884: Buffer = await sharp(srcBuffer)
    .resize(884, 884, { fit: "contain", position: "center" })
    .jpeg({ quality: 90 })
    .toBuffer();
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: jpg884, blend: "over", left: 70, top: 70 }])
    .jpeg({ quality: 80 })
    .toFile(dst1024filename);
}

async function _generate1024Shuriken(
  srcBuffer: Buffer,
  dst1024filename: string
): Promise<void> {
  const jpg884: Buffer = await sharp(srcBuffer)
    .resize(1022, 1022, { fit: "contain", position: "center" })
    .jpeg({ quality: 90 })
    .toBuffer();
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: jpg884, blend: "over", left: 1, top: 1 }])
    .jpeg({ quality: 80 })
    .toFile(dst1024filename);
}

async function _generate512(
  srcBuffer: Buffer,
  dst512filename: string
): Promise<void> {
  const mask = await sharp("prebuild/tile/system/blank.png")
    .resize(512, 512, { fit: "contain", position: "center" })
    .extractChannel("alpha")
    .toBuffer();
  await sharp(srcBuffer)
    .resize(512, 512, { fit: "contain", position: "center" })
    .joinChannel(mask)
    .png()
    .toFile(dst512filename);
}

async function processOne(system: SystemSchemaType): Promise<void> {
  const srcDir: string = "prebuild/tile/system";
  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source directory does not exist: ${srcDir}`);
  }

  const tileStr: string = system.tile.toString().padStart(3, "0");
  let srcFilename: string = `${srcDir}/tile-${tileStr}.jpg`;
  if (!fs.existsSync(srcFilename)) {
    throw new Error(`Source file does not exist: ${srcFilename}`);
  }

  // Make a square, with the hex filling the width (space at top/bottom).
  let srcBuffer: Buffer = await sharp(srcFilename)
    .resize(1024, 1024, { fit: "contain", position: "center" })
    .png()
    .toBuffer();

  let dst1024filename: string = `assets/Textures/tile/system/tile-${tileStr}.jpg`;
  let dst512filename: string = `assets/Textures/tile/system/tile-${tileStr}.png`;
  if (!fs.existsSync(dst1024filename)) {
    throw new Error(`Destination does not exist: ${dst1024filename}`);
  }
  if (!fs.existsSync(dst512filename)) {
    throw new Error(`Destination does not exist: ${dst512filename}`);
  }

  if (system.class === "off-map") {
    await _generate1024Shuriken(srcBuffer, dst1024filename);
  } else {
    await _generate1024(srcBuffer, dst1024filename);
  }
  await _generate512(srcBuffer, dst512filename);

  if (system.imgFaceDown) {
    srcFilename = srcFilename.replace(/.jpg$/, ".back.jpg");
    if (!fs.existsSync(srcFilename)) {
      throw new Error(`Source file does not exist: ${srcFilename}`);
    }
    srcBuffer = await sharp(srcFilename)
      .resize(1024, 1024, { fit: "contain", position: "center" })
      .png()
      .toBuffer();
    dst1024filename = dst1024filename.replace(/.jpg$/, ".back.jpg");
    dst512filename = dst512filename.replace(/.png$/, ".back.png");
    if (system.class === "off-map") {
      await _generate1024Shuriken(srcBuffer, dst1024filename);
    } else {
      await _generate1024(srcBuffer, dst1024filename);
    }
    await _generate512(srcBuffer, dst512filename);
  }
}

async function processAll(): Promise<void> {
  const sources: Array<string> = Object.keys(SOURCE_TO_SYSTEM_DATA);
  for (const source of sources) {
    const systems: Array<SystemSchemaType> | undefined =
      SOURCE_TO_SYSTEM_DATA[source];
    if (!systems) {
      throw new Error(`No systems found for source: ${source}`);
    }
    for (const system of systems) {
      if (system.tile <= 0) {
        continue;
      }
      if (system.tile > 91) {
        continue;
      }
      console.log(`Processing system tile ${system.tile}`);
      await processOne(system);
    }
  }
}

processAll();
