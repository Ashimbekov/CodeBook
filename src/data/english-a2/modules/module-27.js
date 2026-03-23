export default {
  id: 27,
  title: 'Speaking: Daily Standup Phrases',
  description: 'Фразы для ежедневного стендапа: вчера/сегодня/блокеры, уверенная речь на английском.',
  lessons: [
    {
      id: 1,
      title: 'Структура Daily Standup',
      type: 'theory',
      content: [
        { type: 'text', value: 'Daily Standup — короткая ежедневная встреча (обычно 15 минут).\n\nКаждый участник отвечает на 3 вопроса:\n1. What did I do yesterday? (Что я делал вчера?)\n2. What will I do today? (Что я буду делать сегодня?)\n3. Are there any blockers/impediments? (Есть ли блокеры?)' },
        { type: 'heading', value: 'Шаблоны для каждого вопроса' },
        { type: 'text', value: '1. ВЧЕРА:\nYesterday I worked on... (Вчера я работал над...)\nYesterday I finished... (Вчера я закончил...)\nYesterday I fixed... (Вчера я исправил...)\nYesterday I implemented... (Вчера я реализовал...)\nYesterday I reviewed... (Вчера я проверял...)\n\n2. СЕГОДНЯ:\nToday I will work on... (Сегодня я буду работать над...)\nToday I am going to... (Сегодня я собираюсь...)\nToday I plan to... (Сегодня я планирую...)\nToday I will continue working on... (Сегодня я продолжу работать над...)\nToday I will finish... (Сегодня я закончу...)\n\n3. БЛОКЕРЫ:\nI have a blocker: ... (У меня блокер: ...)\nI\'m blocked by... (Я заблокирован...)\nNo blockers. (Нет блокеров.)\nI\'m waiting for... (Я жду...)\nI might need help with... (Мне может понадобиться помощь с...)' }
      ]
    },
    {
      id: 2,
      title: 'Примеры полных стендапов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пример 1: Обычный день\n\n"Yesterday I worked on the user authentication feature. I implemented the login endpoint and wrote unit tests for it. Today I\'m going to finish the password reset functionality. No blockers."\n\n(Вчера я работал над функцией аутентификации пользователей. Я реализовал эндпоинт входа и написал для него юнит-тесты. Сегодня я собираюсь завершить функцию сброса пароля. Нет блокеров.)\n\nПример 2: С блокером\n\n"Yesterday I finished the API integration for the payment module. I tested it with Stripe sandbox. Today I plan to write integration tests. However, I have a blocker — I\'m waiting for the QA team to provide test cases. Without those, I can\'t complete the tests."\n\nПример 3: Продолжение задачи\n\n"Yesterday I continued working on the database migration script. It\'s about 70% done. Today I will finish it and run it in the staging environment. No blockers, but I might need a second pair of eyes when reviewing the migration."' }
      ]
    },
    {
      id: 3,
      title: 'Описание прогресса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Фразы для описания прогресса:\n\nПроцент выполнения:\nI\'m about 50% done with this task. (Я примерно на 50% завершил эту задачу.)\nIt\'s almost finished — just needs testing. (Почти готово — нужно только тестирование.)\nI just started on this. (Я только начал над этим.)\n\nЗавершение:\nI completed the task. (Я завершил задачу.)\nI finished the implementation. (Я закончил реализацию.)\nI wrapped it up yesterday. (Я завершил это вчера.)\nIt\'s done — I created a PR. (Готово — я создал PR.)\n\nТрудности:\nI\'m stuck on this part. (Я застрял на этой части.)\nIt\'s taking longer than expected. (Это занимает больше времени, чем ожидалось.)\nI ran into some issues. (Я столкнулся с некоторыми проблемами.)\nThe task is more complex than originally estimated. (Задача сложнее, чем первоначально оценивалось.)' }
      ]
    },
    {
      id: 4,
      title: 'Описание блокеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Детальное описание блокеров:\n\nОжидание других:\nI\'m waiting for design mockups. (Я жду макеты дизайна.)\nI\'m blocked by the backend team — the API isn\'t ready yet. (Я заблокирован командой backend — API ещё не готово.)\nI\'m waiting for code review approval. (Я жду одобрения код-ревью.)\nI\'m waiting for access to the staging environment. (Я жду доступа к staging-среде.)\n\nТехнические блокеры:\nI\'m blocked by a production bug that needs to be fixed first. (Меня блокирует баг в продакшне, который нужно исправить сначала.)\nI can\'t proceed without the API documentation. (Я не могу продолжить без документации API.)\nThe build is broken and I can\'t merge my changes. (Билд сломан, и я не могу смержить изменения.)\n\nНеопределённость:\nI\'m not sure how to implement this — I need to discuss it. (Я не уверен, как это реализовать — нужно обсудить.)\nThe requirements are unclear. I need clarification. (Требования неясны. Нужно уточнение.)' }
      ]
    },
    {
      id: 5,
      title: 'Полезные фразы для встреч',
      type: 'theory',
      content: [
        { type: 'text', value: 'Начало встречи:\nShall we start? (Начнём?)\nLet\'s get started. (Давайте начнём.)\nWho wants to go first? (Кто хочет начать?)\n\nПередача слова:\nThat\'s it from me. (Это всё от меня.)\nYour turn. (Твоя очередь.)\nAnyone else? (Ещё кто-нибудь?)\n\nВопросы и уточнения:\nSorry, could you repeat that? (Извини, не мог бы ты повторить?)\nCould you clarify what you mean by...? (Не мог бы ты уточнить, что ты имеешь в виду под...?)\nLet\'s take this offline. (Давайте обсудим это отдельно.)\nCan we discuss this after the standup? (Можем обсудить это после стендапа?)\n\nЗавершение встречи:\nOK, that\'s all for today. (Хорошо, это всё на сегодня.)\nSee you tomorrow! (До завтра!)\nHave a good day! (Хорошего дня!)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Написание стендапа',
      type: 'practice',
      content: [
        { type: 'text', value: 'Напишите стендап по данным ситуациям.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            {
              id: 1,
              question: 'Вчера: работал над login page, написал 5 тестов. Сегодня: закончить login и начать registration. Блокер: нет.',
              answer: 'Yesterday I worked on the login page and wrote 5 unit tests. Today I will finish the login functionality and start working on the registration page. No blockers.'
            },
            {
              id: 2,
              question: 'Вчера: исправил баг в payment module. Сегодня: написать тесты для bugfix. Блокер: жду доступа к staging.',
              answer: 'Yesterday I fixed a bug in the payment module. Today I plan to write tests for the bug fix. I have a blocker — I\'m waiting for access to the staging environment.'
            },
            {
              id: 3,
              question: 'Вчера: изучал документацию API, начал интеграцию. Сегодня: продолжить интеграцию. Блокер: документация неполная, нужно уточнение.',
              answer: 'Yesterday I studied the API documentation and started the integration. Today I will continue working on the integration. I have a blocker — the documentation is incomplete and I need clarification.'
            }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Перевод стендап-фраз',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите фразы на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Вчера я работал над новой функцией поиска.', answer: 'Yesterday I worked on the new search feature.' },
            { id: 2, question: 'Сегодня я собираюсь завершить рефакторинг и открыть PR.', answer: 'Today I\'m going to finish the refactoring and open a PR.' },
            { id: 3, question: 'У меня блокер — я жду ревью от техлида.', answer: 'I have a blocker — I\'m waiting for a review from the tech lead.' },
            { id: 4, question: 'Задача занимает больше времени, чем ожидалось.', answer: 'The task is taking longer than expected.' },
            { id: 5, question: 'Это всё от меня. Твоя очередь, Алекс.', answer: 'That\'s it from me. Your turn, Alex.' },
            { id: 6, question: 'Давайте обсудим это отдельно после стендапа.', answer: 'Let\'s take this offline after the standup.' }
          ]
        }
      ]
    }
  ]
}
