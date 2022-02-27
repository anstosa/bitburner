/** @param {NS} ns **/
export const main = async (ns) => {
  const [scriptName] = ns.args;
  if (!scriptName) {
    ns.alert("Script name required.");
    return;
  }
  ns.print("Starting spread.js");
  await scan(ns, scriptName);
};

/** @param {NS} ns **/
const scan = async (ns, scriptName) => {
  ns.print("Scanning network");
  const servers = ns.scan();
  let previousPromise = Promise.resolve();
  servers.forEach((server) => {
    previousPromise = previousPromise.then(async () => {
      ns.print(`Checking ${server}`);
      if (ns.hasRootAccess(server)) {
        ns.print(`Has root, configuring scripts`);

        ns.killall(server);
        await ns.scp("restart.js", "home", server);
        await ns.scp("spread.js", "home", server);
        await ns.scp(`/hacks/${scriptName}`, "home", server);
        ns.mv(server, `/hacks/${scriptName}`, "hack.js");
      } else {
        ns.print(`No root.`);

        if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()) {
          ns.print("Can't hack, not skilled enough");
          return;
        }

        const ports = ns.getServerNumPortsRequired(server);
        if (ports > 2) {
          ns.print("Can't hack, too many ports required for nuke");
          return;
        }
        ns.print(`Opening ports...`);
        ns.brutessh(server);
        ns.ftpcrack(server);
        ns.print(`Hacking...`);
        ns.nuke(server);
        ns.alert(`Hacked ${server}!`);
      }
    });
  });
  await previousPromise;
  // wait 10 seconds and try again
  // await ns.asleep(10 * 1000);
  // return await scan(ns);
};
