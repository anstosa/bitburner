import { NS } from "Bitburner";

const params = {
  baseUrl: "http://localhost:9182/",
  manifest: {
    sourceFile: "resources/manifest.txt",
    destFile: "/resources/manifest.txt",
  },
  helpers: {
    sourceFile: "lib/helpers.js",
    destFile: "/lib/helpers.js",
  },
  pullFiles: {
    sourceFile: "bin/utils/pullFiles.js",
    destFile: "/bin/utils/pullFiles.js",
  },
};

async function pullFile(
  ns: NS,
  file: { sourceFile: string; destFile: string }
): Promise<void> {
  const manifestUrl = `${params.baseUrl}${file.sourceFile}`;
  ns.tprintf(`LOG   █ Downloading ${manifestUrl} -> ${file.destFile}`);

  if (!(await ns.wget(manifestUrl, file.destFile, "home"))) {
    ns.tprintf(`ERROR █ ${manifestUrl} -> ${file.destFile} failed.`);
    ns.exit();
  }
}

export async function main(ns: NS): Promise<void> {
  const files = [params.helpers, params.manifest, params.pullFiles];

  for (const file of files) {
    await pullFile(ns, file);
  }

  ns.tprintf(`INFO  █ Successfully pulled initial files!`);
  ns.tprintf(`LOG   █ Running download script...`);

  await ns.sleep(250);
  ns.run(params.pullFiles.destFile);
}
