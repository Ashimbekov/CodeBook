export default {
  id: 20,
  title: 'Office Vocabulary: meeting, deadline, sprint',
  description: 'Офисная и IT-рабочая лексика: митинги, дедлайны, спринты, задачи, планирование.',
  lessons: [
    {
      id: 1,
      title: 'Митинги и встречи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Типы встреч:\nmeeting (митинг) — общее слово для собрания\ndaily standup (ежедневный стендап) — короткий ежедневный митинг\nsprint planning (планирование спринта)\nsprint review (обзор спринта)\nretrospective / retro (ретроспектива)\none-on-one (1:1) — индивидуальная встреча\ntechnical interview (техническое интервью)\ncode review session (сессия код-ревью)\nkickoff meeting (стартовый митинг)\npostmortem (постмортем) — анализ инцидента\n\nФразы для митингов:\nI have a meeting at 3 PM. (У меня митинг в 15:00.)\nCan we schedule a call? (Можем запланировать звонок?)\nLet\'s sync up tomorrow. (Давайте синхронизируемся завтра.)\nI\'ll be in a meeting all morning. (Я весь утром буду на митинге.)\nThe meeting was cancelled. (Митинг отменили.)\nThe meeting was rescheduled to 4 PM. (Митинг перенесли на 16:00.)' }
      ]
    },
    {
      id: 2,
      title: 'Deadlines and Planning',
      type: 'theory',
      content: [
        { type: 'text', value: 'DEADLINE — срок (крайний срок)\nThe deadline is next Friday. (Дедлайн — следующая пятница.)\nWe need to meet the deadline. (Нам нужно уложиться в дедлайн.)\nWe missed the deadline. (Мы не успели к дедлайну.)\nCan we extend the deadline? (Можем ли мы перенести дедлайн?)\nThe deadline is approaching. (Дедлайн приближается.)\nThere\'s a hard deadline for this feature. (У этой функции жёсткий дедлайн.)\n\nESTIMATE (оценка, прогноз)\nWhat\'s your estimate for this task? (Какова твоя оценка этой задачи?)\nI estimate it will take 3 days. (Я оцениваю это в 3 дня.)\nThe estimate was off — it took twice as long. (Оценка оказалась неверной — это заняло вдвое больше времени.)\nGive a realistic estimate. (Давай реалистичную оценку.)\n\nMILESTONE — ключевая веха\nWe reached an important milestone. (Мы достигли важной вехи.)\nThe next milestone is the beta release. (Следующая веха — бета-релиз.)' }
      ]
    },
    {
      id: 3,
      title: 'Agile и Scrum терминология',
      type: 'theory',
      content: [
        { type: 'text', value: 'SPRINT — спринт (итерация разработки, обычно 1-2 недели)\nThe sprint lasts two weeks. (Спринт длится две недели.)\nWhat are you working on this sprint? (Над чем ты работаешь в этом спринте?)\nWe didn\'t finish all the sprint tasks. (Мы не закончили все задачи спринта.)\nThe sprint ends on Friday. (Спринт заканчивается в пятницу.)\n\nBACKLOG — бэклог (список задач)\nAdd this task to the backlog. (Добавь эту задачу в бэклог.)\nPrioritize the backlog before the sprint. (Приоритизируй бэклог перед спринтом.)\nThe backlog is getting too large. (Бэклог становится слишком большим.)\n\nSTORY POINTS — story points (единицы оценки сложности)\nThis task is 5 story points. (Эта задача — 5 story points.)\nVelocity — скорость (количество SP за спринт)\nThe team\'s velocity is 40 points per sprint. (Скорость команды — 40 очков за спринт.)' }
      ]
    },
    {
      id: 4,
      title: 'Tasks and Tickets',
      type: 'theory',
      content: [
        { type: 'text', value: 'Типы задач:\ntask (задача) — общая задача\nticket (тикет) — задача в системе отслеживания\nuser story (пользовательская история) — как пользователь хочет использовать систему\nbug report (баг-репорт) — отчёт об ошибке\nfeature request (запрос на функцию)\ntechnical debt (технический долг)\n\nСтатусы задач:\nTo Do — к выполнению\nIn Progress — в работе\nIn Review — на проверке\nDone — выполнено\nBlocked — заблокировано\n\nФразы для задач:\nI\'m working on ticket #123. (Я работаю над тикетом #123.)\nThis task is blocked by the API team. (Эта задача заблокирована командой API.)\nI\'ve completed the task. (Я выполнил задачу.)\nMove the ticket to "In Review". (Перемести тикет в "In Review".)' },
        { type: 'heading', value: 'Blocker: что такое блокер' },
        { type: 'text', value: 'BLOCKER — блокер (то, что мешает прогрессу)\nI have a blocker — I\'m waiting for the API spec. (У меня блокер — я жду спецификации API.)\nDo you have any blockers? (У тебя есть блокеры?)\nThe blocker was resolved. (Блокер был устранён.)\nWe need to remove this blocker ASAP. (Нам нужно убрать этот блокер как можно скорее.)' }
      ]
    },
    {
      id: 5,
      title: 'Communication: рабочие фразы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Согласие и несогласие:\nI agree with this approach. (Я согласен с этим подходом.)\nI disagree — this will cause issues. (Я не согласен — это вызовет проблемы.)\nI\'m not sure about this. (Я не уверен насчёт этого.)\nThat makes sense. (Это имеет смысл.)\nI see your point. (Я понимаю твою точку зрения.)\n\nПрогресс и статус:\nI\'m halfway through. (Я на полпути.)\nAlmost done. (Почти готово.)\nI\'m stuck on this issue. (Я застрял на этой проблеме.)\nI\'m waiting for feedback. (Я жду фидбека.)\nI will finish by end of day. (Я закончу к концу дня.)\n\nПомощь:\nCan you help me with this? (Можешь помочь мне с этим?)\nCould you review my code? (Не мог бы ты проверить мой код?)\nI\'m happy to help. (Я рад помочь.)\nLet me know if you need anything. (Дай знать, если тебе что-то нужно.)' }
      ]
    },
    {
      id: 6,
      title: 'Remote Work Vocabulary',
      type: 'theory',
      content: [
        { type: 'text', value: 'Словарь удалённой работы:\nwork remotely — работать удалённо\nwork from home (WFH) — работать из дома\nvideo call — видеозвонок\nyou\'re on mute — у тебя микрофон выключен\ncan you hear me? — ты меня слышишь?\nshare your screen — поделись экраном\nping someone — написать кому-то (в мессенджер)\nasync (asynchronous) communication — асинхронная коммуникация\ntime zone difference — разница в часовых поясах\noverlapping hours — пересекающиеся рабочие часы\n\nДиалог: стендап онлайн\nSara: Can everyone hear me? (Все меня слышат?)\nAlex: Yes, you\'re good. But Mike, you\'re on mute. (Да, всё хорошо. Но Майк, у тебя микрофон выключен.)\nMike: Sorry! Can you hear me now? (Извини! Теперь слышно?)\nAlex: Yes. OK, let\'s start. Sara, what\'s your update? (Да. Ок, начнём. Сара, какой у тебя статус?)\nSara: Yesterday I worked on the login page. Today I will finish it and submit a PR. (Вчера я работала над страницей входа. Сегодня я закончу её и отправлю PR.)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Офисный словарь',
      type: 'practice',
            description: 'Переведите на английский язык.',
      solution: 'Правильные ответы:\\n1. The deadline is next Friday. We need to meet it.\\n2. I\'m working on ticket #456.\\n3. I have a blocker — I\'m waiting for approval from the security team.\\n4. Can we schedule a call for tomorrow?\\n5. The sprint ends on Friday.\\n6. Prioritize the backlog before sprint planning.\\n7. I\'m stuck on this task. Can you help?',
content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Дедлайн — следующая пятница. Мы должны успеть.', answer: 'The deadline is next Friday. We need to meet it.' },
            { id: 2, question: 'Я работаю над тикетом #456.', answer: 'I\'m working on ticket #456.' },
            { id: 3, question: 'У меня блокер — я жду одобрения от команды безопасности.', answer: 'I have a blocker — I\'m waiting for approval from the security team.' },
            { id: 4, question: 'Можем ли мы запланировать звонок на завтра?', answer: 'Can we schedule a call for tomorrow?' },
            { id: 5, question: 'Спринт заканчивается в пятницу.', answer: 'The sprint ends on Friday.' },
            { id: 6, question: 'Приоритизируй бэклог перед планированием спринта.', answer: 'Prioritize the backlog before sprint planning.' },
            { id: 7, question: 'Я застрял на этой задаче. Можешь помочь?', answer: 'I\'m stuck on this task. Can you help?' }
          ]
        }
      ]
    }
  ]
}
