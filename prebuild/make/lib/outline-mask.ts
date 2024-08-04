import sharp, { Metadata } from "sharp";

/**
 * Create an opaque version of a PNG with a white background.
 *
 * @param pngFilename
 */
export async function opaqueJpg(pngFilename: string) {
  const src: string = pngFilename;
  const dst: string = pngFilename.replace(/.png$/, ".jpg");
  if (src === dst) {
    throw new Error("src is dst???");
  }

  await sharp(src)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg()
    .toFile(dst);

  console.log(`Created: ${dst}`);
}

/**
 * Create an outlined version of a PNG with a feathered edge and white background.
 *
 * See https://github.com/lovell/sharp/issues/3759
 *
 * @param pngFilename
 */
export async function outlineMask(pngFilename: string) {
  const src: string = pngFilename;
  const dst: string = pngFilename.replace(/.png$/, "-mask.png");
  if (src === dst) {
    throw new Error("src is dst???");
  }

  const metadata: Metadata = await sharp(src).metadata();
  const width: number = metadata.width || 1;
  const height: number = metadata.height || 1;

  const innerMask: Buffer = await sharp(src).extractChannel("alpha").toBuffer();

  // Need two steps to remove blurred alpha.
  const blurredOuterMask: Buffer = await sharp(src)
    .blur(8)
    .flatten(true)
    .toColorspace("b-w")
    .toBuffer();
  const outerMask: Buffer = await sharp(blurredOuterMask)
    .threshold(1)
    .unflatten()
    .extractChannel("alpha")
    .toBuffer();

  const mask: Buffer = await sharp(outerMask)
    .composite([{ input: innerMask, blend: "add" }])
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 255 },
    },
  })
    .composite([{ input: mask, blend: "multiply" }])
    .png()
    .toFile(dst);

  console.log(`Created: ${dst}`);
}
