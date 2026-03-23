export default {
  id: 9,
  title: 'Can / Can\'t',
  description: 'Модальный глагол can для выражения возможности и умения',
  lessons: [
    {
      id: 1,
      title: 'Что такое can?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Can — модальный глагол. Он выражает возможность (могу) или умение (умею). Can не изменяется по лицам и числам — это удобно! После can всегда стоит инфинитив без "to".' },
        { type: 'code', language: 'text', value: 'Форма: subject + can + verb (base form)\n\nI can write Python.          - Я умею писать на Python.\nYou can run the server.      - Ты можешь запустить сервер.\nHe can fix the bug.          - Он может исправить баг.\nShe can read the code.       - Она может читать код.\nIt can store data.           - Оно может хранить данные.\nWe can deploy today.         - Мы можем задеплоить сегодня.\nThey can help you.           - Они могут тебе помочь.' },
        { type: 'note', value: 'Can не добавляет -s для he/she/it: "He can" (не "He cans"). После can — инфинитив без "to": "can write" (не "can to write").' },
        { type: 'tip', value: 'Can часто используется в IT для описания возможностей: "This API can handle 1000 requests per second." (Этот API может обрабатывать 1000 запросов в секунду.) "The function can return null." (Функция может вернуть null.)' }
      ]
    },
    {
      id: 2,
      title: 'Can\'t — отрицание',
      type: 'theory',
      content: [
        { type: 'text', value: 'Отрицательная форма: cannot (полная) или can\'t (сокращённая). В разговорной речи почти всегда используют can\'t.' },
        { type: 'code', language: 'text', value: 'Отрицание: can + not = cannot = can\'t\n\nI can\'t connect to the server.   - Не могу подключиться к серверу.\nShe can\'t access the database.   - Она не может получить доступ к БД.\nThe app can\'t find the file.     - Приложение не может найти файл.\nWe can\'t deploy on Fridays.      - Мы не деплоим по пятницам.\nThis function can\'t be called.   - Эту функцию нельзя вызывать.\nIt can\'t handle null values.     - Оно не может обработать null.' },
        { type: 'tip', value: 'Важно различать произношение: CAN [кэн] — с коротким гласным, CAN\'T [кант] — с длинным гласным. В разговоре это помогает понять утверждение или отрицание.' },
        { type: 'note', value: 'В сообщениях об ошибках часто встречается "cannot": "TypeError: Cannot read property...", "Cannot connect to database". Это более формальный вариант can\'t. В речи используйте can\'t, в технических текстах вы увидите cannot.' },
      ]
    },
    {
      id: 3,
      title: 'Вопросы с can',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вопрос образуется инверсией: can выносится на первое место.' },
        { type: 'code', language: 'text', value: 'Общие вопросы:\nCan you help me?                - Ты можешь мне помочь?\nCan she review my code?         - Она может проверить мой код?\nCan this run on Linux?          - Это может работать на Linux?\nCan we access the API?          - Мы можем получить доступ к API?\nCan you explain this error?     - Можешь объяснить эту ошибку?\n\nОтветы:\nYes, I can. / No, I can\'t.\nYes, she can. / No, she can\'t.' },
        { type: 'code', language: 'text', value: 'Специальные вопросы:\nWhat can this tool do?          - Что может делать этот инструмент?\nWhere can I find the docs?      - Где я могу найти документацию?\nHow can I fix this bug?         - Как мне исправить этот баг?\nWho can help with this?         - Кто может помочь с этим?' },
        { type: 'note', value: 'В Slack/Teams очень часто: "Can you take a look?" (Можешь посмотреть?) "Can you share your screen?" (Можешь показать экран?) "Can we reschedule?" (Можем перенести?) Эти короткие фразы с "can" — основа ежедневного IT-общения.' },
      ]
    },
    {
      id: 4,
      title: 'Can для просьб и предложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Can часто используется для вежливых просьб и предложений помощи. Это очень важно в рабочем общении.' },
        { type: 'code', language: 'text', value: 'Просьбы (Can you...?):\nCan you review my pull request?  - Можешь проверить мой PR?\nCan you send me the link?        - Можешь прислать ссылку?\nCan you check the logs?          - Можешь проверить логи?\nCan you explain this code?       - Можешь объяснить этот код?\nCan you help me with this task?  - Можешь помочь с этой задачей?\n\nПредложения (Can I...?):\nCan I help you?                  - Могу помочь?\nCan I ask a question?            - Могу задать вопрос?\nCan I join the call?             - Могу присоединиться к звонку?\nCan I see your screen?           - Могу видеть твой экран?' },
        { type: 'tip', value: '"Could you..." — более вежливая версия "Can you...". "Could you review my code?" звучит вежливее, чем "Can you review my code?". В официальной переписке лучше использовать could.' },
        { type: 'note', value: 'Иерархия вежливости: "Can you...?" (нейтрально, для коллег) — "Could you...?" (вежливо, для менеджеров) — "Would you mind...?" (очень вежливо, для клиентов). На стендапах и в чатах обычно достаточно "Can you?".' },
      ]
    },
    {
      id: 5,
      title: 'Can для описания возможностей программ',
      type: 'theory',
      content: [
        { type: 'text', value: 'В документации and README файлах can используется для описания того, что программа или инструмент умеет делать.' },
        { type: 'code', language: 'text', value: 'Из документации и README:\nThis tool can analyze your code. - Этот инструмент может анализировать код.\nThe API can handle 1000 requests.- API может обрабатывать 1000 запросов.\nYou can customize the settings.  - Вы можете настроить параметры.\nThe app can work offline.        - Приложение может работать офлайн.\nThis library can parse JSON.     - Эта библиотека может парсить JSON.\nDocker can run on any OS.        - Docker может работать на любой ОС.' },
        { type: 'code', language: 'text', value: 'Описание ограничений:\nThis free plan can\'t exceed 100 calls.\n  - Этот бесплатный план не может превышать 100 вызовов.\nThe function can\'t return null.\n  - Функция не может вернуть null.\nFree users can\'t access this feature.\n  - Бесплатные пользователи не могут использовать эту функцию.' },
        { type: 'note', value: 'В README и документации часто встречается структура "can + verb": "This tool can generate...", "The API can handle...", "Users can create...". Читая документацию, ищите глаголы после "can" — они описывают возможности продукта.' },
      ]
    },
    {
      id: 6,
      title: 'Практика: Can / Can\'t',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Ты умеешь писать на TypeScript?"',
          solution: 'Can you write TypeScript?',
          explanation: 'Can + you + глагол в базовой форме. Write — базовая форма, не "to write".'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Это приложение не может работать без интернета."',
          solution: 'This app can\'t work without internet.',
          explanation: 'can\'t + verb base form. "without internet" = без интернета.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Задайте вопрос: "___ you help me with this bug?" (Можешь помочь с этим багом?)',
          solution: 'Can',
          explanation: '"Can you help me with this bug?" — Можешь помочь мне с этим багом?'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Где я могу найти документацию?"',
          solution: 'Where can I find the documentation?',
          explanation: 'Where + can + I + find. "documentation" с артиклем "the" — конкретная документация данного проекта.'
        }
      ]
    }
  ]
}
