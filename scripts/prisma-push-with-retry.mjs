import { spawnSync } from "node:child_process";

const retryDelaysMs = [0, 5_000, 10_000, 20_000, 30_000];

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

for (let attempt = 0; attempt < retryDelaysMs.length; attempt += 1) {
  const delay = retryDelaysMs[attempt];
  if (delay > 0) {
    console.warn(`Database was unavailable. Retrying schema sync in ${delay / 1_000}s...`);
    await wait(delay);
  }

  const result = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["prisma", "db", "push", "--skip-generate"],
    { env: process.env, stdio: "inherit" }
  );

  if (result.status === 0) {
    process.exit(0);
  }
}

console.error("Database schema sync failed after five bounded attempts.");
process.exit(1);
