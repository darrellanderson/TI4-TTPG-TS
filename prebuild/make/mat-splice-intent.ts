/**
 * Central control tokens, "yes" and "no" areas left/right.
 */

import {
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZRowCell,
  ZTextCell,
} from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/image/cell/cell-parser/cell-schema";
import { CreateBoardParams } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board-params";
import { CreateBoard } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board";

const PORTRAIT_W: number = 220;
const PORTRAIT_H: number = 308;

const CONTROL_W: number = Math.round((308 * 0.875) / 2.48);
const CONTROL_H: number = Math.round((220 * 0.5) / 1.65);

const H_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * PORTRAIT_H) / H_WORLD);

const COLOR: string = "#171717";

function getSlot(tags: Array<string>, tint: string | undefined): ZImageCell {
  const slotCell: ZImageCell = {
    type: "ImageCell",
    width: PORTRAIT_W,
    height: PORTRAIT_W, // square
    imageFile: "prebuild/mat/slot/slot-landscape.jpg",
    tint,
    snapPoints: [{ tags }],
  };
  return slotCell;
}

function getLabel(labelText: string): ZTextCell {
  return {
    type: "TextCell",
    width: PORTRAIT_W,
    height: 24,
    text: labelText.toUpperCase(),
    textColor: "#ffffff",
    fontSize: 24,
    font: "Handel Gothic", // font installed on system
  };
}

function getLabelLandscape(
  labelText: string,
  tint: string | undefined,
  tags: Array<string>,
): ZColCell {
  const slotCell: ZImageCell = getSlot(tags, tint);
  const labelCell: ZTextCell = getLabel(labelText);
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [slotCell, labelCell],
  };
}

function getGrid(): ZRowCell {
  return {
    type: "RowCell",
    spacing: SPACING,
    children: [
      getLabelLandscape("no", "#ff0000", ["splice-no"]),
      getLabelLandscape("", undefined, ["spice-null"]),
      getLabelLandscape("yes", "#00ff00", ["splice-yes"]),
    ],
  };
}

function getMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: getGrid(),
    background: COLOR,
  };
}

const params: CreateBoardParams = {
  templateName: "TF Splice Intent Mat",
  assetFilename: "mat/tf-splice-intent",
  templateMetadata: "mat:twilights-fall/splice-intent",
  scriptName: "ref-obj/mat-tf-splice-intent.js",
  srcImage: getMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: PORTRAIT_H, world: H_WORLD },
    depth: 0.25,
  },
  preshrink: 1024,
};

async function go() {
  const createBoard = new CreateBoard(params);
  await createBoard.clean();
  await createBoard.writeFiles();
}
go();
