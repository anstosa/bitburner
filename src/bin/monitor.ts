import { NS } from "Bitburner";

const update = (ns: NS): void => {
  document.getElementById("overview-extra-hook-2");
};

export const main = async (ns: NS): Promise<void> => {
  while (true) {
    ns.readPort(1);
    // wait 1 second
    await ns.sleep(1000);
  }
};
