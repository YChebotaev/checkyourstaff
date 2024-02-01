// @ts-nocheck

import pino from "pino";
import pinoElasticsearch from "pino-elasticsearch";
import { multistream } from "pino-multi-stream";
import { HttpConnection } from "@elastic/elasticsearch";

const username = process.env["OO_USERNAME"];
const password = process.env["OO_PASSWORD"];

export const createLogger = (name: string) => {
  if (username && password) {
    class Connection extends HttpConnection {
      request(...args: any[]) {
        args[0].path = `/api/default${args[0].path}`;

        return super.request.apply(this, args);
      }
    }

    const streamToOpenObserve = pinoElasticsearch({
      index: name,
      node: "https://localhost:5080",
      esVersion: 7,
      flushBytes: 100,
      auth: {
        username,
        password,
      },
      Connection,
    });

    return pino(
      { name },
      multistream([
        { stream: streamToOpenObserve },
        { stream: process.stdout, level: "info" },
        { stream: process.stderr, level: "error" },
      ]),
    );
  } else {
    return pino({ name });
  }
};
