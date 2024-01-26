import path from "node:path";
import { type Knex } from "knex";

const user = process.env["PG_USER"];
const password = process.env["PG_PASSWORD"];

let config: Knex.Config;

if (user && password) {
  config = {
    client: "pg",
    connection: {
      host: "localhost",
      user,
      password,
      database: "pincodes",
    },
  } satisfies Knex.Config;
} else {
  config = {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "db.sqlite3"),
    },
  } satisfies Knex.Config;
}

export default config;
