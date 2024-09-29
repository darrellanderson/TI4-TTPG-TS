import { Container, GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutFrontierContainer {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const container: GameObject = Spawn.spawnOrThrow(
      "container.token:pok/frontier",
    );
    container.setRotation([0, 0, 180]);
    this._layout.add(container).addAfterLayout(() => {
      container.setObjectType(ObjectType.Ground);
    });

    const tag: string = "frontier";
    let tags: Array<string>;
    if (container instanceof Container) {
      // Apply tag to restrict what can enter.
      tags = container.getContainerTags();
      if (!tags.includes(tag)) {
        tags.push(tag);
        container.setContainerTags(tags);
      }
    }

    const tokenNsid: string = "token.attachment.system:pok/frontier";
    const token: GameObject = Spawn.spawnOrThrow(tokenNsid);
    tags = token.getTags();
    if (!tags.includes(tag)) {
      tags.push(tag);
      token.setTags(tags);
    }
  }

  public getLayout() {
    return this._layout;
  }
}
