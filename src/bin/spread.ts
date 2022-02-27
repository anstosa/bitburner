import { NS } from "Bitburner";
import { update } from "/lib/update.js";
import { root } from "/lib/root.js";
import { start } from "/lib/start.js";
import { Logger } from "/lib/log.js";

const HOST_DENYLIST = ["darkweb"];

const scan = async (ns: NS, sourceHostname: string): Promise<void> => {
  const logger = new Logger(ns);

  logger.log("Scanning network");
  const hostnames = ns.scan();
  let previousPromise = Promise.resolve();
  hostnames.forEach((hostname) => {
    // skip denylisted servers
    if (HOST_DENYLIST.includes(hostname)) {
      return;
    }

    // skip source server to avoid loops
    if (hostname === sourceHostname) {
      return;
    }

    previousPromise = previousPromise.then(async () => {
      logger.log(`Checking ${hostname}`);
      const hasRoot = await root(ns, hostname);
      if (!hasRoot) {
        return;
      }
      await update(ns, hostname);
      await start(ns, hostname);
    });
  });
  await previousPromise;
  // wait 10 seconds and try again
  // await ns.asleep(10 * 1000);
  // sreturn await scan(ns);
};

export const main = async (ns: NS): Promise<void> => {
  const logger = new Logger(ns);

  const [sourceHostname] = ns.args;
  logger.log("Starting spread.js");
  await scan(ns, String(sourceHostname));
};
