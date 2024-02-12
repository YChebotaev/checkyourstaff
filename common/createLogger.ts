// @ts-nocheck

import pino from "pino";
import PinoOpenObserve from '@openobserve/pino-openobserve'

const username = process.env["OO_USERNAME"];
const password = process.env["OO_PASSWORD"];

export const createLogger = (name: string) => {
  if (username && password) {
    const streamToOpenObserve = new PinoOpenObserve({
      url: 'http://localhost:5080',
      organization: 'default',
      auth: {
        username,
        password
      },
      streamName: name,
      batchSize: 1,
      timeThreshold: 1000
    })

    return pino(
      { name },
      streamToOpenObserve
    );
  } else {
    return pino({ name });
  }
};
