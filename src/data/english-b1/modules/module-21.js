export default {
  id: 21,
  title: 'Reading: Technical Documentation',
  description: 'Как читать API-документацию, README библиотек и техническую документацию на английском. Стратегии чтения, ключевые паттерны и специальная лексика.',
  lessons: [
    {
      id: 1,
      title: 'Understanding API documentation structure',
      type: 'theory',
      content: [
        { type: 'text', value: 'API-документация имеет устойчивую структуру. Понимание этой структуры позволяет быстро находить нужную информацию, не читая всё подряд.' },
        { type: 'heading', value: 'Typical API doc sections' },
        { type: 'list', items: [
          'Overview / Introduction — общее описание, для чего служит API',
          'Getting Started / Quick Start — быстрый старт, первые шаги',
          'Authentication — как авторизоваться',
          'Endpoints / Methods — описание конкретных методов',
          'Parameters — входные параметры',
          'Request / Response — примеры запросов и ответов',
          'Error codes — коды ошибок и их значения',
          'Rate limits — ограничения на количество запросов',
          'Changelog / Release Notes — история изменений',
          'SDKs / Libraries — готовые клиенты'
        ]},
        { type: 'heading', value: 'Key vocabulary in API docs' },
        { type: 'list', items: [
          'endpoint — точка входа API, URL для запроса',
          'payload — данные, передаваемые в теле запроса',
          'deprecated — устаревший, не рекомендованный к использованию',
          'paginated — разбитый на страницы',
          'idempotent — идемпотентный (повторный запрос даёт тот же результат)',
          'throttling — ограничение частоты запросов'
        ]},
        { type: 'tip', value: 'Начинай чтение API-документации с раздела "Quick Start" или "Getting Started" — там всегда есть рабочий пример кода, который поможет понять суть быстрее.' }
      ]
    },
    {
      id: 2,
      title: 'Reading README files',
      type: 'theory',
      content: [
        { type: 'text', value: 'README — первый файл, который читает разработчик при знакомстве с библиотекой. Умение быстро извлекать нужную информацию из README экономит часы работы.' },
        { type: 'heading', value: 'Standard README sections' },
        { type: 'list', items: [
          'Badges — иконки статуса (build passing, coverage, npm version)',
          'Description — краткое описание, что делает библиотека',
          'Installation — как установить ("npm install ...", "pip install ...")',
          'Usage / Examples — как использовать, примеры кода',
          'API Reference — справочник по методам',
          'Configuration — настройки',
          'Contributing — как участвовать в разработке',
          'License — лицензия'
        ]},
        { type: 'heading', value: 'Scanning strategy' },
        { type: 'text', value: 'Не читай README целиком — скань его! Ищи конкретную информацию: как установить, как инициализировать, есть ли нужный метод.' },
        { type: 'list', items: [
          'Шаг 1: Прочитай Description (5-10 секунд) — понять суть',
          'Шаг 2: Найди Installation section — узнать как установить',
          'Шаг 3: Просмотри Usage examples — увидеть базовый синтаксис',
          'Шаг 4: Проверь Changelog/Version — актуальна ли документация'
        ]},
        { type: 'note', value: 'Если в README написано "WIP" (Work In Progress) или "experimental" — библиотека нестабильна. "Battle-tested" и "production-ready" означают надёжность.' }
      ]
    },
    {
      id: 3,
      title: 'Key phrases in technical documentation',
      type: 'theory',
      content: [
        { type: 'text', value: 'Техническая документация использует специфические формулировки. Знание этих паттернов ускоряет понимание.' },
        { type: 'heading', value: 'Describing requirements' },
        { type: 'list', items: [
          'must / must not — обязательно / категорически нельзя (стандарт RFC 2119)',
          'should / should not — рекомендуется / не рекомендуется',
          'may / may not — допускается / не допускается (опционально)',
          'required — обязательный параметр',
          'optional — необязательный параметр',
          'deprecated — устарело, не использовать'
        ]},
        { type: 'heading', value: 'Describing behavior' },
        { type: 'list', items: [
          'returns — возвращает ("This method returns a Promise")',
          'throws — выбрасывает исключение ("Throws TypeError if...")',
          'accepts — принимает ("Accepts a callback function")',
          'defaults to — по умолчанию равно ("Defaults to null")',
          'is nullable — может быть null',
          'is immutable — неизменяемый'
        ]},
        { type: 'heading', value: 'Warning phrases' },
        { type: 'list', items: [
          'Note: — обратите внимание',
          'Warning: — предупреждение (важно!)',
          'Caution: — осторожно',
          'Important: — важно',
          'Breaking change — изменение, ломающее обратную совместимость'
        ]},
        { type: 'tip', value: 'Всегда обращай особое внимание на "Warning:" и "Breaking change" в документации. Игнорирование этих меток — частая причина часов отладки.' }
      ]
    },
    {
      id: 4,
      title: 'Reading code examples in docs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Примеры кода в документации часто содержат комментарии с важными пояснениями. Умей читать не только код, но и его окружение.' },
        { type: 'heading', value: 'Reading a typical code example' },
        { type: 'code', language: 'javascript', value: '// Initialize the client with your API key\n// Note: Keep your API key secret, never commit it to git\nconst client = new ApiClient({\n  apiKey: process.env.API_KEY, // Use environment variable\n  timeout: 5000, // Optional: defaults to 3000ms\n  retries: 3     // Optional: number of retry attempts\n});\n\n// Fetch a list of users\n// Returns: Promise<User[]>\n// Throws: AuthError if apiKey is invalid\nconst users = await client.getUsers({\n  page: 1,          // Required\n  limit: 20,        // Optional, defaults to 10, max 100\n  filter: \'active\'  // Optional\n});' },
        { type: 'heading', value: 'What to look for in examples' },
        { type: 'list', items: [
          'Required vs Optional parameters — обязательные и необязательные параметры',
          'Default values — значения по умолчанию',
          'Type hints in comments — типы данных',
          'Error handling — как обрабатываются ошибки',
          'Best practices mentions — упоминания лучших практик'
        ]},
        { type: 'note', value: 'Комментарии в примерах документации — это не просто украшение. Разработчики оставляют там подсказки о подводных камнях и рекомендациях.' }
      ]
    },
    {
      id: 5,
      title: 'Error messages and troubleshooting docs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Часть документации посвящена ошибкам и их устранению. Умение читать troubleshooting-документацию — важный навык.' },
        { type: 'heading', value: 'Common error doc patterns' },
        { type: 'list', items: [
          'Symptom: / Problem: — описание проблемы',
          'Cause: — причина',
          'Solution: / Fix: / Resolution: — решение',
          'Workaround: — временное обходное решение',
          'See also: — ссылки на связанные разделы'
        ]},
        { type: 'heading', value: 'HTTP error codes in docs' },
        { type: 'list', items: [
          '400 Bad Request — неверный запрос, проверь параметры',
          '401 Unauthorized — нет авторизации или неверный токен',
          '403 Forbidden — нет прав доступа',
          '404 Not Found — ресурс не найден',
          '422 Unprocessable Entity — данные не прошли валидацию',
          '429 Too Many Requests — превышен rate limit',
          '500 Internal Server Error — ошибка сервера'
        ]},
        { type: 'tip', value: 'Когда видишь ошибку, сначала ищи её код или текст в разделе "Error Codes" документации — там часто есть точное объяснение и решение.' }
      ]
    },
    {
      id: 6,
      title: 'Practice: Reading Stripe API docs',
      type: 'practice',
      difficulty: 'medium',
      description: 'Прочитай отрывок из документации и ответь на вопросы.',
      solution: 'Правильные ответы:\n1. Обязательны два параметра: amount и currency (помечены как "required").\n2. Наименьшая единица валюты — центы для доллара ($1.00 = 100 cents).\n3. По умолчанию ["card"] — только карточные платежи.\n4. Не хранить данные карты на своём сервере — всегда использовать API Stripe.',
      text: 'Creating a PaymentIntent\n\nA PaymentIntent guides you through the process of collecting a payment from your customer. We recommend that you create exactly one PaymentIntent for each order or customer session in your system. You can reference the PaymentIntent later to see the history of payment attempts for a particular session.\n\nParameters:\n- amount (required) integer — Amount intended to be collected by this PaymentIntent. A positive integer representing how much to charge in the smallest currency unit (e.g., 100 cents to charge $1.00).\n- currency (required) string — Three-letter ISO currency code, in lowercase. Must be a supported currency.\n- payment_method_types array — The list of payment method types that this PaymentIntent is allowed to use. Defaults to [\"card\"].\n- description string — An arbitrary string attached to the object. Often useful for displaying to users.\n\nWarning: Do not store card details on your own server. Always use Stripe\'s APIs.',
      tasks: [
        {
          question: 'Какой параметр является обязательным?',
          answer: 'Два параметра обязательны: amount и currency.',
          explanation: 'В документации они помечены как "(required)".'
        },
        {
          question: 'Что означает "smallest currency unit"?',
          answer: 'Наименьшая единица валюты — например, центы для доллара. $1.00 = 100 cents.',
          explanation: 'Это важная деталь: сумма передаётся в центах, а не в долларах.'
        },
        {
          question: 'Каково значение по умолчанию для payment_method_types?',
          answer: 'По умолчанию ["card"] — только карточные платежи.',
          explanation: '"Defaults to [\"card\"]" — стандартное значение.'
        },
        {
          question: 'О чём предупреждает Warning?',
          answer: 'Не хранить данные карты на своём сервере — всегда использовать API Stripe.',
          explanation: 'Предупреждение касается безопасности — важнейший момент в платёжных системах.'
        }
      ]
    },
    {
      id: 7,
      title: 'Practice: README scanning',
      type: 'practice',
      difficulty: 'easy',
      description: 'Прочитай отрывок из README библиотеки и выполни задания.',
      solution: 'Правильные ответы:\n1. npm install axios\n2. axios автоматически трансформирует JSON, поддерживает интерсепторы запросов/ответов и работает в браузере и Node.js. fetch нативный только для браузера и требует больше ручной работы.\n3. Да, async/await поддерживается. Смотри документацию для примеров.',
      text: 'axios\n\nPromise based HTTP client for the browser and node.js\n\n[![npm version](https://badge.fury.io/js/axios.svg)](https://badge.fury.io/js/axios)\n[![Build Status](https://travis-ci.org/axios/axios.svg?branch=master)](https://travis-ci.org/axios/axios)\n\nInstalling\nnpm install axios\n\nBasic Usage\nconst axios = require(\'axios\');\n// Make a GET request\naxios.get(\'/user?ID=12345\')\n  .then(function (response) {\n    console.log(response);\n  })\n  .catch(function (error) {\n    console.log(error);\n  });\n\nNote: async/await is supported. See the documentation for examples.\n\naxios vs fetch\naxios automatically transforms JSON data, handles request/response interceptors, and works in both browsers and Node.js. fetch is a native browser API and requires more manual work.',
      tasks: [
        {
          question: 'Как установить axios?',
          answer: 'npm install axios'
        },
        {
          question: 'Чем axios отличается от fetch по мнению документации?',
          answer: 'axios автоматически трансформирует JSON, поддерживает интерсепторы запросов/ответов и работает в браузере и Node.js. fetch нативный только для браузера и требует больше ручной работы.'
        },
        {
          question: 'Поддерживается ли async/await?',
          answer: 'Да, async/await поддерживается. Смотри документацию для примеров.'
        }
      ]
    },
    {
      id: 8,
      title: 'Practice: Find information in docs',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используй реальную онлайн-документацию для выполнения заданий.',
      solution: 'Примеры ответов:\n1. Array.reduce(): синтаксис — arr.reduce(callback, initialValue); возвращает единственное значение; пример: [1,2,3].reduce((acc, val) => acc + val, 0) → 6.\n2. dependencies — пакеты, необходимые в production; devDependencies — пакеты только для разработки и тестирования (не устанавливаются в production).',
      tasks: [
        {
          task: 'Открой документацию MDN для Array.prototype.reduce(). Найди: 1) Синтаксис метода 2) Что возвращает метод 3) Пример с суммированием массива чисел.',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce',
          purpose: 'Практика навигации по реальной документации'
        },
        {
          task: 'Найди в документации npm раздел "package.json fields". Определи разницу между dependencies и devDependencies.',
          url: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json',
          purpose: 'Чтение документации инструментов'
        }
      ]
    }
  ]
}
