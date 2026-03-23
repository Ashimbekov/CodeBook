export default {
  id: 24,
  title: 'Аудирование: базовые диалоги',
  description: 'Понимание устной речи: диалоги на работе, по телефону, на встречах',
  lessons: [
    {
      id: 1,
      title: 'Диалог: знакомство',
      type: 'theory',
      content: [
        { type: 'text', value: 'Знакомство с новым коллегой — первый диалог, который нужно освоить. Здесь стандартные фразы, которые используются везде.' },
        { type: 'code', language: 'text', value: 'Диалог при знакомстве:\nA: Hi, I\'m Alex. I\'m the new backend developer.\nB: Nice to meet you, Alex! I\'m Maria, frontend.\nA: Nice to meet you too. How long have you been here?\nB: About two years. It\'s a great team.\nA: What technologies do you use?\nB: Mostly React and TypeScript. And you?\nA: I work with Node.js and PostgreSQL.\nB: Great. Let me know if you have any questions.\nA: Thanks! I\'ll do that.\n\nПеревод:\nA: Привет, я Алекс. Я новый бэкенд-разработчик.\nB: Приятно познакомиться, Алекс! Я Мария, фронтенд.\nA: Тоже приятно. Как давно ты здесь?\nB: Около двух лет. Отличная команда.\nA: Какие технологии вы используете?\nB: В основном React и TypeScript. А ты?\nA: Я работаю с Node.js и PostgreSQL.\nB: Отлично. Давай знать, если будут вопросы.\nA: Спасибо! Так и сделаю.' },
        { type: 'tip', value: 'Ключевые фразы знакомства: "Nice to meet you!" (Приятно познакомиться!), "How long have you been here?" (Как давно ты здесь?), "Let me know if..." (Дай знать, если...).' },
        { type: 'note', value: 'При знакомстве с иностранным коллегой говорите медленно и чётко. Не бойтесь сказать: "Sorry, could you repeat that?" (Извините, можете повторить?) или "I didn\'t catch that." (Я не расслышал.) Это абсолютно нормально, особенно в начале.' }
      ]
    },
    {
      id: 2,
      title: 'Диалог: на стендапе',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стендап (daily standup) — ежедневная встреча команды. Каждый отвечает на три вопроса: что делал вчера, что делает сегодня, есть ли блокеры.' },
        { type: 'code', language: 'text', value: 'Диалог стендапа:\nSM: Good morning everyone. Let\'s start the standup.\n    Alex, can you go first?\nA:  Sure. Yesterday I fixed the login bug\n    and wrote unit tests. Today I\'m working\n    on the payment module. No blockers.\nSM: Great. Maria?\nM:  Yesterday I finished the dashboard design.\n    Today I\'m starting the mobile responsive.\n    One blocker: I need the API spec from Alex.\nA:  I\'ll send it after the standup.\nM:  Perfect, thanks.\nSM: Good. Any other updates? No? OK, have a great day.\n\nПеревод:\nSM: Доброе утро, все. Начнём стендап. Алекс, можешь первым?\nA: Конечно. Вчера исправил баг входа и написал юнит-тесты.\n   Сегодня работаю над модулем оплаты. Блокеров нет.\nSM: Отлично. Мария?\nM: Вчера закончила дизайн дашборда.\n   Сегодня начинаю мобильную адаптацию.\n   Один блокер: мне нужна спецификация API от Алекса.\nA: Пришлю после стендапа.\nM: Отлично, спасибо.\nSM: Хорошо. Другие обновления? Нет? Ладно, хорошего дня.' },
        { type: 'code', language: 'text', value: 'Три вопроса стендапа:\n1. Yesterday I [fixed/worked on/completed]...\n2. Today I am [working on/investigating/reviewing]...\n3. No blockers. / I am blocked by [причина].' },
      ]
    },
    {
      id: 3,
      title: 'Диалог: обсуждение задачи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обсуждение технической задачи с коллегой — ежедневная ситуация. Нужно уметь задавать уточняющие вопросы и предлагать решения.' },
        { type: 'code', language: 'text', value: 'Диалог: обсуждение задачи:\nA: Can you help me with this task?\nB: Sure, what\'s the problem?\nA: I need to implement user notifications.\n   I\'m not sure what approach to use.\nB: What are the requirements?\nA: Send email when a new comment is added.\nB: OK, we have a mailer service already.\n   You can use that.\nA: Where is the documentation for it?\nB: It\'s in the /docs folder. Check the README.\nA: Got it. How long do you think it will take?\nB: Maybe 2-3 hours. It\'s straightforward.\nA: Great, I\'ll start now.\n\nПеревод:\nA: Можешь помочь мне с этой задачей?\nB: Конечно, в чём проблема?\nA: Мне нужно реализовать уведомления пользователей.\n   Не уверен, какой подход использовать.\nB: Какие требования?\nA: Отправить email, когда добавлен новый комментарий.\nB: Ладно, у нас уже есть сервис рассылки. Можешь использовать его.\nA: Где документация по нему?\nB: В папке /docs. Проверь README.\nA: Понял. Как думаешь, сколько это займёт?\nB: Может, 2-3 часа. Это несложно.\nA: Отлично, начну прямо сейчас.' },
        { type: 'code', language: 'text', value: 'Полезные фразы для обсуждения:\n"Could you clarify the requirements?" - Уточни требования.\n"What is the acceptance criteria?" - Каковы критерии приёмки?\n"Is there an existing solution?" - Есть ли готовое решение?\n"What is the technical approach?" - Какой технический подход?' },
      ]
    },
    {
      id: 4,
      title: 'Диалог: code review',
      type: 'theory',
      content: [
        { type: 'text', value: 'Code review — важная практика в IT-командах. Нужно уметь оставлять и принимать комментарии вежливо и профессионально.' },
        { type: 'code', language: 'text', value: 'Диалог code review (в чате/встрече):\nA: I left some comments on your PR.\nB: Thanks, I\'ll check them now.\n   (later)\nB: I have a question about comment #3.\n   You suggest using a HashMap. Why?\nA: It\'s faster for lookups. O(1) vs O(n).\nB: Ah, I see. That makes sense. I\'ll change it.\nA: Also, could you add a test for the edge case?\nB: Which one?\nA: When the input is null or empty.\nB: Good point. I\'ll add that.\nA: Great. After that I can approve the PR.\n\nПеревод:\nA: Я оставил комментарии к твоему PR.\nB: Спасибо, сейчас проверю.\n   (позже)\nB: У меня вопрос по комментарию #3.\n   Ты предлагаешь использовать HashMap. Почему?\nA: Это быстрее для поиска. O(1) против O(n).\nB: Понял. Это имеет смысл. Исправлю.\nA: Также, можешь добавить тест для граничного случая?\nB: Какого?\nA: Когда ввод null или пустой.\nB: Хорошее замечание. Добавлю.\nA: Отлично. После этого смогу одобрить PR.' },
        { type: 'code', language: 'text', value: 'Фразы для code review:\n"This looks good." - Выглядит хорошо.\n"Could you add a comment here?" - Добавь комментарий.\n"I would suggest using X instead." - Предлагаю X вместо этого.\n"Nit: minor style issue." - Мелочь.\n"LGTM" - Looks Good To Me.' },
      ]
    },
    {
      id: 5,
      title: 'Диалог: сообщение о проблеме',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сообщение о проблеме (incident) — важный диалог. Нужно быстро и чётко объяснить ситуацию.' },
        { type: 'code', language: 'text', value: 'Диалог: инцидент\nA: Hey, we have an issue. The API is down.\nB: What? Since when?\nA: About 15 minutes ago. Users are getting 503 errors.\nB: Do you know the cause?\nA: Not yet. I\'m checking the logs now.\nB: OK, I\'ll notify the team. Any idea how long?\nA: Maybe 30 minutes to investigate.\nB: I\'ll send a status update to customers.\n   Let me know as soon as you find something.\nA: Will do.\n   (30 minutes later)\nA: Found it. A database connection issue.\n   I\'m fixing it now.\nB: Great, keep me posted.\n\nПеревод:\nA: Слушай, у нас проблема. API упало.\nB: Что? С каких пор?\nA: Около 15 минут назад. Пользователи получают ошибки 503.\nB: Знаешь причину?\nA: Пока нет. Сейчас проверяю логи.\nB: Ладно, сообщу команде. Есть идеи, сколько?\nA: Может, 30 минут на расследование.\nB: Пошлю статус-апдейт клиентам. Дай знать сразу, как найдёшь.\nA: Сделаю. (30 минут спустя)\nA: Нашёл. Проблема с подключением к БД. Исправляю.\nB: Отлично, держи меня в курсе.' },
        { type: 'code', language: 'text', value: 'Ключевые фразы инцидента:\nwe have an issue    - у нас проблема\nsince when?         - с каких пор?\ndo you know the cause? - знаешь причину?\nI\'m checking the logs - проверяю логи\nkeep me posted      - держи меня в курсе\nlet me know         - дай знать\nstatus update       - статус-апдейт\nwill do             - сделаю' },
        { type: 'tip', value: 'При сообщении о проблеме: Будьте конкретны — "The API returns 500 on POST to /users" лучше "Something is broken." Предоставьте контекст — "This started after the last deployment." Предложите решение если знаете.' },
      ]
    },
    {
      id: 6,
      title: 'Практика: Диалоги',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Завершите фразу стендапа: "Yesterday I ___ the login bug." (исправил)',
          solution: 'fixed',
          explanation: '"Yesterday I fixed the login bug." — Вчера я исправил баг входа. fixed = прошедшее от fix.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Приятно познакомиться! Я работаю с React."',
          solution: 'Nice to meet you! I work with React.',
          explanation: '"Nice to meet you!" — стандартное "Приятно познакомиться!". "I work with React" — Present Simple для описания технологий.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Как ответить на вопрос "Do you have any blockers?" если блокеров нет?',
          solution: 'No blockers. / No, I don\'t have any blockers.',
          explanation: 'На стендапе принято говорить кратко: "No blockers." Или развёрнуто: "No, I don\'t have any blockers."'
        }
      ]
    }
  ]
}
