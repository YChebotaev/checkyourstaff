import {
  accountCreate,
  pollCreate,
  pollQuestionCreate,
  pollSessionCreate,
  sampleGroupCreate,
  textFeedbackCreate,
  userCreate,
} from "@checkyourstaff/persistence";

const main = async () => {
  const accountId = await accountCreate({ name: "Тестовый аккаунт" });
  const userId = await userCreate({});
  const sampleGroupId = await sampleGroupCreate({
    name: "Тестовая группа",
    accountId,
  });
  const pollId = await pollCreate({ name: "Тестовый опрос", accountId });
  const pollQuestionId = await pollQuestionCreate({
    accountId,
    pollId,
    aggregationIndex: 0,
    text: "Тестовый вопрос - 1",
  });
  const pollSessionId = await pollSessionCreate({
    pollId,
    accountId,
    sampleGroupId,
  });
  const textFeedback1 = await textFeedbackCreate({
    userId,
    accountId,
    sampleGroupId,
    pollId,
    pollQuestionId,
    pollSessionId,
    text: "Заебали, суки, спамить!",
  });
  const textFeedback2 = await textFeedbackCreate({
    userId,
    accountId,
    sampleGroupId,
    text: "Заебали, суки, спамить! - 2",
  });
};

main()
  .then(() => process.exit(0))
  .catch((e) => console.error(e));
