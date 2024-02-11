import path from "node:path";
import fs from "node:fs";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { createLogger } from "@checkyourstaff/common/createLogger";
import { parse } from "dotenv";
import { spinPoll } from "@checkyourstaff/workers/lib/spinPoll";

const logger = createLogger("force-start-poll-session");

Object.assign(process.env, parse(
  fs.readFileSync(path.resolve(__dirname, "../workers/.env"), "utf-8"),
))

const { pollId, sampleGroupId } = yargs(hideBin(process.argv))
  .option("poll-id", {
    type: "number",
    requiresArg: true,
    description: "Poll id",
  })
  .option("sample-group-id", {
    type: "number",
    requiresArg: true,
    describe: "Sample group id",
  })
  .parseSync();

if (!pollId) {
  logger.fatal("--poll-id <number> command line arg must be provided");

  process.exit(1);
}

if (!sampleGroupId) {
  logger.fatal("--sample-group-id <number> command line arg must be provided");

  process.exit(1);
}

spinPoll(pollId, sampleGroupId)
  .then(() => {
    process.exit(0);
  })
  .catch((e) => logger.error(e));
