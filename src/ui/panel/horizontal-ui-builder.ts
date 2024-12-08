import {
  HorizontalBox,
  LayoutBox,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";

/**
 * Entries can be of varying sizes, aligned to top.
 */
export class HorizontalUIBuilder {
  private readonly _uis: Array<AbstractUI> = [];
  private _padding: number = 0;
  private _spacing: number = 0;
  private _verticalAlignment: VerticalAlignment = VerticalAlignment.Top;

  addUIs(uis: Array<AbstractUI>): HorizontalUIBuilder {
    this._uis.push(...uis);
    return this;
  }

  setPadding(padding: number): HorizontalUIBuilder {
    this._padding = padding;
    return this;
  }

  setSpacing(spacing: number): HorizontalUIBuilder {
    this._spacing = spacing;
    return this;
  }

  setVerticalAlignment(
    verticalAlignment: VerticalAlignment
  ): HorizontalUIBuilder {
    this._verticalAlignment = verticalAlignment;
    return this;
  }

  build(): AbstractUI {
    const panel: HorizontalBox = new HorizontalBox()
      .setChildDistance(this._spacing)
      .setVerticalAlignment(this._verticalAlignment);
    const panelBox: Widget = new LayoutBox()
      .setPadding(
        this._padding,
        this._padding - 1, // -1 to prevent scrollbar
        this._padding,
        this._padding
      )
      .setChild(panel);

    // Calculate size while adding out entries.
    let maxHeight = 0;
    let width = 0; // add padding later
    this._uis.forEach((entry: AbstractUI, index: number) => {
      const entrySize: UI_SIZE = entry.getSize();
      maxHeight = Math.max(maxHeight, entrySize.h);
      if (index > 0) {
        width += this._spacing;
      }
      width += entrySize.w;

      panel.addChild(entry.getWidget());
    });
    const panelSize: UI_SIZE = {
      w: width + this._padding * 2,
      h: maxHeight + this._padding * 2,
    };

    return new (class HorizontalUI extends AbstractUI {
      constructor() {
        super(panelBox, panelSize);
      }
    })();
  }
}
