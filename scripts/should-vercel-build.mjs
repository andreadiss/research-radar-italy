const message = process.env.VERCEL_GIT_COMMIT_MESSAGE || "";

const dataOnlyCommits = [
  "Update MUR positions cache",
  "Update Grants funding cache"
];

if (dataOnlyCommits.includes(message.trim())) {
  console.log(`Skipping Vercel build for data-only commit: ${message}`);
  process.exit(0);
}

console.log("Running Vercel build for application change.");
process.exit(1);
