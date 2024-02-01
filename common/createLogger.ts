// @ts-nocheck

import pino from "pino";
import pinoElasticsearch from "pino-elasticsearch";
import { multistream } from "pino-multi-stream";
import { HttpConnection } from "@elastic/elasticsearch";

const username = process.env["OO_USERNAME"];
const password = process.env["OO_PASSWORD"];

class Connection extends HttpConnection {
  request(...args: any[]) {
    args[0].path = `/api/default${args[0].path}`;

    return super.request.apply(this, args);
  }
}

export const createLogger = (name: string) => {
  const streamToOpenObserve = pinoElasticsearch({
    index: name,
    node: "http://localhost:5080",
    esVersion: 7,
    flushBytes: 100,
    auth: {
      username,
      password,
    },
    Connection,
  });

  return pino(
    { level: "info" },
    multistream([
      { stream: streamToOpenObserve },
      { stream: process.stdout, level: "info" },
      { stream: process.stderr, level: "error" },
    ]),
  );
};
