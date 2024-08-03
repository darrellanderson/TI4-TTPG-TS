import sharp, { Sharp } from "sharp";

/**
 * Create an outlined version of a PNG with a feathered edge and white background.
 *
 * See https://github.com/lovell/sharp/issues/3759
 *
 * @param pngFilename
 */
export async function outlineFeatheredAsJpg(pngFilename: string) {
  const src: string = pngFilename;
  const dst: string = pngFilename.replace(/.png$/, ".jpg");

  // Load the opaque area of the PNG.
  const alphaMask: Buffer = await sharp(src)
    .extractChannel("alpha")
    .png()
    .toBuffer();
  const outline: Buffer = await sharp(alphaMask).blur(5).toBuffer();

  await sharp(src).toFile(dst.replace(/.png$/, ".jpg"));
  console.log(`Created: ${dst}`);
}
