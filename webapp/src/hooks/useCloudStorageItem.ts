import { useState, useEffect } from "react";

export const useCloudStorageItem = <T = string>(
  key: string,
  {
    parse,
    stringify,
  }: {
    parse?: (v: string) => T;
    stringify?: (v: T) => string;
  },
): [
  string | T | undefined,
  (v?: T | null) => Promise<boolean>,
  Error | null,
] => {
  const [rawValue, setRawValue] = useState<undefined | string>();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setError(null);

    Telegram.WebApp.CloudStorage.getItem(key, (error, rawValue) => {
      if (error) {
        setError(error);
      } else {
        setRawValue(rawValue);
      }
    });
  }, [key]);

  const setValue = (value?: T | null) => {
    setError(null);

    const createCallback =
      <
        Res extends (v: boolean) => void,
        Rej extends (reason: Err) => void,
        Err extends Error | null,
      >(
        resolve: Res,
        reject: Rej,
      ) =>
      (error: Err, success: boolean) => {
        if (error) {
          setError(error);

          reject(error);
        } else {
          resolve(success);
        }
      };

    return new Promise<boolean>((resolve, reject) => {
      if (value == null) {
        Telegram.WebApp.CloudStorage.removeItem(
          key,
          createCallback(resolve, reject),
        );
      } else {
        const stringifiedValue = stringify ? stringify(value) : String(value);

        Telegram.WebApp.CloudStorage.setItem(
          key,
          stringifiedValue,
          createCallback(resolve, reject),
        );
      }
    });
  };

  const parsedValue = parse
    ? rawValue
      ? parse(rawValue)
      : rawValue
    : rawValue;

  return [parsedValue, setValue, error];
};
