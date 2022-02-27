import { NS } from "Bitburner";
import { TerminalLogger } from "/lib/log.js";

type Key = string;
type Value = string | number;
type Database = Record<Key, Value>;

export class Storage {
  ns: NS;
  file: string;

  constructor(ns: NS, file: string) {
    this.ns = ns;
    this.file = file;
  }

  read = async (): Promise<Database> => {
    const data = await this.ns.read(this.file);
    if (!data) {
      return {};
    }
    return JSON.parse(data);
  };

  write = async (database: Database): Promise<void> => {
    await this.ns.write(this.file, [JSON.stringify(database)], "w");
  };

  set = async (key: Key, value: Value): Promise<void> => {
    const database = await this.read();
    database[key] = value;
    await this.write(database);
  };

  get = async (key: Key): Promise<Value> => {
    const database = await this.read();
    return database[key];
  };
}

export const main = async (ns: NS): Promise<void> => {
  const logger = new TerminalLogger(ns);
  logger.info("Testing db.js with test.txt");
  const storage = new Storage(ns, "test.txt");
  logger.info("Saving foo=bar");
  storage.set("foo", "bar");
  logger.info(`Retrieved foo=${await storage.get("foo")}`);
};
