import { world } from "@tabletop-playground/api";
import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
import { z } from "zod";

export const ConfigSchema = z
  .object({
    playerCount: z.number().int().min(1).max(8),
    timestamp: z.number(), // Unix timestamp, seconds since epoch.
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
        playerCount: 0,
        timestamp: 0,
      };
    }
  }

  _save(): void {
    const json: string = JSON.stringify(this._config);
    world.setSavedData(json, this._namespaceId);
    console.log("xxx", json);
  }

  get playerCount(): number {
    return this._config.playerCount;
  }

  get timestamp(): number {
    return this._config.timestamp;
  }

  setPlayerCount(playerCount: number): this {
    this._config.playerCount = playerCount;
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
}
