import { NS } from "Bitburner";
import { Logger, TerminalLogger } from "/lib/log.js";

export const ReadText = {
  readLines(ns: NS, file: string): string[] {
    return (ns.read(file) as string).split(/\r?\n/);
  },

  readNonEmptyLines(ns: NS, file: string): string[] {
    return ReadText.readLines(ns, file).filter((x) => x.trim() !== "");
  },
};

export const DownloadFiles = {
  async getfileToHome(ns: NS, source: string, dest: string): Promise<void> {
    const logger = new TerminalLogger(ns);
    logger.info(`Downloading ${source} -> ${dest}`);

    if (!(await ns.wget(source, dest, "home"))) {
      logger.error(`\tFailed retrieving ${source} -> ${dest}`);
    }
  },
};

interface RepoSettings {
  baseUrl: string;
  manifestPath: string;
}

const repoSettings: RepoSettings = {
  baseUrl: "http://localhost:9182",
  manifestPath: "/resources/manifest.txt",
};

export class RepoInit {
  ns: NS;
  logger: Logger;

  constructor(ns: NS, logger: Logger = new TerminalLogger(ns)) {
    this.ns = ns;
    this.logger = logger;
  }

  private static getSourceDestPair(
    line: string
  ): { source: string; dest: string } | null {
    return line.startsWith("./")
      ? {
          source: `${repoSettings.baseUrl}${line.substring(1)}`,
          dest: line.substring(1),
        }
      : null;
  }

  async pullScripts(): Promise<void> {
    await this.getManifest();
    await this.downloadAllFiles();
  }

  async getManifest(): Promise<void> {
    const manifestUrl = `${repoSettings.baseUrl}${repoSettings.manifestPath}`;

    this.logger.log(`Getting manifest...`);

    await DownloadFiles.getfileToHome(
      this.ns,
      manifestUrl,
      repoSettings.manifestPath
    );
  }

  async downloadAllFiles(): Promise<void> {
    const files = ReadText.readNonEmptyLines(
      this.ns,
      repoSettings.manifestPath
    );

    this.logger.log(`Contents of manifest:`);
    this.logger.log(`\t${files}`);

    for (const file of files) {
      const pair = RepoInit.getSourceDestPair(file);

      if (!pair) {
        this.logger.error(`Could not read line ${file}`);
        return;
      }

      await DownloadFiles.getfileToHome(this.ns, pair.source, pair.dest);
    }
  }
}
