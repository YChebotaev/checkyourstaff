import { knex } from "../knex";
import type { PinCode } from "./types";

export const pinCodeCreate = async ({
  tenantId,
  generatorId,
  code,
  payload,
}: {
  tenantId: number;
  generatorId: number;
  code: string;
  payload: any;
}) => {
  const [{ id }] = await knex
    .insert({
      tenantId,
      generatorId,
      code,
      payload: JSON.stringify(payload),
      createdAt: new Date().getTime(),
    })
    .into("pinCodes")
    .returning<{ id: number }[]>("id");

  return id;
};

export const pinCodeGetByCode = async (tenantId: number, code: string) => {
  const pinCode = await knex
    .select("*")
    .from("pinCodes")
    .where("code", code)
    .andWhere("tenantId", tenantId)
    .first();

  if (!pinCode || pinCode.deleted) {
    return;
  }

  return {
    ...pinCode,
    payload:
      typeof pinCode.payload === "string"
        ? JSON.parse(pinCode.payload)
        : pinCode.payload,
  } as PinCode;
};
