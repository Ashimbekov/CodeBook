export default {
  id: 10,
  title: 'Present Continuous',
  description: 'Настоящее длительное время — действия прямо сейчас',
  lessons: [
    {
      id: 1,
      title: 'Что такое Present Continuous?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present Continuous (Настоящее длительное) описывает действие, которое происходит прямо сейчас, в момент разговора. Это контраст с Present Simple, которое говорит о привычках.' },
        { type: 'code', language: 'text', value: 'Форма: to be (am/is/are) + verb + -ing\n\nI am writing code.          - Я пишу код. (прямо сейчас)\nHe is fixing the bug.       - Он исправляет баг. (сейчас)\nShe is reviewing the PR.    - Она проверяет PR. (сейчас)\nIt is running.              - Оно запускается. (сейчас)\nWe are deploying.           - Мы делаем деплой. (сейчас)\nYou are watching this.      - Ты смотришь это. (сейчас)\nThey are testing.           - Они тестируют. (сейчас)' },
        { type: 'tip', value: 'Слова-маркеры Present Continuous: now (сейчас), right now (прямо сейчас), at the moment (в данный момент), currently (в настоящее время), today (сегодня), at this time (в это время).' },
        { type: 'note', value: 'В IT-контексте Present Continuous часто используется в статусных сообщениях: "The build is running." (Сборка выполняется.) "The server is restarting." (Сервер перезапускается.) "The tests are passing." (Тесты проходят.)' }
      ]
    },
    {
      id: 2,
      title: 'Образование формы -ing',
      type: 'theory',
      content: [
        { type: 'text', value: 'Добавление -ing к глаголу имеет несколько правил. Важно знать их, чтобы правильно писать.' },
        { type: 'code', language: 'text', value: 'Основные правила:\n1. Большинство глаголов → + ing:\n   write → writing, run → running? нет!\n   read → reading, work → working\n   test → testing, push → pushing\n\n2. Глаголы на немую -e → убираем e + ing:\n   write → writing (не "writeing")\n   make → making\n   save → saving\n   compile → compiling\n   execute → executing\n\n3. Короткие глаголы согл+гласн+согл → двойная согласная:\n   run → running\n   sit → sitting\n   get → getting\n   set → setting\n   debug → debugging (исключение — не дублируем g)' },
        { type: 'warning', value: 'Частые ошибки: "writting" — НЕПРАВИЛЬНО, "writing" — ПРАВИЛЬНО. "runing" — НЕПРАВИЛЬНО, "running" — ПРАВИЛЬНО.' },
        { type: 'tip', value: 'Частые ошибки при написании -ing форм: "running" (не "runing"), "debugging" (не "debuging"), "setting" (не "seting"), "getting" (не "geting"). Правило двойной согласной применяется, когда последний слог ударный и заканчивается на CVC (согласная-гласная-согласная).' },
      ]
    },
    {
      id: 3,
      title: 'Отрицание и вопросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Отрицание и вопросы в Present Continuous строятся через глагол to be (am/is/are), который уже входит в форму.' },
        { type: 'code', language: 'text', value: 'Отрицание:\nI\'m not working now.            - Я сейчас не работаю.\nHe isn\'t fixing the bug.        - Он не исправляет баг.\nThe server isn\'t running.       - Сервер не запущен.\nWe aren\'t deploying today.      - Мы не деплоим сегодня.\nThey aren\'t using our API.      - Они не используют наш API.\n\nВопросы:\nAre you working from home?      - Ты работаешь из дома?\nIs the server running?          - Сервер работает?\nIs she reviewing the code?      - Она проверяет код?\nAre they testing the feature?   - Они тестируют фичу?' },
        { type: 'tip', value: 'В IT-переписке: "Is there a workaround?" (Есть ли обходное решение?) "There is not enough documentation." (Недостаточно документации.) "Are there any known issues?" (Есть ли известные проблемы?) — частый вопрос перед деплоем.' },
      ]
    },
    {
      id: 4,
      title: 'Present Continuous vs Present Simple',
      type: 'theory',
      content: [
        { type: 'text', value: 'Одна из самых важных тем — понять разницу между этими двумя временами. Present Simple = привычка/факт. Present Continuous = прямо сейчас.' },
        { type: 'code', language: 'text', value: 'Сравнение:\nPresent Simple (всегда/обычно):\nI write Python.                 - Я пишу на Python (обычно).\nHe fixes bugs every day.        - Он исправляет баги каждый день.\nShe works at Google.            - Она работает в Google.\n\nPresent Continuous (прямо сейчас):\nI am writing Python code now.   - Я пишу код на Python сейчас.\nHe is fixing a bug.             - Он исправляет баг (прямо сейчас).\nShe is working from home today. - Она сегодня работает из дома.' },
        { type: 'code', language: 'text', value: 'IT-диалог:\n- What do you do? (Present Simple) - Кем ты работаешь?\n- I\'m a developer.\n\n- What are you doing? (Continuous) - Что ты делаешь?\n- I\'m debugging the API.           - Я дебажу API.\n\n- Do you use React? (Simple)        - Ты используешь React?\n- Yes, I do.\n\n- Are you using React now? (Cont.)  - Ты используешь React сейчас?\n- Yes, I am.' },
        { type: 'tip', value: 'Стейтус-апдейт в Slack: Present Continuous для того, что делаете СЕЙЧАС: "I am investigating the issue." (Расследую проблему.) Present Simple для постоянного: "I work on the backend team." (Работаю в бэкенд-команде.) Оба нужны для самопрезентации.' },
      ]
    },
    {
      id: 5,
      title: 'Глаголы не используемые в Continuous',
      type: 'theory',
      content: [
        { type: 'text', value: 'Некоторые глаголы (stative verbs — глаголы состояния) обычно не используются в форме Continuous. Они описывают состояния, а не действия.' },
        { type: 'code', language: 'text', value: 'Stative verbs (не используем -ing):\nknow      - знать      (not: "I am knowing")\nunderstand- понимать   (not: "I am understanding")\nbelieve   - считать/верить\nlike      - нравиться\nlove      - любить\nhate      - ненавидеть\nwant      - хотеть\nneed      - нуждаться\nhave      - иметь (в значении "обладать")\nsee       - видеть\nhear      - слышать\ncontain   - содержать\ninclude   - включать' },
        { type: 'code', language: 'text', value: 'НЕПРАВИЛЬНО vs ПРАВИЛЬНО:\n"I am knowing Python" → I know Python.\n"She is understanding the code" → She understands the code.\n"This function is containing a bug" → contains a bug.\n"The array is including 5 elements" → includes 5 elements.\n\nНо! "have" может быть в Continuous если = действие:\nI\'m having a meeting. (OK — встреча = действие)\nI have a laptop. (OK — владение = состояние)' },
        { type: 'tip', value: 'Глаголы состояния в IT-контексте: "The app contains sensitive data." (не "is containing") "I know the solution." (не "am knowing") "We need more tests." (не "are needing"). Запомните: состояние — не процесс.' },
      ]
    },
    {
      id: 6,
      title: 'Present Continuous для планов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present Continuous также используется для запланированных будущих событий — действий, которые уже организованы.' },
        { type: 'code', language: 'text', value: 'Будущие планы:\nWe are deploying tomorrow.       - Мы деплоим завтра (запланировано).\nShe is presenting on Monday.     - Она делает презентацию в понедельник.\nI am meeting the client at 2 PM. - Я встречаюсь с клиентом в 14:00.\nThey are releasing v2 next week. - Они выпускают v2 на следующей неделе.\nWe are migrating the database.   - Мы мигрируем БД (запланировано).' },
        { type: 'tip', value: 'На стендапах часто используют Present Continuous: "I\'m working on the auth module" (Работаю над модулем авторизации), "We\'re refactoring the API" (Рефакторим API).' },
        { type: 'tip', value: 'Стейтус-апдейт в Slack: Present Continuous для того, что делаете СЕЙЧАС: "I am investigating the issue." (Расследую проблему.) Present Simple для постоянного: "I work on the backend team." (Работаю в бэкенд-команде.) Оба нужны для самопрезентации.' },
      ]
    },
    {
      id: 7,
      title: 'Практика: Present Continuous',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте глагол в правильной форме: "The server ___ (run) right now."',
          solution: 'is running',
          explanation: '"The server is running right now." — Сервер работает прямо сейчас. The server = it → is. run → running (run, короткое слово — удваиваем n).'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Образуйте отрицание: "She ___ (not work) on that task."',
          solution: 'isn\'t working',
          explanation: '"She isn\'t working on that task." — Она не работает над этой задачей. She → is → isn\'t. work → working.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Что ты сейчас делаешь?"',
          solution: 'What are you doing now? / What are you doing right now?',
          explanation: 'What + are + you + doing? Это вопрос Present Continuous. doing = делать в форме -ing.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильный вариант: "I ___ the documentation."',
          options: ['\'m writing', 'am write', 'is writing', 'writing'],
          correct: 0,
          explanation: '"I\'m writing the documentation." = I am writing. I → am + verb-ing.'
        }
      ]
    }
  ]
}
