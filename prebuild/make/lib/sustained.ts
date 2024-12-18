import sharp, { Metadata } from "sharp";

const OUTLINE_WIDTH: number = 5;

/**
 * Get a solid red version of the tranparent png input.
 *
 * @param input
 */
async function redMask(input: Buffer): Promise<Buffer> {
  const metadata: Metadata = await sharp(input).metadata();
  const width: number = metadata.width || 1;
  const height: number = metadata.height || 1;

  const red: Buffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 255 },
    },
  })
    .png()
    .toBuffer();

  const redMask: Buffer = await sharp(red)
    .composite([{ input, blend: "dest-in" }])
    .png()
    .toBuffer();
  return redMask;
}

/**
 * Get image with a solid white outline with transparent background.
 */
async function whiteOutlinedMask(input: Buffer): Promise<Buffer> {
  const metadata: Metadata = await sharp(input).metadata();
  const width: number = metadata.width || 1;
  const height: number = metadata.height || 1;

  const white: Buffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 255 },
    },
  })
    .png()
    .toBuffer();

  // Work with a solid red version of the input, the later unflatten
  // treats black as transparent.
  const redUnit: Buffer = await redMask(input);
  const fuzzyOutline: Buffer = await sharp(redUnit)
    .blur(OUTLINE_WIDTH)
    .flatten(true)
    .toColorspace("b-w")
    .png()
    .toBuffer();

  // Create a version with a solid outline (fuzzy has alpha fadeout).
  const flatOutline: Buffer = await sharp(fuzzyOutline)
    .threshold(1) // force black and white
    .negate() // invert black and white
    .unflatten() // convert to transparency
    .png()
    .toBuffer();

  // Fill the flat outline with white, lay the original unit on top.
  const whiteOutline: Buffer = await sharp(white)
    .composite([
      { input: flatOutline, blend: "dest-in" },
      { input, blend: "atop" },
    ])
    .png()
    .toBuffer();

  return whiteOutline;
}

async function punchHoleInMask(redMask: Buffer, hole: Buffer): Promise<Buffer> {
  const punchedHole: Buffer = await sharp(redMask)
    .composite([{ input: hole, blend: "dest-out" }]) // original drawn where hole is not
    .png()
    .toBuffer();

  return punchedHole;
}

/**
 * Create a unit with a white outline and a "sustained damage" effect.
 * Also create a mask to tint the unit portion but not the outline or sustained portion.
 */
export async function sustained(
  pngFilename: string,
  sustainedPngFilename: string
) {
  // Input images.
  const unit: Buffer = await sharp(pngFilename).png().toBuffer();
  const sustained: Buffer = await sharp(sustainedPngFilename).png().toBuffer();

  // Red unit-shaped mask.
  const unitMask: Buffer = await redMask(unit);
  //await sharp(unitMask).png().toFile(pngFilename.replace(/.png$/, "-transparent-mask.png"));

  // Unit with a white outline.
  const unitOutlined: Buffer = await whiteOutlinedMask(unit);
  await sharp(unitOutlined)
    .png()
    .toFile(pngFilename.replace(/.png$/, "-outlined.png"));

  // White outline only, unit is a transparent hole.
  const outlineOnly: Buffer = await punchHoleInMask(unitOutlined, unit);
  await sharp(outlineOnly)
    .png()
    .toFile(pngFilename.replace(/.png$/, "-outline-only.png"));

  // Sustained version, outlined unit with sustained effect on top.
  // Clip sustained outline to unit outline.
  let sustainedOutline: Buffer = await whiteOutlinedMask(sustained);
  sustainedOutline = await sharp(sustainedOutline)
    .composite([{ input: unitOutlined, blend: "dest-in" }])
    .png()
    .toBuffer();
  const unitOutlinedWithSustainedOutline: Buffer = await sharp(unitOutlined)
    .composite([{ input: sustainedOutline, blend: "over" }])
    .png()
    .toBuffer();
  await sharp(unitOutlinedWithSustainedOutline).toFile(
    pngFilename.replace(/.png$/, "-sustained.png")
  );

  // Sustained mask is unit minus the padded sustain.
  const sustainedMask: Buffer = await punchHoleInMask(
    unitMask,
    sustainedOutline
  );
  await sharp(sustainedMask)
    .png()
    .toFile(pngFilename.replace(/.png$/, "-sustained-mask.png"));
}
