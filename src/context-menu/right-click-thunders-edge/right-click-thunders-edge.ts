import { GameObject } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

export class RightClickThundersEdge implements IGlobal {
  init(): void {}

  _maybeAddContextMenuOption(obj: GameObject): void {
    const thundersEdgeNsid: string =
      "token.attachment.system:thunders-edge/thunders-edge";
  }
}
