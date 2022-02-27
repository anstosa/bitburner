import type { NS } from "Bitburner";
import { RepoInit } from "/lib/helpers.js";

export async function main(ns: NS): Promise<void> {
  const initRepo = new RepoInit(ns);

  await initRepo.pullScripts();
}
