import { ContactRecord } from "@checkyourstaff/common/parseContactsList";
import {
  accountCreate,
  accountAdministratorCreate,
  sampleGroupCreate,
  pollCreate,
  pollQuestionCreate,
  inviteCreate,
} from "@checkyourstaff/persistence";
import { spinInvitesQueue } from "./spinInvitesQueue";
import { spinPollsQueue } from "./spinPollsQueue";

export const completeRegistration = async ({
  accountName,
  groupName,
  contacts,
  userId,
}: {
  accountName: string;
  groupName: string;
  contacts: ContactRecord[];
  userId: number;
}) => {
  // Create account
  const accountId = await accountCreate({ name: accountName });

  // Create account administrator
  await accountAdministratorCreate({
    accountId,
    userId,
  });

  // Create sample group
  const sampleGroupId = await sampleGroupCreate({
    accountId,
    name: groupName,
  });

  // Create poll from template
  const pollId = await pollCreate({
    accountId,
    name: "Статус сотрудников",
  });

  await pollQuestionCreate({
    accountId,
    pollId,
    aggregationIndex: 0,
    text: "Оцените результаты на работе от 1 до 5",
  });

  await pollQuestionCreate({
    accountId,
    pollId,
    aggregationIndex: 1,
    text: "Оцените нагрузку на работе от 1 до 5",
  });

  await pollQuestionCreate({
    accountId,
    pollId,
    aggregationIndex: 2,
    text: "Оцените счастье на работе от 1 до 5",
  });

  // Invite recepients
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

  // Shedule poll session
  await spinPollsQueue.add(
    "spin-poll",
    {
      pollId,
      sampleGroupId,
    },
    {
      jobId: `spin-poll-${pollId}-${sampleGroupId}`,
      repeat: {
        pattern: "0 17 * * 1-5",
      },
    },
  );
};
