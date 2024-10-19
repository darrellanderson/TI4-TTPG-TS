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

const LANDSCAPE_H: number = 220;
const LANDSCAPE_W: number = 308;

const W_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * LANDSCAPE_W) / W_WORLD);

const COLOR: string = "#171717";

function getSlotPortrait(tags: Array<string>): ZImageCell {
  const slotCell: ZImageCell = {
    type: "ImageCell",
    width: LANDSCAPE_W,
    height: LANDSCAPE_H,
    imageFile: "prebuild/mat/slot/slot-landscape.jpg",
    snapPoints: [{ tags }],
  };
  return slotCell;
}

function getLabel(labelText: string): ZTextCell {
  return {
    type: "TextCell",
    width: LANDSCAPE_W,
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
    children: [
      getSlotPortrait(["deck-technology", "card-technology"]),
      getLabel("Technology"),
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
  templateName: "Player Technology Deck Mat",
  assetFilename: "mat/player-technology-deck",
  templateMetadata: "mat.player:base/technology-deck",
  srcImage: getMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: LANDSCAPE_W, world: W_WORLD },
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
