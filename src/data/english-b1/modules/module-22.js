export default {
  id: 22,
  title: 'Reading: Technical Articles (Medium, Dev.to)',
  description: 'Как эффективно читать технические статьи на английском. Стратегии понимания, ключевая лексика и работа со сложными текстами.',
  lessons: [
    {
      id: 1,
      title: 'Structure of a technical article',
      type: 'theory',
      content: [
        { type: 'text', value: 'Технические статьи на Medium и Dev.to имеют типичную структуру. Зная её, ты можешь решить за 30 секунд, стоит ли читать статью полностью.' },
        { type: 'heading', value: 'Typical article structure' },
        { type: 'list', items: [
          'Title — заголовок: часто содержит проблему или обещание ("How I...", "Why you should...", "The problem with...")',
          'Hook / Introduction — захват внимания: проблема, с которой сталкивался читатель',
          'Background / Context — контекст: что привело автора к этой теме',
          'Main content — основное содержание: решение, объяснение, туториал',
          'Code examples — примеры кода с объяснениями',
          'Conclusion / TL;DR — итог, краткий вывод',
          'References / Further reading — ссылки для углублённого изучения'
        ]},
        { type: 'heading', value: 'TL;DR — Too Long; Didn\'t Read' },
        { type: 'text', value: 'TL;DR — это краткое резюме статьи для тех, кто не хочет читать всё. Если статья длинная, начни с TL;DR, чтобы решить, нужна ли она тебе.' },
        { type: 'tip', value: 'Начинай чтение технической статьи так: Title → TL;DR (если есть) → Subheadings → Code examples. Только потом читай полный текст, если тема актуальна.' }
      ]
    },
    {
      id: 2,
      title: 'Skimming and scanning techniques',
      type: 'theory',
      content: [
        { type: 'text', value: 'Skimming (просмотр) и Scanning (поиск) — два ключевых метода чтения на B1 уровне. Они позволяют читать быстро и эффективно.' },
        { type: 'heading', value: 'Skimming — быстрый просмотр' },
        { type: 'text', value: 'Skimming — чтение для общего понимания. Читай первое и последнее предложение каждого абзаца, заголовки, выделенный текст. Цель: понять о чём статья за 1-2 минуты.' },
        { type: 'heading', value: 'Scanning — поиск конкретного' },
        { type: 'text', value: 'Scanning — поиск конкретной информации. Двигай глазами по тексту быстро, ища ключевые слова. Цель: найти ответ на конкретный вопрос.' },
        { type: 'heading', value: 'Reading signals to look for' },
        { type: 'list', items: [
          '"The key point here is..." — главная мысль следует далее',
          '"In other words..." / "That is to say..." — сейчас будет перефраз',
          '"For example..." / "For instance..." — пример',
          '"However..." / "On the other hand..." — противопоставление',
          '"In summary..." / "To summarize..." — итог, вывод',
          '"Note that..." — важное уточнение'
        ]},
        { type: 'note', value: 'Signal words (сигнальные слова) помогают предсказать, что будет в следующем предложении. Это сильно ускоряет понимание.' }
      ]
    },
    {
      id: 3,
      title: 'Technical writing style',
      type: 'theory',
      content: [
        { type: 'text', value: 'Технические статьи написаны в особом стиле, который отличается от художественной литературы или новостей.' },
        { type: 'heading', value: 'Features of technical writing' },
        { type: 'list', items: [
          'Active voice — активный залог ("Redis stores data..." не "Data is stored by Redis...")',
          'Short sentences — короткие предложения для ясности',
          'Imperative mood — повелительное наклонение в инструкциях ("Run the following command")',
          'Bullet points and numbered lists — структурированная подача',
          'Code blocks — блоки кода с подсветкой синтаксиса',
          'Specific vocabulary — конкретные технические термины без синонимов'
        ]},
        { type: 'heading', value: 'Common hedging phrases' },
        { type: 'text', value: 'Hedging — смягчение утверждений. Авторы используют его, чтобы не звучать категорично.' },
        { type: 'list', items: [
          '"This may cause..." — это может привести к...',
          '"In most cases..." — в большинстве случаев...',
          '"Generally speaking..." — в целом...',
          '"It\'s worth noting that..." — стоит отметить...',
          '"This approach might not work if..." — этот подход может не работать если...',
          '"As far as I know..." — насколько мне известно...'
        ]},
        { type: 'tip', value: 'Hedging phrases — важный признак честного технического автора. Если статья полна абсолютных утверждений ("always", "never") без оговорок — будь критичен.' }
      ]
    },
    {
      id: 4,
      title: 'Understanding complex sentences',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сложные предложения в технических текстах часто вызывают затруднения. Вот стратегии их разбора.' },
        { type: 'heading', value: 'Breaking down complex sentences' },
        { type: 'text', value: 'Пример сложного предложения:\n"The CAP theorem, which was formulated by Eric Brewer in 2000 and formally proven by Seth Gilbert and Nancy Lynch in 2002, states that a distributed data store cannot simultaneously provide more than two out of three guarantees: consistency, availability, and partition tolerance."\n\nКак разбить:\n1. Найди главный глагол: "states"\n2. Найди подлежащее: "The CAP theorem"\n3. Выдели вставную конструкцию (запятые): "which was formulated...2002"\n4. Прочитай основу: "The CAP theorem states that..."' },
        { type: 'heading', value: 'Useful grammar patterns' },
        { type: 'list', items: [
          'which/that + clause — вставная информация о предмете',
          'whereas / while — противопоставление двух фактов',
          'given that — учитывая, что',
          'provided that — при условии, что',
          'regardless of — независимо от',
          'as opposed to — в отличие от',
          'in terms of — с точки зрения'
        ]},
        { type: 'note', value: 'Когда сталкиваешься с непонятным предложением, найди главный глагол — всё остальное строится вокруг него.' }
      ]
    },
    {
      id: 5,
      title: 'Vocabulary in tech articles',
      type: 'theory',
      content: [
        { type: 'text', value: 'Технические статьи используют специальную лексику. Знание этих слов и выражений критически важно для понимания.' },
        { type: 'heading', value: 'Opinion and analysis words' },
        { type: 'list', items: [
          'argue — утверждать, доказывать ("The author argues that microservices aren\'t always better")',
          'highlight — подчёркивать, акцентировать ("This section highlights the trade-offs")',
          'demonstrate — демонстрировать ("The benchmark demonstrates a 40% improvement")',
          'suggest — предлагать, свидетельствовать ("The data suggests that caching helps")',
          'conclude — заключать ("The author concludes that...")',
          'address — рассматривать, решать ("This article addresses the scalability problem")'
        ]},
        { type: 'heading', value: 'Comparison words' },
        { type: 'list', items: [
          'superior to — превосходит',
          'inferior to — уступает',
          'comparable to — сопоставим с',
          'outperforms — превосходит по производительности',
          'trade-off — компромисс, соотношение',
          'pros and cons — плюсы и минусы'
        ]},
        { type: 'tip', value: 'Веди свой словарь технических слов. После каждой прочитанной статьи записывай 5-10 новых слов с примерами использования.' }
      ]
    },
    {
      id: 6,
      title: 'Practice: Read and comprehend',
      type: 'practice',
      difficulty: 'medium',
      description: 'Прочитай отрывок статьи и ответь на вопросы.',
      solution: 'Правильные ответы:\n1. Три проблемы localStorage: 1) синхронный — блокирует главный поток; 2) работает только со строками; 3) доступен любому JavaScript на странице, включая сторонние скрипты.\n2. HttpOnly cookies — "the gold standard" для чувствительных данных.\n3. Hedging phrase: "can cause noticeable performance degradation" или "can cause subtle bugs".\n4. Риторический вопрос: "So what should you use instead?"',
      text: 'Why You Should Stop Using localStorage\n\nI know what you\'re thinking: "localStorage is so convenient, why would I stop using it?" And you\'re right — it IS convenient. But convenient doesn\'t always mean correct.\n\nThe problem with localStorage is threefold. First, it\'s synchronous. Every read and write operation blocks the main thread, which can cause noticeable performance degradation in applications that frequently access storage. Second, it\'s limited to strings. You can work around this with JSON.stringify/parse, but this adds overhead and can cause subtle bugs with data types. Third, and most critically, localStorage is accessible by any JavaScript on the page — including third-party scripts. This makes it a poor choice for storing sensitive data like tokens.\n\nSo what should you use instead? For sensitive data, HttpOnly cookies are the gold standard. For client-side state that doesn\'t need persistence, keep it in memory. For non-sensitive persistent data, consider IndexedDB.\n\nTL;DR: localStorage is convenient but has real drawbacks around performance, type safety, and security. Know when not to use it.',
      tasks: [
        {
          question: 'Какие три проблемы localStorage называет автор?',
          answer: '1) Синхронный — блокирует главный поток. 2) Работает только со строками. 3) Доступен любому JavaScript на странице, включая сторонние скрипты.'
        },
        {
          question: 'Что автор рекомендует для хранения чувствительных данных?',
          answer: 'HttpOnly cookies — "the gold standard" для чувствительных данных.'
        },
        {
          question: 'Найди в тексте hedging phrase (смягчённое утверждение).',
          answer: '"can cause noticeable performance degradation" — "can cause" смягчает утверждение. Также "can cause subtle bugs".'
        },
        {
          question: 'Какой сигнальной фразой автор вводит решение?',
          answer: '"So what should you use instead?" — риторический вопрос вводит раздел с решением.'
        }
      ]
    },
    {
      id: 7,
      title: 'Practice: Identify text structure',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определи части структуры технической статьи.',
      solution: 'Правильные ответы:\n1. Hook / Introduction — захват внимания через знакомую разработчикам ситуацию.\n2. TL;DR — краткое резюме для тех, кто не хочет читать всю статью.\n3. Further reading / References — ссылки для углублённого изучения.',
      tasks: [
        {
          paragraph: 'Every developer has experienced it: you deploy to production, everything looks fine, and then at 2am your phone lights up. "Service is down." You spend the next three hours debugging, and the root cause? A null pointer exception that wasn\'t caught in testing.',
          question: 'Что это за часть статьи?',
          answer: 'Hook / Introduction — захват внимания через знакомую разработчикам ситуацию.'
        },
        {
          paragraph: 'TL;DR: Use optional chaining (?.) and nullish coalescing (??) operators to handle null/undefined values safely. They\'re supported in all modern browsers and Node.js 14+.',
          question: 'Что это за часть статьи?',
          answer: 'TL;DR — краткое резюме для тех, кто не хочет читать всю статью.'
        },
        {
          paragraph: 'Want to learn more? Check out the MDN documentation on optional chaining, the V8 blog on performance optimizations, and Kyle Simpson\'s "You Don\'t Know JS" series.',
          question: 'Что это за часть статьи?',
          answer: 'Further reading / References — ссылки для углублённого изучения.'
        }
      ]
    }
  ]
}
