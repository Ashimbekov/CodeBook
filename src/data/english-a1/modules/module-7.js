export default {
  id: 7,
  title: 'There is / There are',
  description: 'Конструкции there is и there are для описания наличия чего-либо',
  lessons: [
    {
      id: 1,
      title: 'Что такое there is / there are?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конструкция "there is / there are" используется для описания наличия или существования чего-либо. На русский переводится как "есть", "имеется", "находится".' },
        { type: 'code', language: 'text', value: 'There is  + единственное число\nThere are + множественное число\n\nПримеры:\nThere is a bug in the code.      - В коде есть баг.\nThere is a new update.           - Есть новое обновление.\nThere are three servers.         - Есть три сервера.\nThere are many libraries.        - Есть много библиотек.' },
        { type: 'tip', value: 'There в этой конструкции не переводится как "там" — это просто формальное подлежащее. "There is a problem" = "Есть проблема" (не "Там есть проблема").' }
      ]
    },
    {
      id: 2,
      title: 'Отрицание и вопросы с there is/are',
      type: 'theory',
      content: [
        { type: 'text', value: 'Отрицание образуется добавлением "not" после is/are. Вопрос — инверсией is/are и there.' },
        { type: 'code', language: 'text', value: 'Отрицание:\nThere is not (isn\'t) a bug.      - Нет бага.\nThere are not (aren\'t) errors.   - Нет ошибок.\nThere isn\'t any documentation.   - Нет никакой документации.\nThere aren\'t any tests.          - Нет никаких тестов.\n\nВопрос:\nIs there a bug?                  - Есть баг?\nAre there any errors?            - Есть ошибки?\nIs there a README?               - Есть README?\nAre there any branches?          - Есть ветки?' },
        { type: 'code', language: 'text', value: 'Краткие ответы:\nYes, there is. / No, there isn\'t.\nYes, there are. / No, there aren\'t.\n\nДиалог:\n- Is there a staging environment? - Есть стейджинг?\n- Yes, there is.                  - Да.\n- Are there any failing tests?    - Есть падающие тесты?\n- No, there aren\'t.               - Нет.' }
      ]
    },
    {
      id: 3,
      title: 'There is/are с some и any',
      type: 'theory',
      content: [
        { type: 'text', value: 'Some (несколько, немного) используется в утвердительных предложениях. Any (никаких, какие-нибудь) — в вопросах и отрицаниях.' },
        { type: 'code', language: 'text', value: 'Some в утверждениях:\nThere are some bugs to fix.      - Есть несколько багов для исправления.\nThere is some documentation.     - Есть немного документации.\nThere are some open issues.      - Есть несколько открытых задач.\n\nAny в вопросах:\nAre there any warnings?          - Есть какие-нибудь предупреждения?\nIs there any free memory?        - Есть свободная память?\n\nAny в отрицаниях:\nThere aren\'t any tests.          - Нет никаких тестов.\nThere isn\'t any time left.       - Нет времени.' },
        { type: 'note', value: 'Some в вопросах используется, когда мы предлагаем что-то или ожидаем ответ "да": "Are there some files to review?" (Есть файлы для проверки?) — ожидаем, что есть.' }
      ]
    },
    {
      id: 4,
      title: 'There was / There were — прошедшее время',
      type: 'theory',
      content: [
        { type: 'text', value: 'В прошедшем времени конструкция меняется: there is → there was, there are → there were.' },
        { type: 'code', language: 'text', value: 'Прошедшее время:\nThere was a bug yesterday.       - Вчера был баг.\nThere was a server outage.       - Был сбой сервера.\nThere were many errors.          - Было много ошибок.\nThere were three developers.     - Было три разработчика.\n\nОтрицание в прошлом:\nThere wasn\'t a backup.           - Не было резервной копии.\nThere weren\'t any tests.         - Не было тестов.\n\nВопрос в прошлом:\nWas there a deployment last night? - Был деплой прошлой ночью?\nWere there any problems?           - Были какие-нибудь проблемы?' },
        { type: 'tip', value: 'Часто используемая фраза: "There was a bug in production" (В продакшене был баг) — именно так сообщают об инцидентах.' }
      ]
    },
    {
      id: 5,
      title: 'Практичные IT-фразы с there is/are',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим реальные ситуации, где программисты используют эти конструкции в работе.' },
        { type: 'code', language: 'text', value: 'В баг-трекере:\nThere are 5 open issues.         - Есть 5 открытых задач.\nThere is a critical bug.         - Есть критический баг.\nThere aren\'t any blockers.       - Нет блокеров.\nThere is no priority set.        - Приоритет не установлен.\n\nНа code review:\nThere are some comments.         - Есть несколько комментариев.\nThere is a problem with this code.- В этом коде есть проблема.\nThere aren\'t any issues.         - Нет проблем.\n\nВ документации:\nThere are two ways to do this.   - Есть два способа сделать это.\nThere is a simpler approach.     - Есть более простой подход.\nThere is an example below.       - Ниже есть пример.' },
        { type: 'code', language: 'text', value: 'На стендапе (standup meeting):\n- There are no blockers.         - Нет блокеров.\n- There is a problem with...     - Есть проблема с...\n- There was an issue yesterday.  - Вчера была проблема.\n- There were some merge conflicts.- Были конфликты при мёрдже.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: There is / There are',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте is или are: "There ___ three bugs in this file."',
          solution: 'are',
          explanation: '"three bugs" — множественное число, поэтому "are". "There are three bugs in this file."'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Переведите используя there is/are: "В системе нет ошибок."',
          solution: 'There are no errors in the system. / There aren\'t any errors in the system.',
          explanation: 'Errors — множественное, поэтому "are". "No" или "not any" — оба варианта правильны.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Are there any warnings in the logs?"',
          solution: 'Есть ли какие-нибудь предупреждения в логах?',
          explanation: 'Are there any... — вопрос с "any" для вопросительных предложений. warnings = предупреждения, logs = логи.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Вчера был инцидент на сервере."',
          solution: 'There was an incident on the server yesterday.',
          explanation: 'Прошедшее время → was. "an incident" — один инцидент, артикль "an" (начинается на гласный [ɪ]).'
        }
      ]
    }
  ]
}
