import { ImageWidget, refPackageId } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CreateZoomedUiType } from "../../zoomable-ui/zoomable-ui";

const packageId: string = refPackageId;

export class ZoomedStrategyCardUI extends AbstractUI {
  static generateCreateZoomedUi(
    strategyCardNumber: number
  ): CreateZoomedUiType {
    return (scale: number) =>
      new ZoomedStrategyCardUI(scale, strategyCardNumber);
  }

  constructor(scale: number, strategyCardNumber: number) {
    const imageWidget: ImageWidget = new ImageWidget();
    const extraScale: number = 0.9;
    const size: UI_SIZE = {
      w: 512 * scale * extraScale,
      h: 512 * scale * extraScale,
    };
    super(imageWidget, size);

    let image: string | undefined = undefined;
    if (strategyCardNumber === 1) {
      image = "tile/strategy-card/strategy_01.png";
    } else if (strategyCardNumber === 2) {
      image = "tile/strategy-card/strategy_02-codex1.png";
    } else if (strategyCardNumber === 3) {
      image = "tile/strategy-card/strategy_03.png";
    } else if (strategyCardNumber === 4) {
      image = "tile/strategy-card/strategy_04-pok.png";
    } else if (strategyCardNumber === 5) {
      image = "tile/strategy-card/strategy_05.png";
    } else if (strategyCardNumber === 6) {
      image = "tile/strategy-card/strategy_06.png";
    } else if (strategyCardNumber === 7) {
      image = "tile/strategy-card/strategy_07.png";
    } else if (strategyCardNumber === 8) {
      image = "tile/strategy-card/strategy_08.png";
    } else if (strategyCardNumber === -1) {
      image = "tile/strategy-card/1-lux.png";
    } else if (strategyCardNumber === -2) {
      image = "tile/strategy-card/2-noctis.png";
    } else if (strategyCardNumber === -3) {
      image = "tile/strategy-card/3-tyrannus.png";
    } else if (strategyCardNumber === -4) {
      image = "tile/strategy-card/4-civitas.png";
    } else if (strategyCardNumber === -5) {
      image = "tile/strategy-card/5-amicus.png";
    } else if (strategyCardNumber === -6) {
      image = "tile/strategy-card/6-calamitas.png";
    } else if (strategyCardNumber === -7) {
      image = "tile/strategy-card/7-magus.png";
    } else if (strategyCardNumber === -8) {
      image = "tile/strategy-card/8-aeterna.png";
    }
    if (image) {
      imageWidget.setImage(image, packageId);
    }
  }
}
