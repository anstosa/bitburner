import { NS } from "Bitburner";
import { TerminalLogger } from "/lib/log.js";

export const root = (ns: NS, hostname: string): boolean => {
  const logger = new TerminalLogger(ns);

  if (ns.hasRootAccess(hostname)) {
    logger.log(`Skipping ${hostname}. Already rooted`);
    return true;
  }

  // const hackLevelRequired = ns.getServerRequiredHackingLevel(hostname);
  // const hackLevel = ns.getHackingLevel();
  // if (hackLevelRequired > hackLevel) {
  //   logger.log(
  //     `Can't root ${hostname} yet (Hack Level ${hackLevel} / ${hackLevelRequired})`
  //   );
  //   return false;
  // }

  // const portsRequired = ns.getServerNumPortsRequired(hostname);
  // const portsLevel = 4;
  // if (portsRequired > portsLevel) {
  //   logger.log(
  //     `Can't root ${hostname} yet, (Ports ${portsLevel} / ${portsRequired})`
  //   );
  //   return false;
  // }
  // logger.log(`Rooting ${hostname} (${portsRequired} ports)`);

  logger.log(`Opening ports...`);
  ns.brutessh(hostname);
  ns.ftpcrack(hostname);
  ns.relaysmtp(hostname);
  ns.httpworm(hostname);
  ns.sqlinject(hostname);
  logger.log(`Attempting root...`);
  ns.nuke(hostname);
  if (ns.hasRootAccess(hostname)) {
    logger.info(`Rooted ${hostname}!`);
    return true;
  }
  logger.warn(`Failed to root ${hostname}!`);
  return false;
};

export const main = (ns: NS): void => {
  const [hostname] = ns.args;
  root(ns, String(hostname) ?? ns.getHostname());
};
