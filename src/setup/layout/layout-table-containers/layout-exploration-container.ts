import { Container, GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";

export class LayoutExplorationContainer {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const container: GameObject = TI4.spawn.spawnOrThrow(
      "container:pok/exploration"
    );

    const tokenNsids: Array<string> = [
      "token.attachment.planet:codex.affinity/nanoforge",
      "token.attachment.planet:codex.vigil/custodia-vigilia",
      "token.attachment.planet:pok/biotic-research-facility",
      "token.attachment.planet:pok/cybernetic-research-facility",
      "token.attachment.planet:pok/demilitarized-zone",
      "token.attachment.planet:pok/dyson-sphere",
      "token.attachment.planet:pok/geoform",
      "token.attachment.planet:pok/lazax-survivors",
      "token.attachment.planet:pok/mining-world",
      "token.attachment.planet:pok/paradise-world",
      "token.attachment.planet:pok/propulsion-research-facility",
      "token.attachment.planet:pok/rich-world",
      "token.attachment.planet:pok/stellar-converter",
      "token.attachment.planet:pok/tomb-of-emphidia",
      "token.attachment.planet:pok/warfare-research-facility",
      "token.attachment.system:pok/ion-storm",
      "token.attachment.system:pok/mirage",
      "token.attachment.system:pok/wormhole-gamma",
      "token.attachment.system:pok/wormhole-gamma",
      "token.attachment.system:pok/wormhole-gamma",
      "token.attachment.system:pok/wormhole-gamma", // gamma-wormhole, gamma-relay cards
    ];

    const tag: string = "exploration";
    let tags: Array<string>;

    const tokens: Array<GameObject> = tokenNsids.map((tokenNsid) => {
      const token: GameObject = TI4.spawn.spawnOrThrow(tokenNsid);
      tags = token.getTags();
      if (!tags.includes(tag)) {
        tags.push(tag);
        token.setTags(tags);
      }
      return token;
    });
    if (container instanceof Container) {
      container.insert(tokens);

      // Apply tag to restrict what can enter.
      tags = container.getContainerTags();
      if (!tags.includes(tag)) {
        tags.push(tag);
        container.setContainerTags(tags);
      }
    }

    this._layout.add(container).addAfterLayout(() => {
      container.setObjectType(ObjectType.Ground);
    });
  }

  public getLayout() {
    return this._layout;
  }
}
