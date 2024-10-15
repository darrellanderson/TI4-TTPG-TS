import {
  CreateBoard,
  CreateBoardParams,
  ZImageCell,
  ZPaddedCell,
} from "../../../ttpg-darrell/src/index-ext";

const HEX_W_WORLD: number = 17.32 * 2;
const HEX_H_WORLD: number = 15 * 2;

const HEX_W: number = 1024;
const HEX_H: number = Math.round((HEX_H_WORLD / HEX_W_WORLD) * HEX_W);

const SPACING_WORLD: number = 0.5;
const SPACING: number = Math.round(SPACING_WORLD * (HEX_W / HEX_W_WORLD));

function getGrid(): ZImageCell {
  return {
    type: "ImageCell",
    width: HEX_W,
    height: HEX_H,
    imageFile: "prebuild/tile/system/blank.png",
  };
}

function getMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: getGrid(),
    background: "#171717",
  };
}
const params: CreateBoardParams = {
  templateName: "Combat Arena Mat",
  assetFilename: "mat/combat-arena",
  templateMetadata: "mat:base/combat-arena",
  scriptName: "obj/combat-arena-obj.js",
  srcImage: getMat(),
  topDownWorldSize: {
    width: HEX_W_WORLD,
    height: HEX_H_WORLD,
    depth: 0.25,
  },
  preshrink: 512,
};

async function go() {
  const createBoard = new CreateBoard(params);
  await createBoard.clean();
  await createBoard.writeFiles();
}
go();
