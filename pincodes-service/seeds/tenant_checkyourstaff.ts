import { Knex } from "knex";
import { tenantCreate, generatorCreate } from '../lib'

export const seed = async (knex: Knex): Promise<void> => {
    await knex("tenants").del();

    const tenantId = await tenantCreate({ name: 'checkyourstaff' })

    await generatorCreate({ tenantId })
};
