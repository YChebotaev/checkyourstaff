import pino from "pino";
// import pinoElasticsearch from "pino-elasticsearch";
// import { multistream } from "pino-multi-stream";

// const username = process.env["OPENOBSERVE_USERNAME"];
// const password = process.env["OPENOBSERVE_PASSWORD"];

// if (!username || !password) {
//   console.error(
//     "Both OPENOBSERVE_USERNAME and OPENOBSERVE_PASSWORD environment variables must be set",
//   );

//   process.exit(1);
// }

export const createLogger = (name: string) => {
  // const streamToOpenObserve = pinoElasticsearch({
  //   index,
  //   node: "http://localhost:5080/api/default/",
  //   esVersion: 7,
  //   flushBytes: 1000,
  //   auth: {
  //     username,
  //     password,
  //   },
  // });

  // return pino(
  //   { level: "info" },
  //   multistream([
  //     { stream: streamToOpenObserve },
  //     { stream: process.stdout, level: "info" },
  //     { stream: process.stderr, level: "error" },
  //   ]),
  // );

  return pino({ name });
};
