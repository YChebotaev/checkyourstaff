import { type ContactsRecord } from "@checkyourstaff/common/parseContactsList";
import { sendInviteBulk } from "@checkyourstaff/common/spinInvitesQueue";
import { inviteCreate } from '@checkyourstaff/persistence'

export const inviteRecepients = async ({
  contacts: contactGroups,
  sampleGroupId
}: {
  contacts: ContactsRecord[],
  sampleGroupId: number
}) => {
  console.log('contactGroups =', contactGroups)

  await sendInviteBulk(
    (await Promise.all(
      contactGroups.map(
        contacts => inviteCreate({
          sampleGroupId,
          contacts
        })
      )
    )).map((inviteId) => ({
      inviteId
    }))
  )
}
