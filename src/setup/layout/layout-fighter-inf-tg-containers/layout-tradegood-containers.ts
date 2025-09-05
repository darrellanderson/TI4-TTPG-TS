import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { Container, GameObject, ObjectType } from "@tabletop-playground/api";

export class LayoutTradegoodContainers {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(false);

    const nsidNames: Array<string> = [
      "tradegood-commodity-1",
      "tradegood-commodity-3",
    ];

    const containers: Array<GameObject> = [];
    nsidNames.forEach((nsidName) => {
      const tokenNsid: string = `token:base/${nsidName}`;
      const containerNsid: string = `container.${tokenNsid}`;

      const token: GameObject = TI4.spawn.spawnOrThrow(tokenNsid);
      let tags: Array<string> = token.getTags();
      tags.push(nsidName);
      token.setTags(tags);

      const container: GameObject = TI4.spawn.spawnOrThrow(containerNsid);
      containers.push(container);

      if (container instanceof Container) {
        container.setType(1); // infinite
        container.insert([token]);
        tags = container.getContainerTags();
        tags.push(nsidName);
        container.setContainerTags(tags);
      }
      container.setRotation([0, 0, 180]);
      this._layout.add(container);
    });

    this._layout.addAfterLayout(() => {
      containers.forEach((container) => {
        container.setObjectType(ObjectType.Ground);
      });
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
