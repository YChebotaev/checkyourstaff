import { knex } from './knex'

export const createPollSession = async ({
  chatMetadataId
}: {
  chatMetadataId: number
}) => {
  const [{ id }] = await knex('pollSession')
    .insert({ chatMetadataId })
    .into('pollSession')
    .returning('id')

  return id
}
