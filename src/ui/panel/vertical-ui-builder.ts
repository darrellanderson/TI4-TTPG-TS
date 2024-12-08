import {
  HorizontalAlignment,
  LayoutBox,
  VerticalBox,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

/**
 * Entries can be of varying sizes, aligned to left.
 */
export class VerticalUIBuilder {
  private readonly _uis: Array<AbstractUI> = [];
  private _horizontalAligntment: HorizontalAlignment = HorizontalAlignment.Left;
  private _padding: number = 0;
  private _spacing: number = 0;

  addUIs(uis: Array<AbstractUI>): VerticalUIBuilder {
    this._uis.push(...uis);
    return this;
  }

  setHorizontalAlignment(
    horizontalAlignment: HorizontalAlignment
  ): VerticalUIBuilder {
    this._horizontalAligntment = horizontalAlignment;
    return this;
  }

  setPadding(padding: number): VerticalUIBuilder {
    this._padding = padding;
    return this;
  }

  setSpacing(spacing: number): VerticalUIBuilder {
    this._spacing = spacing;
    return this;
  }

  build(): AbstractUI {
    const panel: VerticalBox = new VerticalBox()
      .setChildDistance(this._spacing)
      .setHorizontalAlignment(this._horizontalAligntment);
    const panelBox: Widget = new LayoutBox()
      .setPadding(
        this._padding,
        this._padding,
        this._padding,
        this._padding - 1 // -1 to prevent scrollbar
      )
      .setChild(panel);

    // Calculate size while adding entries.
    let maxWidth = 0;
    let height = 0; // add padding later
    this._uis.forEach((entry: AbstractUI, index: number) => {
      const entrySize: UI_SIZE = entry.getSize();
      maxWidth = Math.max(maxWidth, entrySize.w);
      if (index > 0) {
        height += this._spacing;
      }
      height += entrySize.h;
      panel.addChild(entry.getWidget());
    });
    const panelSize: UI_SIZE = {
      w: maxWidth + this._padding * 2,
      h: height + this._padding * 2,
    };

    return new (class HorizontalUI extends AbstractUI {
      constructor() {
        super(panelBox, panelSize);
      }
    })();
  }
}
