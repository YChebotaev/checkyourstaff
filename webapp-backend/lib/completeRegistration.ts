import { type ContactsRecord } from "@checkyourstaff/common/parseContactsList";
import {
  accountCreate,
  accountAdministratorCreate,
  sampleGroupCreate,
  pollCreate,
  pollQuestionCreate,
} from "@checkyourstaff/persistence";
import { spinPollsQueue } from "@checkyourstaff/common/spinPollsQueue";
import { inviteRecepients } from './inviteRecepients'

export const completeRegistration = async ({
  accountName,
  groupName,
  contacts,
  userId,
}: {
  accountName: string;
  groupName: string;
  contacts: ContactsRecord[];
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

  await inviteRecepients({
    contacts,
    sampleGroupId
  })

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
        pattern: "0 12 * * 1-7",
      },
    },
  );

  return {
    sampleGroupId
  }
};
