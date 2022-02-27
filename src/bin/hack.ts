import { NS } from "Bitburner";
import { Logger } from "/lib/log.js";

const HOSTNAME_DENY_MATCH = /(^home$|^cluster\d+$)/;

const hack = async (ns: NS, hostname: string): Promise<void> => {
  const logger = new Logger(ns);

  const projection = ns.hackAnalyzeChance(hostname);
  if (projection < 0.75) {
    logger.log(
      `Difficult hack (${(projection * 100).toFixed(1)}%), weakening...`
    );
    await ns.weaken(hostname);
    return await hack(ns, hostname);
  }

  const hackShare = ns.hackAnalyze(hostname);
  const serverWallet = ns.getServerMoneyAvailable(hostname);

  if (hackShare * serverWallet < 1000) {
    logger.log(
      `Cheap hack (\$${(hackShare * serverWallet).toFixed(2)}), growing...`
    );
    await ns.grow(hostname);
    return await hack(ns, hostname);
  }

  logger.log("Hacking...");
  await ns.hack(hostname);
  return await hack(ns, hostname);
};

export const main = async (ns: NS): Promise<void> => {
  const logger = new Logger(ns);

  logger.log("Starting hack.js");
  const hostname = ns.getHostname();

  // don't hack self
  if (hostname.match(HOSTNAME_DENY_MATCH)) {
    return;
  }

  await hack(ns, hostname);
};
