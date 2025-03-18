import {
  MockContainer,
  MockGameObject,
  MockPlayer,
  MockVector,
} from "ttpg-mock";
import { ReportCommandTokenPutGet } from "./report-command-token-put-get";
import { GameObject, Player, Vector } from "@tabletop-playground/api";

it("constructor/init", () => {
  new ReportCommandTokenPutGet().init();
});

it("insert/remove", () => {
  jest.useFakeTimers();

  new MockGameObject(); // already existing object
  new ReportCommandTokenPutGet().init();

  const container: MockContainer = new MockContainer({
    templateMetadata: "container.token.command:base/generic",
  });
  const token: GameObject = new MockGameObject();

  const objets: Array<GameObject> = [token];
  const index: number | undefined = undefined;
  const showAnimation: boolean | undefined = undefined;
  const player: Player = new MockPlayer();
  container._addObjectsAsPlayer(objets, index, showAnimation, player);
  container._addObjectsAsPlayer(objets, index, showAnimation, player);

  const pos: Vector = new MockVector(0, 0, 0);
  const keep: boolean | undefined = false;
  container._takeAsPlayer(token, pos, showAnimation, keep, player);
  container._takeAsPlayer(token, pos, showAnimation, keep, player);

  // Multiple tokens.
  jest.runAllTimers();

  // Single token (not plural).
  container._addObjectsAsPlayer(objets, index, showAnimation, player);
  jest.runAllTimers();
});
