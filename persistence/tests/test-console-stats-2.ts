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
  const pollSessionId = await pollSessionCreate({
    pollId: 1,
    accountId: 1,
    sampleGroupId: 1,
  });
  await pollAnswerCreate({
    userId: 1,
    pollQuestionId: 1,
    pollSessionId,
    sampleGroupId: 1,
    score: 3,
  });
  await pollAnswerCreate({
    userId: 1,
    pollQuestionId: 2,
    pollSessionId,
    sampleGroupId: 1,
    score: 4,
  });
  await pollAnswerCreate({
    userId: 1,
    pollQuestionId: 3,
    pollSessionId,
    sampleGroupId: 1,
    score: 5,
  });
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => console.log(e));
