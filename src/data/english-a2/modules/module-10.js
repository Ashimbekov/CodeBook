export default {
  id: 10,
  title: 'Countable/Uncountable: much/many/some/any',
  description: 'Исчисляемые и неисчисляемые существительные, количественные местоимения в IT-контексте.',
  lessons: [
    {
      id: 1,
      title: 'Исчисляемые и неисчисляемые существительные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Исчисляемые (Countable) — можно посчитать, имеют единственное и множественное число:\na bug — bugs (баг — баги)\na file — files (файл — файлы)\na server — servers (сервер — серверы)\na user — users (пользователь — пользователи)\na feature — features (функция — функции)\nan error — errors (ошибка — ошибки)\na module — modules (модуль — модули)\n\nНеисчисляемые (Uncountable) — нельзя посчитать, нет множественного числа:\ndata (данные) — much data, NOT many datas\ncode (код)\nmemory (память)\nsoftware (программное обеспечение)\nhardware (аппаратное обеспечение)\ntraffic (трафик)\ninformation (информация)\nfeedback (обратная связь)\naccess (доступ)\nsecurity (безопасность)\nperformance (производительность)\ntime (время)' }
      ]
    },
    {
      id: 2,
      title: 'Much, Many, A lot of',
      type: 'theory',
      content: [
        { type: 'text', value: 'MANY — с исчисляемыми существительными во множественном числе\nMUCH — с неисчисляемыми существительными\nA LOT OF / LOTS OF — с обоими (в утвердительных предложениях)\n\nОбычное использование:\n- many/much — в вопросах и отрицаниях\n- a lot of — в утвердительных предложениях\n\nПримеры с MANY:\nHow many bugs are in this sprint? (Сколько багов в этом спринте?)\nThere are many errors in the log. (В логе много ошибок.)\nWe don\'t have many developers on this project. (У нас не много разработчиков на этом проекте.)\n\nПримеры с MUCH:\nHow much memory does this process use? (Сколько памяти использует этот процесс?)\nThere isn\'t much time before the deadline. (До дедлайна не много времени.)\nDo you have much experience with Kubernetes? (У тебя много опыта с Kubernetes?)' },
        { type: 'heading', value: 'A lot of / Lots of' },
        { type: 'text', value: 'We have a lot of technical debt in this codebase. (У нас много технического долга в этой кодовой базе.)\nThere are lots of bugs to fix before the release. (Много багов нужно исправить перед релизом.)\nShe has a lot of experience with cloud services. (У неё много опыта с облачными сервисами.)\nThis app generates a lot of log data. (Это приложение генерирует много данных логов.)' }
      ]
    },
    {
      id: 3,
      title: 'Some и Any',
      type: 'theory',
      content: [
        { type: 'text', value: 'SOME — в утвердительных предложениях (немного, несколько)\nANY — в вопросах и отрицаниях (какой-нибудь, никакой)\n\nОба используются с исчисляемыми (мн.ч.) и неисчисляемыми существительными.\n\nSOME в утвердительных:\nThere are some bugs in the new release. (В новом релизе есть несколько багов.)\nWe have some memory issues in production. (У нас есть проблемы с памятью в продакшне.)\nShe made some improvements to the algorithm. (Она внесла некоторые улучшения в алгоритм.)\n\nANY в вопросах:\nAre there any errors in the log? (Есть ли какие-нибудь ошибки в логе?)\nDo you have any experience with React? (У тебя есть опыт работы с React?)\nIs there any documentation for this API? (Есть ли какая-нибудь документация для этого API?)\n\nANY в отрицаниях:\nThere aren\'t any tests for this module. (Для этого модуля нет никаких тестов.)\nWe don\'t have any time to refactor this. (У нас нет времени рефакторить это.)\nI don\'t see any errors in the output. (Я не вижу никаких ошибок в выводе.)' }
      ]
    },
    {
      id: 4,
      title: 'Few/A few, Little/A little',
      type: 'theory',
      content: [
        { type: 'text', value: 'FEW / A FEW — для исчисляемых существительных\nfew — мало (недостаточно, негативный оттенок)\na few — несколько (достаточно, нейтральный/позитивный)\n\nLITTLE / A LITTLE — для неисчисляемых существительных\nlittle — мало (недостаточно)\na little — немного (достаточно)' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'FEW (недостаточно):\nWe have few developers for this large project. (У нас мало разработчиков для этого большого проекта.)\nThere are few tests in this codebase. (В этой кодовой базе мало тестов.)\n\nA FEW (несколько — достаточно):\nI have a few bugs to fix today. (У меня есть несколько багов для исправления сегодня.)\nWe made a few improvements to the UI. (Мы внесли несколько улучшений в UI.)\nA few colleagues reviewed my code. (Несколько коллег проверили мой код.)\n\nLITTLE (недостаточно мало):\nWe have little time before the deadline. (У нас мало времени до дедлайна.)\nThere is little documentation for this API. (Для этого API мало документации.)\n\nA LITTLE (немного — достаточно):\nI have a little experience with Go. (У меня есть немного опыта с Go.)\nLet\'s add a little more error handling. (Давайте добавим немного больше обработки ошибок.)' }
      ]
    },
    {
      id: 5,
      title: 'Словарный запас: IT-существительные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Исчисляемые IT-существительные:\nbug (баг), error (ошибка), feature (функция), module (модуль), class (класс), method (метод), function (функция), variable (переменная), file (файл), server (сервер), database (база данных), endpoint (эндпоинт), request (запрос), response (ответ), test (тест), commit (коммит), branch (ветка), ticket (тикет), sprint (спринт), task (задача), developer (разработчик)\n\nНеисчисляемые IT-существительные:\ncode (код), software (ПО), hardware (железо), data (данные), memory (память), storage (хранилище), bandwidth (пропускная способность), traffic (трафик), security (безопасность), performance (производительность), feedback (обратная связь), documentation (документация), information (информация), access (доступ), time (время), knowledge (знания)' },
        { type: 'heading', value: 'Количественные выражения в IT' },
        { type: 'text', value: 'a number of bugs (ряд багов)\na large amount of data (большой объём данных)\na piece of code (фрагмент кода)\na set of requirements (набор требований)\na list of tasks (список задач)\na lack of documentation (недостаток документации)\na shortage of developers (нехватка разработчиков)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: much, many, some, any',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте much, many, some или any.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'How ___ bugs are in the backlog?', answer: 'many' },
            { id: 2, question: 'We don\'t have ___ time before the deadline.', answer: 'much' },
            { id: 3, question: 'There are ___ new features in this release.', answer: 'some' },
            { id: 4, question: 'Do you have ___ experience with microservices?', answer: 'any' },
            { id: 5, question: 'I need ___ information about the API.', answer: 'some' },
            { id: 6, question: 'There isn\'t ___ documentation for this endpoint.', answer: 'any' },
            { id: 7, question: 'How ___ memory does this process consume?', answer: 'much' },
            { id: 8, question: 'We need to fix ___ critical bugs before the release.', answer: 'some' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Перевод',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'У нас много технического долга в этом проекте.', answer: 'We have a lot of technical debt in this project.' },
            { id: 2, question: 'Для этого модуля нет тестов.', answer: 'There aren\'t any tests for this module.' },
            { id: 3, question: 'Сколько памяти использует этот сервис?', answer: 'How much memory does this service use?' },
            { id: 4, question: 'У меня есть несколько вопросов по архитектуре.', answer: 'I have a few questions about the architecture.' },
            { id: 5, question: 'Мало разработчиков умеют работать с этим инструментом.', answer: 'Few developers know how to use this tool.' },
            { id: 6, question: 'У нас есть немного времени для рефакторинга.', answer: 'We have a little time for refactoring.' }
          ]
        }
      ]
    }
  ]
}
