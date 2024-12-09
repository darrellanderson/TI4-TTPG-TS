import {
  HorizontalAlignment,
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

    // Place insize a "with padding" layout box.
    // Panels like to add scrollbars even with an exact fit,
    // set a negative excess padding to absorb extra.
    const panelBox: Widget = new LayoutBox()
      .setOverrideWidth(panelSize.w)
      .setOverrideHeight(panelSize.h)
      .setPadding(this._padding, -100, this._padding, 0)
      .setHorizontalAlignment(HorizontalAlignment.Left)
      .setVerticalAlignment(VerticalAlignment.Top)
      .setChild(panel);

    return new (class HorizontalUI extends AbstractUI {
      constructor() {
        super(panelBox, panelSize);
      }
    })();
  }
}
