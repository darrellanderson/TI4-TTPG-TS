import { Canvas } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";

/**
 * Show all techs, with owned and prerequisites highlighted.
 */
export class ChooseTechologyUI extends AbstractUI {
  constructor(_scale: number, _playerSlot: number) {
    const canvas: Canvas = new Canvas();
    const size: UI_SIZE = { w: 100, h: 100 };
    super(canvas, size);
  }
}
