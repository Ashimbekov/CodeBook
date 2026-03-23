export default {
  id: 5,
  title: 'Present Simple',
  description: 'Настоящее простое время — действия, факты, привычки',
  lessons: [
    {
      id: 1,
      title: 'Что такое Present Simple?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present Simple (Настоящее простое) — самое основное время в английском. Оно используется для описания регулярных действий, фактов и привычек. Это НЕ действие прямо сейчас (для этого есть Present Continuous).' },
        { type: 'code', language: 'text', value: 'Используется для:\n1. Регулярных действий (каждый день/всегда):\n   I write code every day.        - Я пишу код каждый день.\n   She deploys on Fridays.        - Она деплоит по пятницам.\n\n2. Фактов и истин:\n   Python uses indentation.       - Python использует отступы.\n   Git tracks changes.            - Git отслеживает изменения.\n\n3. Расписания и порядка:\n   The server starts at 9 AM.     - Сервер запускается в 9 утра.\n   The build runs every hour.     - Сборка запускается каждый час.' },
        { type: 'tip', value: 'Слова-маркеры Present Simple: always (всегда), usually (обычно), often (часто), sometimes (иногда), never (никогда), every day/week/month (каждый день/неделю/месяц).' },
        { type: 'note', value: 'В документации Present Simple используется постоянно для описания функций: "The function returns a string." (Функция возвращает строку.) "The API accepts GET requests." (API принимает GET запросы.) "This method throws an exception." (Этот метод выбрасывает исключение.)' },
      ]
    },
    {
      id: 2,
      title: 'Образование Present Simple',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Present Simple форма глагола почти не меняется. Единственное изменение: для he/she/it добавляем окончание -s или -es.' },
        { type: 'code', language: 'text', value: 'Утвердительная форма:\nI write       - я пишу\nYou write     - ты пишешь\nHe writes     - он пишет   (+s!)\nShe writes    - она пишет  (+s!)\nIt works      - оно работает (+s!)\nWe write      - мы пишем\nThey write    - они пишут' },
        { type: 'code', language: 'text', value: 'Правила добавления -s/-es:\nОбычно добавляем -s:\n  write → writes, run → runs, open → opens\n\nДобавляем -es (после s, sh, ch, x, z):\n  fix → fixes, push → pushes, fetch → fetches\n\nГлагол заканчивается на согласный + y → -ies:\n  study → studies, copy → copies\n\nНеправильные:\n  have → has, do → does, go → goes' },
        { type: 'warning', value: 'Частая ошибка: "He write code" — НЕПРАВИЛЬНО. "He writes code" — ПРАВИЛЬНО. Не забывайте -s для he/she/it!' }
      ]
    },
    {
      id: 3,
      title: 'Отрицание в Present Simple',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для отрицания в Present Simple используется вспомогательный глагол do/does + not. Сокращённые формы: don\'t и doesn\'t.' },
        { type: 'code', language: 'text', value: 'Отрицание:\nI do not (don\'t) write     - я не пишу\nYou don\'t write            - ты не пишешь\nHe does not (doesn\'t) write - он не пишет\nShe doesn\'t write          - она не пишет\nIt doesn\'t work            - оно не работает\nWe don\'t write             - мы не пишем\nThey don\'t write           - они не пишут' },
        { type: 'code', language: 'text', value: 'Примеры:\nI don\'t use Windows.           - Я не использую Windows.\nShe doesn\'t write tests.       - Она не пишет тесты.\nThis function doesn\'t return.  - Эта функция не возвращает.\nWe don\'t have a staging server.- У нас нет стейджинг-сервера.\nThey don\'t follow git flow.    - Они не следуют git flow.' },
        { type: 'note', value: 'После doesn\'t глагол стоит в базовой форме (без -s): "She doesn\'t writes" — НЕПРАВИЛЬНО. "She doesn\'t write" — ПРАВИЛЬНО. Вспомогательный глагол уже несёт знак 3-го лица.' }
      ]
    },
    {
      id: 4,
      title: 'Вопросы в Present Simple',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для вопросов в Present Simple используется вспомогательный глагол Do/Does в начале предложения.' },
        { type: 'code', language: 'text', value: 'Общие вопросы:\nDo you write Python?          - Ты пишешь на Python?\nDoes she know JavaScript?     - Она знает JavaScript?\nDo they use Docker?           - Они используют Docker?\nDoes it work on Windows?      - Оно работает на Windows?\nDo we have tests?             - У нас есть тесты?\n\nОтветы:\nYes, I do. / No, I don\'t.\nYes, she does. / No, she doesn\'t.' },
        { type: 'code', language: 'text', value: 'Специальные вопросы:\nWhat do you do?               - Чем ты занимаешься?\nWhere do you work?            - Где ты работаешь?\nWhat does this function do?   - Что делает эта функция?\nHow does it work?             - Как это работает?\nWhy do we use this approach?  - Почему мы используем этот подход?\nWhen does the build run?      - Когда запускается сборка?' },
        { type: 'tip', value: '"What do you do?" — стандартный вопрос о профессии на английском. Ответ: "I\'m a developer" или "I develop web applications".' }
      ]
    },
    {
      id: 5,
      title: 'Present Simple для фактов и правил',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present Simple идеально подходит для описания технических фактов, документации и правил работы программ.' },
        { type: 'code', language: 'text', value: 'Технические факты:\nPython is a high-level language.   - Python — высокоуровневый язык.\nJavaScript runs in the browser.    - JavaScript работает в браузере.\nGit stores the history of changes. - Git хранит историю изменений.\nDocker runs apps in containers.    - Docker запускает приложения в контейнерах.\nThis function returns a string.    - Эта функция возвращает строку.\nThe array starts at index 0.       - Массив начинается с индекса 0.' },
        { type: 'code', language: 'text', value: 'Документация и README:\nThis library provides...           - Эта библиотека предоставляет...\nThe API accepts JSON.              - API принимает JSON.\nThe function takes two parameters. - Функция принимает два параметра.\nThe method returns an object.      - Метод возвращает объект.\nThe server listens on port 8080.   - Сервер слушает порт 8080.' },
        { type: 'note', value: 'В документации глаголы используются в Present Simple, даже если описывают поведение будущей версии программы. Это стандарт технического письма.' }
      ]
    },
    {
      id: 6,
      title: 'Наречия частотности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Наречия частотности (frequency adverbs) указывают, как часто происходит действие. Они обычно стоят перед основным глаголом или после to be.' },
        { type: 'code', language: 'text', value: 'Наречия по частоте (от 100% до 0%):\nalways      - всегда (100%)\nusually     - обычно (80%)\noften       - часто (60%)\nsometimes   - иногда (40%)\nrarely      - редко (20%)\nseldom      - редко (20%)\nnever       - никогда (0%)' },
        { type: 'code', language: 'text', value: 'Позиция в предложении:\nПеред основным глаголом:\nI always write tests.            - Я всегда пишу тесты.\nWe often deploy on Fridays.      - Мы часто деплоим по пятницам.\nShe never ignores bugs.          - Она никогда не игнорирует баги.\n\nПосле to be:\nThe server is always running.    - Сервер всегда работает.\nBugs are sometimes hard to find. - Баги иногда сложно найти.' },
        { type: 'tip', value: 'Популярная IT-фраза: "We never deploy on Fridays" (Мы никогда не деплоим по пятницам) — шутка о том, что пятничный деплой часто вызывает проблемы.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Present Simple — утверждения',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте правильную форму глагола: "She ___ (write) Python code every day."',
          solution: 'writes',
          explanation: 'She → he/she/it, добавляем -s. "She writes Python code every day." — Она пишет код на Python каждый день.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте правильную форму: "This function ___ (return) a boolean value."',
          solution: 'returns',
          explanation: 'This function = it, добавляем -s. "This function returns a boolean value." — Эта функция возвращает булевое значение.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Я никогда не пропускаю code review."',
          solution: 'I never skip code review.',
          explanation: 'never ставится перед основным глаголом. skip = пропускать. "I never skip code review."'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Они часто работают удалённо."',
          solution: 'They often work remotely.',
          explanation: 'They → базовая форма (work, не works). often перед глаголом. remotely = удалённо.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Present Simple — вопросы и отрицания',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Образуйте отрицание: "She ___ (not use) Java."',
          solution: 'doesn\'t use',
          explanation: 'She → doesn\'t. После doesn\'t глагол без -s. "She doesn\'t use Java." — Она не использует Java.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Образуйте вопрос: "___ this API ___ (support) authentication?"',
          solution: 'Does, support',
          explanation: '"Does this API support authentication?" — Поддерживает ли этот API аутентификацию? Does для he/she/it.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Что делает эта функция?"',
          solution: 'What does this function do?',
          explanation: 'What + does + subject + verb. "do" в конце — это смысловой глагол "делать".'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильный вариант: "The build ___ take 10 minutes."',
          options: ['doesn\'t', 'don\'t', 'isn\'t', 'aren\'t'],
          correct: 0,
          explanation: '"The build" = it → doesn\'t. "The build doesn\'t take 10 minutes." — Сборка не занимает 10 минут.'
        }
      ]
    }
  ]
}
