import {
  HorizontalAlignment,
  LayoutBox,
  VerticalAlignment,
  VerticalBox,
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
  private _overrideHeight: number = -1;

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

  setOverrideHeight(overrideHeight: number): VerticalUIBuilder {
    this._overrideHeight = overrideHeight;
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

    if (this._overrideHeight > 0) {
      panelSize.h = this._overrideHeight;
    }

    // Place insize a "with padding" layout box.
    // Panels like to add scrollbars even with an exact fit,
    // set a negative excess padding to absorb extra.
    const panelBox: LayoutBox = new LayoutBox()
      .setOverrideWidth(panelSize.w)
      .setOverrideHeight(panelSize.h)
      .setPadding(this._padding, 0, this._padding, -100)
      .setHorizontalAlignment(HorizontalAlignment.Left)
      .setVerticalAlignment(VerticalAlignment.Top)
      .setChild(panel);

    if (this._overrideHeight > 0) {
      panelBox.setPadding(0, 0, 0, 0);
    }

    const uis: Array<AbstractUI> = this._uis;
    return new (class HorizontalUI extends AbstractUI {
      constructor() {
        super(panelBox, panelSize);
      }

      destroy(): void {
        uis.forEach((entry: AbstractUI) => {
          entry.destroy();
        });
        super.destroy();
      }
    })();
  }
}
