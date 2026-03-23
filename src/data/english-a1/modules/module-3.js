export default {
  id: 3,
  title: 'Артикли a/an/the',
  description: 'Неопределённый артикль a/an и определённый артикль the',
  lessons: [
    {
      id: 1,
      title: 'Что такое артикли?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Артикль — это слово, которое ставится перед существительным. В английском два вида: неопределённый (a/an) и определённый (the). В русском языке артиклей нет, поэтому это сложная тема для русскоязычных.' },
        { type: 'code', language: 'text', value: 'a/an - неопределённый артикль\n  Означает: "один из многих", "какой-то"\n  a file    - какой-то файл (один из многих)\n  a bug     - какой-то баг\n  a server  - какой-то сервер\n\nthe - определённый артикль\n  Означает: "тот самый", "конкретный"\n  the file  - тот самый файл (мы знаем о каком)\n  the bug   - тот самый баг (который мы обсуждаем)\n  the server- тот самый сервер' },
        { type: 'tip', value: 'Представьте: вы работаете с коллегой. "I found A bug" (Я нашёл какой-то баг — первый раз упоминаете). "THE bug is in the login function" (Тот баг, о котором говорили — уже известен обоим).' }
      ]
    },
    {
      id: 2,
      title: 'Артикль a vs an',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор между "a" и "an" зависит от звука, с которого начинается следующее слово. Если слово начинается с гласного звука — используем "an", если с согласного — "a".' },
        { type: 'code', language: 'text', value: 'Используем "a" (перед согласным звуком):\na bug         - баг\na function    - функция\na server      - сервер\na database    - база данных\na file        - файл\na programmer  - программист\na variable    - переменная' },
        { type: 'code', language: 'text', value: 'Используем "an" (перед гласным звуком a,e,i,o,u):\nan error      - ошибка\nan app        - приложение\nan update     - обновление\nan IDE        - IDE (И-Ди-И, начинается со звука [а])\nan API        - API (эй-пи-ай, начинается со звука [э])\nan hour       - час (h не произносится, начинается со звука [а])' },
        { type: 'warning', value: 'Важно: артикль зависит от ЗВУКА, а не от буквы! "An hour" — буква H, но звук [aʊə]. "A university" — буква U, но звук [juː] (согласный). "A user" — буква U, но звук [j].' }
      ]
    },
    {
      id: 3,
      title: 'Когда использовать a/an',
      type: 'theory',
      content: [
        { type: 'text', value: 'Неопределённый артикль a/an используется в нескольких случаях. Запомните основные правила.' },
        { type: 'code', language: 'text', value: '1. Первое упоминание предмета:\n   I found a bug. (первый раз говорим)\n   A new developer joined our team.\n\n2. Профессии (после to be):\n   I am a developer.\n   She is a tester.\n   He is an architect.\n\n3. Один из многих:\n   Can you open a terminal?\n   We need a new feature.\n   Send me a link.' },
        { type: 'code', language: 'text', value: 'Когда a/an НЕ используется:\n- перед множественным числом: bugs (не "a bugs")\n- перед неисчисляемыми существительными:\n  water, information, code, data\n  "Give me information" (не "a information")\n  "Write clean code" (не "a code")' },
        { type: 'note', value: 'Слово "code" обычно неисчисляемое: "write code", "review code". Но "a piece of code" (кусок кода) — можно. "Codes" используется редко, обычно имеет другое значение.' }
      ]
    },
    {
      id: 4,
      title: 'Когда использовать the',
      type: 'theory',
      content: [
        { type: 'text', value: 'Определённый артикль "the" используется когда и говорящий, и слушающий знают, о чём идёт речь.' },
        { type: 'code', language: 'text', value: '1. Повторное упоминание:\n   I found a bug. The bug is in the login module.\n   She wrote a function. The function is clean.\n\n2. Единственный в своём роде:\n   the internet   - интернет (один такой)\n   the cloud      - облако\n   the database   - база данных (конкретная)\n   the main branch- мейн-ветка\n\n3. Когда понятно из контекста:\n   Open the terminal. (понятно — тот терминал)\n   Check the logs.    (понятно — логи сервера)\n   Fix the bug.       (понятно — тот баг, что нашли)' },
        { type: 'tip', value: 'В IT часто говорят "the server", "the database", "the API" — потому что обычно есть конкретный сервер/БД/API о котором идёт речь в контексте.' }
      ]
    },
    {
      id: 5,
      title: 'Когда артикль не нужен (нулевой артикль)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда артикль вообще не нужен. Это называется "нулевой артикль". Важно знать эти случаи, чтобы не ставить артикль там, где он не нужен.' },
        { type: 'code', language: 'text', value: 'Артикль не нужен:\n1. Перед именами и названиями компаний:\n   Google, Amazon, Python, JavaScript, Linux\n\n2. Перед множественным числом (общий смысл):\n   Developers write code.  (разработчики вообще)\n   Bugs are everywhere.    (баги вообще)\n\n3. Перед языками:\n   I write Python.   I know JavaScript.\n\n4. Перед неисчисляемыми (общий смысл):\n   Code is important.   Data is valuable.\n   Information is power.' },
        { type: 'code', language: 'text', value: 'Сравнение:\nI write code. (вообще)     VS   I write the code. (конкретный)\nBugs are common. (вообще)  VS   The bugs are fixed. (конкретные)\nData is lost. (вообще)     VS   The data is lost. (конкретные данные)' },
        { type: 'warning', value: 'Не ставьте "the" перед названиями языков программирования: "I know the Python" — НЕПРАВИЛЬНО. "I know Python" — ПРАВИЛЬНО.' }
      ]
    },
    {
      id: 6,
      title: 'Артикли в IT-контексте',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим практические примеры использования артиклей в работе программиста — в коде, документации и общении с командой.' },
        { type: 'code', language: 'text', value: 'Типичные IT-фразы с артиклями:\nOpen a pull request.        - Откройте пул-реквест.\nThe pull request is merged. - Пул-реквест смёрджен.\nWrite a test.               - Напишите тест.\nRun the tests.              - Запустите тесты.\nCreate a branch.            - Создайте ветку.\nMerge the branch.           - Смёрджите ветку.\nI found a bug.              - Я нашёл баг.\nFix the bug.                - Исправьте этот баг.' },
        { type: 'code', language: 'text', value: 'README и документация:\nThis is a REST API.                - Это REST API.\nThe API returns JSON data.         - API возвращает JSON.\nThis is an open-source project.    - Это опенсорс-проект.\nThe project uses React.            - Проект использует React.\nCreate an issue on GitHub.         - Создайте issue на GitHub.' },
        { type: 'note', value: 'В технической документации "the" используется очень часто, потому что речь идёт о конкретных системах. "The user", "the request", "the response", "the server" — всё это конкретные элементы системы.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Артикли',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте правильный артикль: "I am ___ developer."',
          solution: 'a',
          explanation: '"I am a developer." — Я разработчик. После to be перед профессией нужен артикль a/an. "Developer" начинается с согласного звука [d], поэтому "a".'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте правильный артикль: "She is ___ UX designer."',
          solution: 'a',
          explanation: '"She is a UX designer." Хотя UX начинается на букву U, слово произносится [ˈjuːeks] — начинается с согласного звука [j], поэтому "a".'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте: "I found ___ bug. ___ bug is critical."',
          solution: 'a, The',
          explanation: 'Первое упоминание — "a bug". Второй раз — уже знаем о каком баге, поэтому "The bug".'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильный вариант: "She knows ___ Python."',
          options: ['(no article)', 'a', 'the', 'an'],
          correct: 0,
          explanation: 'Перед названиями языков программирования артикль не нужен. "She knows Python." — Она знает Python.'
        }
      ]
    }
  ]
}
