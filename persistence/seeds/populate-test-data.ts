import { Knex } from "knex";

import { accountAdministratorCreate, accountCreate, inviteCreate, pollAnswerCreate, pollCreate, pollQuestionCreate, pollSessionCreate, responderCreate, sampleGroupCreate, textFeedbackCreate, userCreate, userSessionCreate } from '../index'

export async function seed(knex: Knex): Promise<void> {
    // CREATING POLL

    const administratorUserId = await userCreate({
        username: 'test-administrator',
        firstName: 'Тестовый',
        lastName: 'Администратор',
        languageCode: 'RU-ru',
    })

    const accountId = await accountCreate({ name: 'test' })

    await accountAdministratorCreate({ accountId, userId: administratorUserId })

    const sampleGroupId = await sampleGroupCreate({ accountId, name: 'Тестовая группа' })

    const pollId = await pollCreate({ accountId, name: 'Тестовый опрос' })

    const q1Id = await pollQuestionCreate({
        accountId,
        pollId,
        aggregationIndex: 0,
        text: "Оцените результаты на работе от 1 до 5",
    });

    const q2Id = await pollQuestionCreate({
        accountId,
        pollId,
        aggregationIndex: 1,
        text: "Оцените нагрузку на работе от 1 до 5",
    });

    const q3Id = await pollQuestionCreate({
        accountId,
        pollId,
        aggregationIndex: 2,
        text: "Оцените счастье на работе от 1 до 5",
    });

    await userSessionCreate({
        type: 'control',
        userId: administratorUserId,
        tgChatId: 350570845,
        tgUserId: 350570845,
    })

    // CREATE SAMPLE DATA

    const memberUserId = await userCreate({
        username: 'test-member',
        firstName: 'Тестовый',
        lastName: 'Мембер',
        languageCode: 'RU-ru'
    })

    const inviteId = await inviteCreate({
        sampleGroupId,
        contacts: [
            {
                type: 'phone',
                value: '79120345101'
            },
            {
                type: 'email',
                value: 'yury.79120345101@gmail.com'
            }
        ]
    })

    await responderCreate({ sampleGroupId, userId: memberUserId, inviteId })

    const pollSessionId = await pollSessionCreate({ pollId, accountId, sampleGroupId })

    await pollAnswerCreate({
        userId: memberUserId,
        pollQuestionId: q1Id,
        pollSessionId,
        sampleGroupId,
        score: 3
    })

    await pollAnswerCreate({
        userId: memberUserId,
        pollQuestionId: q2Id,
        pollSessionId,
        sampleGroupId,
        score: 4
    })

    await pollAnswerCreate({
        userId: memberUserId,
        pollQuestionId: q3Id,
        pollSessionId,
        sampleGroupId,
        score: 5
    })

    await textFeedbackCreate({
        userId: memberUserId,
        accountId,
        sampleGroupId,
        pollId,
        pollQuestionId: q1Id,
        pollSessionId,
        text: 'Ну такое'
    })

    await textFeedbackCreate({
        userId: memberUserId,
        accountId,
        sampleGroupId,
        pollId,
        pollQuestionId: q2Id,
        pollSessionId,
        text: 'Не плохо'
    })

    await textFeedbackCreate({
        userId: memberUserId,
        accountId,
        sampleGroupId,
        pollId,
        pollQuestionId: q3Id,
        pollSessionId,
        text: 'Великолепно!'
    })

    await textFeedbackCreate({
        accountId,
        sampleGroupId,
        userId: memberUserId,
        pollId,
        pollSessionId,
        text: 'Могло быть и лучше',
    });
};
