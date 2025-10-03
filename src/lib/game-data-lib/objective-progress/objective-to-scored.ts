import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Atop, CardUtil, NSID, PlayerSlot } from "ttpg-darrell";

/**
 * Get a map from public objective NSIDs to the player slots that have already scored them.
 * A secret can be "public" if it is on the objective mat.
 */
export class ObjectiveToScored {
  private readonly _cardUtil: CardUtil = new CardUtil();

  nsidToScored(): Map<string, Array<PlayerSlot>> {
    const nsidToScored = new Map<string, Array<PlayerSlot>>();

    let controlTokens: Array<GameObject> = [];
    let objectives: Array<GameObject> = [];
    const objectiveMats: Array<GameObject> = [];

    const skipContained: boolean = true;
    const allowFaceDown: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);

      if (nsid.startsWith("token.control:")) {
        controlTokens.push(obj);
      } else if (
        nsid.startsWith("card.objective.") &&
        this._cardUtil.isLooseCard(obj, allowFaceDown)
      ) {
        objectives.push(obj);
      } else if (nsid.startsWith("mat:base/objective-")) {
        objectiveMats.push(obj);
      }
    }

    // Restrict to control tokens and objectives on objective mats.
    const atops: Array<Atop> = objectiveMats.map(
      (mat: GameObject): Atop => new Atop(mat)
    );
    controlTokens = controlTokens.filter((obj: GameObject): boolean => {
      const pos: Vector = obj.getPosition();
      for (const atop of atops) {
        if (atop.isAtop(pos)) {
          return true;
        }
      }
      return false;
    });
    objectives = objectives.filter((obj: GameObject): boolean => {
      const pos: Vector = obj.getPosition();
      for (const atop of atops) {
        if (atop.isAtop(pos)) {
          return true;
        }
      }
      return false;
    });

    // Build result.
    objectives.forEach((obj: GameObject): void => {
      const nsid: string = NSID.get(obj);
      const scoredBy: Array<PlayerSlot> = [];
      nsidToScored.set(nsid, scoredBy); // register objective, even if not scored

      const atop: Atop = new Atop(obj);
      controlTokens.forEach((token: GameObject): void => {
        const pos: Vector = token.getPosition();
        if (atop.isAtop(pos)) {
          const owner: PlayerSlot = token.getOwningPlayerSlot();
          scoredBy.push(owner);
        }
      });
    });

    return nsidToScored;
  }
}
