/**
 * Combine base planet and pok legendary planet in one mat.
 */

import {
  CreateBoard,
  CreateBoardParams,
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZTextCell,
} from "../../../ttpg-darrell/src/index-ext";

const PORTRAIT_W: number = 220;
const PORTRAIT_H: number = 308;

const H_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * PORTRAIT_H) / H_WORLD);

const COLOR: string = "#171717";

function getSlotPortrait(tags: Array<string>): ZImageCell {
  const slotCell: ZImageCell = {
    type: "ImageCell",
    width: PORTRAIT_W,
    height: PORTRAIT_H,
    imageFile: "prebuild/mat/slot/slot-portrait.jpg",
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

function getGrid(): ZColCell {
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [getSlotPortrait(["card-technology"]), getLabel("Technology")],
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
  templateName: "Player Technology Deck Mat",
  assetFilename: "mat/player-technology-deck",
  templateMetadata: "mat.player:base/technology-deck",
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
