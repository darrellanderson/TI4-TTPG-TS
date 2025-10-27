import { GameObject } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";

export class LayoutThundersEdgeComponents {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects().setChildDistance(LayoutConfig.spacing);

    const thundersEdge: GameObject = TI4.spawn.spawnOrThrow(
      "token.attachment.system:thunders-edge/thunders-edge"
    );

    this._layout
      .setIsVertical(true)
      .add(thundersEdge)
      .add(this._ingressTokens())
      .add(this._spaceStations());
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }

  _ingressTokens(): LayoutObjects {
    const layout: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacing
    );

    for (let i = 0; i < 7; i++) {
      const ingressToken: GameObject = TI4.spawn.spawnOrThrow(
        "token.attachment.system:thunders-edge/ingress"
      );
      layout.add(ingressToken);
    }
    return layout;
  }

  _spaceStations(): LayoutObjects {
    const layout: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacing
    );

    const spaceStationTokenNsids: string[] = [
      "token.space-station:thunders-edge/1.1",
      "token.space-station:thunders-edge/1.2",
      "token.space-station:thunders-edge/1.3",
      "token.space-station:thunders-edge/1.bastion",
      "token.space-station:thunders-edge/2",
    ];
    for (const nsid of spaceStationTokenNsids) {
      const spaceStation: GameObject = TI4.spawn.spawnOrThrow(nsid);
      layout.add(spaceStation);
    }

    return layout;
  }
}
