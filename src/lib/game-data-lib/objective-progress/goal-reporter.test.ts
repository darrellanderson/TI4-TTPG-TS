// klawSync needs process.{env,version} to be defined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).env = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(process as any).version = "0";

import fs from "fs";
import klawSync from "klaw-sync";

import { GOAL_DATA_ENTRIES, GoalDataEntry } from "./goal.data";
import { GoalReporter } from "./goal-reporter";
import { MockCardHolder } from "ttpg-mock";
import { GoalProgressType } from "./goal-progress";

it("goal data entries", () => {
  GOAL_DATA_ENTRIES.forEach((entry: GoalDataEntry): void => {
    entry.get();
  });
});

it("streamer buddy toggle", () => {
  const goalReporter: GoalReporter = new GoalReporter();
  goalReporter.init();

  TI4.useStreamerBuddy.setUseStreamerBuddy(true);
  TI4.useStreamerBuddy.setUseStreamerBuddy(false);
});

it("interval handler", () => {
  jest.useFakeTimers();

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const goalReporter: GoalReporter = new GoalReporter();
  goalReporter.init();
  TI4.useStreamerBuddy.setUseStreamerBuddy(true);

  jest.advanceTimersByTime(1000);
});

it("getters", () => {
  const goalReporter: GoalReporter = new GoalReporter();
  goalReporter.init();

  const goalData: ReadonlyArray<GoalDataEntry> =
    goalReporter.getAllGoalDataEntries();
  expect(goalData).toHaveLength(GOAL_DATA_ENTRIES.length);

  const progress: GoalProgressType | undefined =
    goalReporter.getGoalProgress("type:source/name");
  expect(progress).toBeUndefined();
});

it("validate NSIDs appear in assets/Templates", () => {
  // Scan templates for NSIDs.
  const templateNsids: Set<string> = new Set();
  const entries: readonly klawSync.Item[] = klawSync("assets/Templates/", {
    nodir: true,
    traverseAll: true,
    filter: (item) => {
      return item.path.endsWith(".json");
    },
  });
  const regex: RegExp = /"(card\.objective\..*)"/;
  for (const entry of entries) {
    const data: Buffer = fs.readFileSync(entry.path);
    const lines: Array<string> = data.toString().split("\n");
    for (const line of lines) {
      const match: RegExpMatchArray | null = line.match(regex);
      const nsid: string | undefined = match?.[1];
      if (nsid) {
        templateNsids.add(nsid);
      }
    }
  }

  const nsids: Array<string> = [];
  for (const goalDataEntry of GOAL_DATA_ENTRIES) {
    const nsid: string = goalDataEntry.nsid;
    nsids.push(nsid);
  }

  const missing: Array<string> = [];
  for (const nsid of nsids) {
    if (!templateNsids.has(nsid)) {
      missing.push(nsid);
    }
  }
  if (missing.length > 0) {
    console.log("missing", missing.join("\n"));
  }
  expect(missing).toHaveLength(0);
});
