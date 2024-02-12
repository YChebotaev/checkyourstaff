import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { createLogger } from "@checkyourstaff/common/createLogger";
import { accountCreate } from '@checkyourstaff/persistence'

const logger = createLogger("create-account");

const { name } = yargs(hideBin(process.argv))
  .option("name", {
    type: "string",
    requiresArg: true,
    description: "Account name",
  })
  .parseSync();

if (!name) {
  logger.fatal("--name <string> command line arg must be provided");

  process.exit(1);
}

accountCreate({ name })
  .then(() => process.exit(0))
  .catch(e => logger.error(e))
