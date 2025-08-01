import { world } from "@tabletop-playground/api";
import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
import { z } from "zod";

export const ConfigSchema = z
  .object({
    playerCount: z.number().int().min(1).max(8),
    gamePoints: z.number().int().min(8).max(14),
    timestamp: z.number(), // game start Unix timestamp, seconds since epoch.
    sources: z.array(z.string()),
    exportGameData: z.boolean(),
    reportErrors: z.boolean(),
  })
  .strict();

export type ConfigSchemaType = z.infer<typeof ConfigSchema>;

export class Config {
  public readonly onConfigChanged: TriggerableMulticastDelegate<
    (config: Config) => void
  > = new TriggerableMulticastDelegate<(config: Config) => void>();

  private readonly _namespaceId: NamespaceId;
  private readonly _config: ConfigSchemaType;

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;

    const json: string = world.getSavedData(this._namespaceId);
    if (json && json.length > 0) {
      this._config = ConfigSchema.parse(JSON.parse(json));
    } else {
      this._config = {
        playerCount: 6,
        gamePoints: 10,
        timestamp: 0,
        sources: [
          "base",
          "pok",
          "codex.affinity",
          "codex.ordinian",
          "codex.vigil",
          "codex.liberation",
          // "thunders-edge",
        ],
        exportGameData: true,
        reportErrors: true,
      };
    }
  }

  _save(): void {
    const json: string = JSON.stringify(
      this._config,
      Object.keys(this._config).sort()
    );
    world.setSavedData(json, this._namespaceId);
  }

  get playerCount(): number {
    return this._config.playerCount;
  }

  get gamePoints(): number {
    return this._config.gamePoints;
  }

  get sources(): Array<string> {
    return [...this._config.sources];
  }

  get timestamp(): number {
    return this._config.timestamp;
  }

  get exportGameData(): boolean {
    return this._config.exportGameData;
  }

  get reportErrors(): boolean {
    return this._config.reportErrors;
  }

  setPlayerCount(playerCount: number): this {
    this._config.playerCount = playerCount;
    this._save();
    this.onConfigChanged.trigger(this);
    return this;
  }

  setGamePoints(gamePoints: number): this {
    this._config.gamePoints = gamePoints;
    this._save();
    this.onConfigChanged.trigger(this);
    return this;
  }

  setSources(sources: Array<string>): this {
    this._config.sources = sources;
    this._save();
    this.onConfigChanged.trigger(this);
    return this;
  }

  setTimestamp(timestamp: number): this {
    this._config.timestamp = timestamp;
    this._save();
    this.onConfigChanged.trigger(this);
    return this;
  }

  setExportGameData(exportGameData: boolean): this {
    this._config.exportGameData = exportGameData;
    this._save();
    this.onConfigChanged.trigger(this);
    return this;
  }

  setReportErrors(reportErrors: boolean): this {
    this._config.reportErrors = reportErrors;
    this._save();
    this.onConfigChanged.trigger(this);
    return this;
  }
}
