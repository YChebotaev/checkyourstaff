import {
  accountAdministratorCreate,
  accountCreate,
  pollAnswerCreate,
  pollCreate,
  pollQuestionCreate,
  pollSessionCreate,
  sampleGroupCreate,
  userCreate,
} from "../index";

const main = async () => {
  const accountId = await accountCreate({ name: "Тестовый аккаунт 1" });
  const userId = await userCreate();
  await accountAdministratorCreate({
    accountId,
    userId,
  });
  const sampleGroupId = await sampleGroupCreate({
    accountId,
    name: "Тестовая группа 1",
  });
  const pollId = await pollCreate({
    accountId,
    name: "Тестовый опрос 1",
  });
  const pollQuestionId1 = await pollQuestionCreate({
    accountId,
    pollId,
    aggregationIndex: 0,
    text: "Оцените результаты на работе от 1 до 5",
  });
  const pollQuestionId2 = await pollQuestionCreate({
    accountId,
    pollId,
    aggregationIndex: 1,
    text: "Оцените нагрузку на работе от 1 до 5",
  });
  const pollQuestionId3 = await pollQuestionCreate({
    accountId,
    pollId,
    aggregationIndex: 2,
    text: "Оцените счастье на работе от 1 до 5",
  });
  const pollSessionId = await pollSessionCreate({
    pollId,
    accountId,
    sampleGroupId,
  });
  await pollAnswerCreate({
    userId,
    pollQuestionId: pollQuestionId1,
    pollSessionId,
    sampleGroupId,
    score: 3,
  });
  await pollAnswerCreate({
    userId,
    pollQuestionId: pollQuestionId2,
    pollSessionId,
    sampleGroupId,
    score: 4,
  });
  await pollAnswerCreate({
    userId,
    pollQuestionId: pollQuestionId3,
    pollSessionId,
    sampleGroupId,
    score: 5,
  });
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => console.log(e));
