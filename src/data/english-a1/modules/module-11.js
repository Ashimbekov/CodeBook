export default {
  id: 11,
  title: 'Past Simple (was/were, правильные глаголы)',
  description: 'Прошедшее простое время с was/were и правильными глаголами на -ed',
  lessons: [
    {
      id: 1,
      title: 'Was и Were — прошедшее to be',
      type: 'theory',
      content: [
        { type: 'text', value: 'Past Simple (прошедшее простое) используется для действий, которые произошли и завершились в прошлом. Глагол "to be" в прошедшем времени: was (I/he/she/it) и were (you/we/they).' },
        { type: 'code', language: 'text', value: 'Was / Were:\nI was a junior developer.       - Я был джуниор-разработчиком.\nYou were on the team.           - Ты был в команде.\nHe was the team lead.           - Он был тимлидом.\nShe was a tester.               - Она была тестировщиком.\nIt was a critical bug.          - Это был критический баг.\nWe were in a meeting.           - Мы были на встрече.\nThey were ready to deploy.      - Они были готовы к деплою.' },
        { type: 'code', language: 'text', value: 'Отрицание и вопросы:\nI wasn\'t available.              - Я не был доступен.\nWe weren\'t ready.                - Мы не были готовы.\nWas there a backup?              - Было ли резервное копирование?\nWere they on time?               - Они были вовремя?\nYes, there was. / No, there wasn\'t.\nYes, they were. / No, they weren\'t.' },
        { type: 'tip', value: 'Was/were часто используется на ретроспективах: "The sprint was successful." (Спринт был успешным.) "We were blocked by the API issue." (Мы были заблокированы проблемой API.) "It was a good release." (Это был хороший релиз.)' }
      ]
    },
    {
      id: 2,
      title: 'Правильные глаголы: формирование Past Simple',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильные (regular) глаголы образуют прошедшее время добавлением -ed. Это одна форма для всех лиц — это удобно!' },
        { type: 'code', language: 'text', value: 'Правила добавления -ed:\n1. Большинство глаголов → + ed:\n   work → worked\n   test → tested\n   push → pushed\n   deploy → deployed\n   start → started\n   finish → finished\n\n2. Глаголы на -e → + d только:\n   save → saved\n   use → used\n   create → created\n   close → closed\n\n3. Согласный + y → ied:\n   copy → copied\n   study → studied\n   try → tried\n\n4. Короткие (согл-гласн-согл) → двойная согл + ed:\n   stop → stopped\n   plan → planned\n   drop → dropped' },
        { type: 'code', language: 'text', value: 'IT-глаголы в прошедшем (правильные):\nopened → opened (открыл PR)\nclosed → closed (закрыл задачу)\nreviewed → reviewed (проверил код)\nassigned → assigned (назначил)\ndeployed → deployed (задеплоил)\ntested → tested (протестировал)\nfixed → fixed (исправил)' },
      ]
    },
    {
      id: 3,
      title: 'Правильные глаголы в IT-контексте',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим самые важные IT-глаголы в прошедшем времени. Эти слова вы будете часто слышать на ретроспективах и в описаниях задач.' },
        { type: 'code', language: 'text', value: 'IT-глаголы в Past Simple:\nfix → fixed         - исправил\ntest → tested       - протестировал\npush → pushed       - запушил\npull → pulled       - запуллил\ndeploy → deployed   - задеплоил\nstart → started     - запустил\nstop → stopped      - остановил\ncreate → created    - создал\ndelete → deleted    - удалил\nupdate → updated    - обновил\ninstall → installed - установил\nclose → closed      - закрыл\nreview → reviewed   - проверил\nsave → saved        - сохранил\nformat → formatted  - отформатировал' },
        { type: 'code', language: 'text', value: 'Примеры предложений:\nI fixed the bug yesterday.       - Я исправил баг вчера.\nShe tested the new feature.      - Она протестировала новую фичу.\nWe deployed the app last night.  - Мы задеплоили приложение прошлой ночью.\nHe created a new branch.         - Он создал новую ветку.\nThey updated the dependencies.   - Они обновили зависимости.' },
        { type: 'code', language: 'text', value: 'IT-глаголы в прошедшем (правильные):\nopened → opened (открыл PR)\nclosed → closed (закрыл задачу)\nreviewed → reviewed (проверил код)\nassigned → assigned (назначил)\ndeployed → deployed (задеплоил)\ntested → tested (протестировал)\nfixed → fixed (исправил)' },
      ]
    },
    {
      id: 4,
      title: 'Отрицание в Past Simple',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для отрицания в Past Simple используется вспомогательный глагол did + not. Сокращённая форма: didn\'t. После didn\'t глагол стоит в базовой форме!' },
        { type: 'code', language: 'text', value: 'Отрицание: didn\'t + verb (base form)\n\nI didn\'t write tests.            - Я не написал тесты.\nShe didn\'t push the changes.     - Она не запушила изменения.\nWe didn\'t deploy on Friday.      - Мы не деплоили в пятницу.\nHe didn\'t fix the bug.           - Он не исправил баг.\nThey didn\'t update the docs.     - Они не обновили документацию.\nThe server didn\'t start.         - Сервер не запустился.' },
        { type: 'warning', value: 'Частая ошибка: "She didn\'t pushed" — НЕПРАВИЛЬНО. "She didn\'t push" — ПРАВИЛЬНО. После didn\'t всегда базовая форма глагола (без -ed).' },
        { type: 'note', value: 'После didn\'t глагол всегда в базовой форме: "I didn\'t fix the bug." (не "didn\'t fixed"). "We didn\'t deploy yesterday." (не "didn\'t deployed"). Самая частая ошибка — добавить -ed после didn\'t. Запомните: didn\'t + base form.' },
      ]
    },
    {
      id: 5,
      title: 'Вопросы в Past Simple',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вопросы строятся с вспомогательным глаголом Did в начале предложения. После did — глагол в базовой форме.' },
        { type: 'code', language: 'text', value: 'Общие вопросы:\nDid you fix the bug?             - Ты исправил баг?\nDid she review the code?         - Она проверила код?\nDid they deploy yesterday?       - Они деплоили вчера?\nDid the tests pass?              - Тесты прошли?\n\nОтветы:\nYes, I did. / No, I didn\'t.\nYes, she did. / No, she didn\'t.\nYes, they did. / No, they didn\'t.' },
        { type: 'code', language: 'text', value: 'Специальные вопросы:\nWhat did you fix?                - Что ты исправил?\nWhy did the server crash?        - Почему сервер упал?\nWhen did they deploy?            - Когда они деплоили?\nHow did you solve the problem?   - Как ты решил проблему?\nWho fixed the bug?               - Кто исправил баг?\n(Примечание: в вопросах с "who" как подлежащим did не нужен)' },
        { type: 'tip', value: 'На code review часто используются вопросы в Past Simple: "Why did you use this approach?" "What did you change here?" "Did you test this case?" — важные вопросы при проверке кода.' },
      ]
    },
    {
      id: 6,
      title: 'Маркеры прошедшего времени',
      type: 'theory',
      content: [
        { type: 'text', value: 'Маркеры времени помогают понять, что речь идёт о прошлом. Они часто стоят в начале или конце предложения.' },
        { type: 'code', language: 'text', value: 'Маркеры прошедшего времени:\nyesterday            - вчера\nlast night           - прошлой ночью\nlast week/month/year - на прошлой неделе/месяце/году\n2 days ago           - 2 дня назад\nan hour ago          - час назад\nin 2022              - в 2022 году\nbefore               - до, раньше\njust now             - только что' },
        { type: 'code', language: 'text', value: 'IT-примеры с маркерами:\nI pushed the changes yesterday.   - Я запушил изменения вчера.\nThe server crashed last night.    - Сервер упал прошлой ночью.\nWe released v1.0 two weeks ago.   - Мы выпустили v1.0 две недели назад.\nShe fixed the bug 5 minutes ago.  - Она исправила баг 5 минут назад.\nThe build failed this morning.    - Сборка упала сегодня утром.' },
        { type: 'note', value: 'В IT-отчётах типичные временные маркеры: "yesterday" — в стендапах, "last sprint" — на ретро, "last week" — в еженедельных отчётах, "an hour ago" — в чатах об инцидентах.' },
      ]
    },
    {
      id: 7,
      title: 'Практика: Past Simple (was/were)',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте was или were: "The tests ___ failing yesterday."',
          solution: 'were',
          explanation: '"The tests" = они → were. "The tests were failing yesterday." — Тесты падали вчера.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Сервер был недоступен прошлой ночью."',
          solution: 'The server was unavailable last night.',
          explanation: 'The server = оно → was. unavailable = недоступный. last night = прошлой ночью.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Образуйте вопрос: "___ there a backup before the migration?',
          solution: 'Was',
          explanation: '"Was there a backup before the migration?" — Было ли резервное копирование до миграции? there is → was (единственное число).'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Past Simple (правильные глаголы)',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Поставьте глагол в Past Simple: "She ___ (fix) the bug two hours ago."',
          solution: 'fixed',
          explanation: '"She fixed the bug two hours ago." — Она исправила баг два часа назад. fix → fixed.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Образуйте отрицание: "We ___ (not deploy) last Friday."',
          solution: 'didn\'t deploy',
          explanation: '"We didn\'t deploy last Friday." — Мы не деплоили в прошлую пятницу. didn\'t + базовая форма.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Когда они обновили зависимости?"',
          solution: 'When did they update the dependencies?',
          explanation: 'When + did + they + базовая форма. update (без -ed) после did.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Я создал новую ветку и запушил изменения."',
          solution: 'I created a new branch and pushed the changes.',
          explanation: 'created (create → created), pushed (push → pushed). Два действия в прошлом соединены "and".'
        }
      ]
    }
  ]
}
