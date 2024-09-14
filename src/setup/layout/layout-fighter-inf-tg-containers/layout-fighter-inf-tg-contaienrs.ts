import { LayoutObjects, NSID, Spawn } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { Container, GameObject, ObjectType } from "@tabletop-playground/api";

export class LayoutFighterInfTgContainers {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingExtraWide)
      .setIsVertical(true);

    const left: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true);
    const right: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true);
    const leftAndRight = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(false)
      .add(left)
      .add(right);

    const containers: Array<GameObject> = [
      Spawn.spawnOrThrow("container.token:base/fighter-1"),
      Spawn.spawnOrThrow("container.token:base/fighter-3"),
      Spawn.spawnOrThrow("container.token:base/infantry-1"),
      Spawn.spawnOrThrow("container.token:base/infantry-3"),
      Spawn.spawnOrThrow("container.token:base/tradegood-commodity-1"),
      Spawn.spawnOrThrow("container.token:base/tradegood-commodity-3"),
    ];
    containers.forEach((container, index) => {
      const contentNsid: string = NSID.get(container).substring(
        "container.".length
      );
      const namePart: string | undefined =
        NSID.parse(contentNsid)?.nameParts[0];

      const token: GameObject = Spawn.spawnOrThrow(contentNsid);
      let tags: Array<string> = token.getTags();
      if (namePart && !tags.includes(namePart)) {
        tags.push(namePart);
        token.setTags(tags);
      }

      if (container instanceof Container) {
        container.setType(1); // infinite
        container.insert([token]);
        tags = container.getContainerTags();
        if (namePart && !tags.includes(namePart)) {
          tags.push(namePart);
          container.setContainerTags(tags);
        }
      }
      container.setRotation([0, 0, 180]);
      if (index % 2 === 0) {
        left.add(container);
      } else {
        right.add(container);
      }
    });

    const topGarbage: GameObject = Spawn.spawnOrThrow("container:base/garbage");
    const bottompGarbage: GameObject = Spawn.spawnOrThrow(
      "container:base/garbage"
    );

    this._layout.add(topGarbage).add(leftAndRight).add(bottompGarbage);

    this._layout.addAfterLayout(() => {
      containers.forEach((container) => {
        container.setObjectType(ObjectType.Ground);
      });
      topGarbage.setObjectType(ObjectType.Ground);
      bottompGarbage.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
