import { NS } from "Bitburner";
import { TerminalLogger } from "/lib/log.js";

export const start = async (ns: NS, hostname: string): Promise<void> => {
  const logger = new TerminalLogger(ns);

  // first spread
  const hackProcess = ns.exec("spread.js", hostname, 1, ns.getHostname());

  // wait until complete
  do {
    await ns.sleep(250);
  } while (ns.isRunning(String(hackProcess), hostname));

  // now hack
  const ram = ns.getServerMaxRam(hostname);
  const cost = ns.getScriptRam("hack.js");
  const threads = Math.floor(ram / cost);
  if (threads === 0) {
    logger.warn(`Not enough RAM to run hack on ${hostname}`);
    return;
  }
  ns.exec("hack.js", hostname, threads);
  logger.info(`Started hacking ${hostname} with ${threads} threads`);
};

export const main = async (ns: NS): Promise<void> => {
  const [hostname] = ns.args;
  await start(ns, String(hostname) ?? ns.getHostname());
};
