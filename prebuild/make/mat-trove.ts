const CELL_W: number = 308;
const CELL_H: number = 308;

const W_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * CELL_W) / W_WORLD);

const COLOR: string = "#171717";

import {
  CreateBoard,
  CreateBoardParams,
  ZCanvasCell,
  ZImageCell,
  ZPaddedCell,
  ZRowCell,
} from "../../../ttpg-darrell/src/index-ext";

function troveCell(): ZCanvasCell {
  const landscapeCell: ZImageCell = {
    type: "ImageCell",
    width: 308,
    height: 220,
    imageFile: "prebuild/mat/slot/slot-landscape.jpg",
  };
  const portraitCell: ZImageCell = {
    type: "ImageCell",
    width: 220,
    height: 308,
    imageFile: "prebuild/mat/slot/slot-portrait.jpg",
  };
  return {
    type: "CanvasCell",
    width: CELL_W,
    height: CELL_H,
    children: [
      {
        left: 0,
        top: (308 - 220) / 2,
        child: landscapeCell,
      },
      {
        left: (308 - 220) / 2,
        top: 0,
        child: portraitCell,
      },
    ],
    snapPoints: [{}],
  };
}

function troveRow(): ZRowCell {
  return {
    type: "RowCell",
    spacing: SPACING,
    children: [troveCell(), troveCell(), troveCell(), troveCell(), troveCell()],
  };
}

function troveMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: troveRow(),
    background: COLOR,
  };
}

const params: CreateBoardParams = {
  templateName: "Player Trove Mat",
  assetFilename: "mat/player-trove",
  templateMetadata: "mat.player:base/trove",
  srcImage: troveMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: CELL_W, world: W_WORLD },
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
