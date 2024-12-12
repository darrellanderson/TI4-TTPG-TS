import sharp, { Metadata } from "sharp";

const OUTLINE_WIDTH: number = 5;

async function outline(input: Buffer): Promise<Buffer> {
  const blurredInnerMask: Buffer = await sharp(input)
    .blur(OUTLINE_WIDTH)
    .flatten(true)
    .toColorspace("b-w")
    .png()
    .toBuffer();
  const output: Buffer = await sharp(blurredInnerMask)
    .threshold(1)
    .unflatten()
    .negate()
    .extractChannel("alpha")
    .png()
    .toBuffer();
  return output;
}

/**
 * Create a unit with a white outline and a "sustained damage" effect.
 * Also create a mask to tint the unit portion but not the outline or sustained portion.
 */
export async function sustained(
  pngFilename: string,
  sustainedPngFilename: string
) {
  const src: string = pngFilename;
  const dst: string = pngFilename.replace(/.png$/, "-sustained.png");
  const dstMask: string = pngFilename.replace(/.png$/, "-sustained-mask.png");

  const metadata: Metadata = await sharp(src).metadata();
  const width: number = metadata.width || 1;
  const height: number = metadata.height || 1;

  const unit: Buffer = await sharp(src).png().toBuffer();
  const unitOutline: Buffer = await outline(unit);
  const unitMask: Buffer = await sharp(unit)
    .extractChannel("alpha")
    .unflatten()
    .png()
    .toBuffer();

  const sustained: Buffer = await sharp(sustainedPngFilename).toBuffer();
  const sustainedOutline: Buffer = await outline(sustained);
  const sustainedOutlineMask: Buffer = await sharp(sustainedOutline)
    .extractChannel("alpha")
    .unflatten()
    .png()
    .toBuffer();

  const sustainedUnit: Buffer = await sharp(unitOutline)
    .composite([{ input: unit, blend: "atop" }])
    .composite([{ input: sustainedOutline, blend: "add" }])
    .composite([{ input: sustained, blend: "atop" }])
    .png()
    .toBuffer();
  await sharp(sustainedUnit).png().toFile(dst);

  const mask: Buffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 255 },
    },
  })
    .composite([
      { input: unitMask, blend: "multiply" },
      {
        input: sustainedOutlineMask,
        blend: "multiply",
      },
    ])
    .png()
    .toBuffer();
  await sharp(mask).png().toFile(dstMask);
}
