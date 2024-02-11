import { ContactRecord } from "@checkyourstaff/common/parseContactsList";
import { spinInvitesQueue } from "@checkyourstaff/common/spinInvitesQueue";
import { inviteCreate } from '@checkyourstaff/persistence'

export const inviteRecepients = async ({
  contacts,
  sampleGroupId
}: {
  contacts: ContactRecord[],
  sampleGroupId: number
}) => {
  await spinInvitesQueue.addBulk(
    (
      await Promise.all(
        contacts.map(({ type, value }) =>
          inviteCreate({
            sampleGroupId,
            email: type === "email" ? value : null,
            phone: type === "phone" ? value : null,
          }),
        ),
      )
    ).map((inviteId) => ({
      name: "send-invite",
      data: { inviteId },
    })),
  );
}
