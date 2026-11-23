// main.ts — News Image 23 Nov 2026 entry.
// The poster is drawn in advance and held in this repository as entry.png.
// This program copies it to /output/entry.png, byte for byte.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const target = join("/output", "entry.png");

mkdirSync("/output", { recursive: true });

if (!existsSync(source)) {
  throw new Error("entry.png is missing from the repository");
}

copyFileSync(source, target);

// The output must be a whole PNG: check its 8-byte signature before reporting.
const head = readFileSync(target).subarray(0, 8);
const pngMagic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
for (let i = 0; i < pngMagic.length; i++) {
  if (head[i] !== pngMagic[i]) {
    throw new Error("output is not a PNG file");
  }
}

const bytes = statSync(target).size;
if (bytes > 1048576) {
  throw new Error("entry.png is " + bytes + " bytes, over the 1 MiB limit");
}

console.log("wrote " + target + " (" + bytes + " bytes)");
