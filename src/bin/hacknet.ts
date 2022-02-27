import { NS } from "Bitburner";

const BUDGET_ABSOLUTE = Infinity;
const BUDGET_RELATIVE = 0.01;

const evaluate = (ns: NS): void => {
  const { coreCost, levelCost, production, purchaseCost, ramCost } =
    ns.getHacknetMultipliers();
  const numNodes = ns.hacknet.numNodes();
  const wallet = ns.getServerMoneyAvailable("home");
  const budget = Math.min(wallet * BUDGET_RELATIVE, BUDGET_ABSOLUTE);

  for (let node = 0; node <= numNodes; node++) {}
};

export const main = async (ns: NS): Promise<void> => {};
