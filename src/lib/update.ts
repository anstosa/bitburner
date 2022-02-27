import { NS } from "Bitburner";
import { TerminalLogger } from "/lib/log.js";

export const update = async (ns: NS, hostname: string): Promise<void> => {
  const logger = new TerminalLogger(ns);

  // make sure we have root
  if (!ns.hasRootAccess(hostname)) {
    logger.error(`${hostname} update failed. No root.`);
    return;
  }

  // kill scripts
  ns.killall(hostname);

  // send files
  await ns.scp("restart.js", "home", hostname);
  await ns.scp("spread.js", "home", hostname);
  await ns.scp("/lib/update.js", "home", hostname);
  await ns.scp("/lib/root.js", "home", hostname);
  await ns.scp("/lib/start.js", "home", hostname);
  await ns.scp(`hack.js`, "home", hostname);

  logger.info(`Updated ${hostname}`);
};

export const main = async (ns: NS): Promise<void> => {
  const [hostname] = ns.args;
  await update(ns, String(hostname) ?? ns.getHostname());
};
