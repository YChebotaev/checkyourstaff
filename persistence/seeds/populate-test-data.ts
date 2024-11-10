import { Knex } from "knex";
import { addHours, subWeeks } from 'date-fns'
import {
    accountAdministratorCreate,
    accountCreate,
    inviteCreate,
    pollAnswerCreate,
    pollCreate,
    pollQuestionCreate,
    pollSessionCreate,
    responderCreate,
    sampleGroupCreate,
    textFeedbackCreate,
    userCreate,
    userSessionCreate
} from '../index'

const createPollSessionWithAnswers = async ({
    userId: userId,
    pollId,
    accountId,
    sampleGroupId,
    questionsIds,
    createdAt
}: {
    userId: number,
    pollId: number,
    accountId: number,
    sampleGroupId: number,
    questionsIds: number[],
    createdAt: Date
}) => {
    const pollSessionId = await pollSessionCreate({
        pollId,
        accountId,
        sampleGroupId,
        __createdAt__: createdAt.getTime()
    })

    await pollAnswerCreate({
        userId: userId,
        pollQuestionId: questionsIds[0],
        pollSessionId,
        sampleGroupId,
        accountId,
        score: 3,
        __createdAt__: addHours(createdAt, 1).getTime()
    })

    await pollAnswerCreate({
        userId: userId,
        pollQuestionId: questionsIds[1],
        pollSessionId,
        sampleGroupId,
        accountId,
        score: 4,
        __createdAt__: addHours(createdAt, 1).getTime()
    })

    await pollAnswerCreate({
        userId: userId,
        pollQuestionId: questionsIds[2],
        pollSessionId,
        sampleGroupId,
        accountId,
        score: 5,
        __createdAt__: addHours(createdAt, 1).getTime()
    })

    await textFeedbackCreate({
        userId: userId,
        accountId,
        sampleGroupId,
        pollId,
        pollQuestionId: questionsIds[0],
        pollSessionId,
        text: 'Ну такое',
        __createdAt__: addHours(createdAt, 1).getTime()
    })

    await textFeedbackCreate({
        userId: userId,
        accountId,
        sampleGroupId,
        pollId,
        pollQuestionId: questionsIds[2],
        pollSessionId,
        text: 'Не плохо',
        __createdAt__: addHours(createdAt, 1).getTime()
    })

    await textFeedbackCreate({
        userId: userId,
        accountId,
        sampleGroupId,
        pollId,
        pollQuestionId: questionsIds[3],
        pollSessionId,
        text: 'Великолепно!',
        __createdAt__: addHours(createdAt, 1).getTime()
    })

    await textFeedbackCreate({
        accountId,
        sampleGroupId,
        userId: userId,
        pollId,
        pollSessionId,
        text: 'Могло быть и лучше',
        __createdAt__: addHours(createdAt, 1).getTime()
    });
}

const createSampleGroupWithData = async (
    sampleGroupName: string,
    {
        pollId,
        accountId,
        questionsIds
    }: {
        pollId: number,
        accountId: number,
        questionsIds: number[]
    }
) => {
    const sampleGroupId = await sampleGroupCreate({ accountId, name: sampleGroupName })

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

    const startDate = new Date()

    for (let i = 3; i >= 0; i--) {
        await createPollSessionWithAnswers({
            userId: memberUserId,
            pollId, accountId,
            sampleGroupId,
            questionsIds,
            createdAt: subWeeks(startDate, i)
        })
    }
};

const createPoll = async (pollName: string, { accountId, questions }: {
    accountId: number,
    questions: { text: string, name: string }[]
}) => {
    const pollId = await pollCreate({ accountId, name: pollName })

    const questionsIds = await Promise.all(
        questions.map(
            ({ text, name: measurenmentName }, aggregationIndex) =>
                pollQuestionCreate({
                    accountId,
                    pollId,
                    aggregationIndex,
                    text,
                    measurenmentName
                })
        )
    )

    return {
        pollId,
        questionsIds
    }
}

export async function seed(knex: Knex): Promise<void> {
    const administratorUserId = await userCreate({
        username: 'test-administrator',
        firstName: 'Тестовый',
        lastName: 'Администратор',
        languageCode: 'RU-ru',
    })

    await userSessionCreate({
        type: 'control',
        userId: administratorUserId,
        tgChatId: 350570845,
        tgUserId: 350570845,
    })

    const accountId = await accountCreate({ name: 'test' })

    await accountAdministratorCreate({ accountId, userId: administratorUserId })

    const { pollId, questionsIds } = await createPoll('Тестовый опрос', {
        accountId,
        questions: [
            {
                name: 'Результат работы',
                text: 'Оцените результаты на работе от 1 до 5'
            },
            {
                name: 'Нагрузка',
                text: 'Оцените нагрузку на работе от 1 до 5'
            },
            {
                name: 'Уровень счастья',
                text: 'Оцените счастье на работе от 1 до 5'
            }
        ]
    })

    await createSampleGroupWithData('Первая тестовая группа', { accountId, pollId, questionsIds })

    await createSampleGroupWithData('Вторая тестовая группа', { accountId, pollId, questionsIds })
};
