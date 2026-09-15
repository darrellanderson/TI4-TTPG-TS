import {
  NsidNameSchema,
  NsidNameSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { SOURCE_TO_GENOME_DATA } from "../data/genome.data";
import { GenomeSchema, GenomeSchemaType } from "../schema/genome-schema";
import { Genome } from "../twilights-fall/genome";

export class TFGenomeRegistry {
  private readonly _nsidToGenome: Map<string, Genome> = new Map();

  getAllNsids(): Array<string> {
    return Array.from(this._nsidToGenome.keys());
  }

  getAllGenomes(): Array<Genome> {
    return Array.from(this._nsidToGenome.values());
  }

  getByNsid(nsid: string): Genome | undefined {
    return this._nsidToGenome.get(nsid);
  }

  load(source: NsidNameSchemaType, genomeSchemas: Array<GenomeSchemaType>): this {
    for (const genomeSchema of genomeSchemas) {
      // Validate schema (otherwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        GenomeSchema.parse(genomeSchema);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          genomeSchema
        )}`;
        throw new Error(msg);
      }

      const genome: Genome = new Genome(source, genomeSchema);
      const nsid: string = genome.getNsid();

      if (this._nsidToGenome.has(nsid)) {
        throw new Error(`duplicate nsid: ${nsid}`);
      }

      this._nsidToGenome.set(nsid, genome);
    }
    return this;
  }

  loadDefaultData(): this {
    for (const [source, genomeSchemas] of Object.entries(SOURCE_TO_GENOME_DATA)) {
      this.load(source, genomeSchemas);
    }
    return this;
  }
}
