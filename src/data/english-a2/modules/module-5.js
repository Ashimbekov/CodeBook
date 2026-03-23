export default {
  id: 5,
  title: 'Comparative and Superlative',
  description: 'Степени сравнения прилагательных и наречий: сравниваем технологии, производительность, решения.',
  lessons: [
    {
      id: 1,
      title: 'Comparative: сравнение двух объектов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Comparative (сравнительная степень) используется для сравнения двух объектов.\n\nОбразование:\n1. Короткие прилагательные (1 слог): + -er\nfast — faster (быстрее), slow — slower (медленнее), small — smaller (меньше), old — older (старше), new — newer (новее)\n\n2. Прилагательные на -y (2 слога): -y + -ier\nbusy — busier (более занятый), easy — easier (легче), heavy — heavier (тяжелее)\n\n3. Длинные прилагательные (2+ слога): more + прилагательное\nexpensive — more expensive (дороже), efficient — more efficient (более эффективный), complex — more complex (сложнее), reliable — more reliable (надёжнее)\n\nСтруктура: A + is/are + comparative + than + B' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'Python is faster than PHP for data processing. (Python быстрее PHP для обработки данных.)\nThis database query is slower than expected. (Этот запрос к базе данных медленнее, чем ожидалось.)\nGo is more efficient than Python in terms of memory. (Go эффективнее Python с точки зрения памяти.)\nMicroservices are more complex than monolithic apps. (Микросервисы сложнее монолитных приложений.)\nThis solution is cheaper than using a managed service. (Это решение дешевле, чем использование управляемого сервиса.)\nThe new algorithm is more reliable than the old one. (Новый алгоритм надёжнее старого.)\nReact is easier to learn than Angular for beginners. (React проще изучить для начинающих, чем Angular.)\nSSDs are faster than HDDs. (SSD быстрее HDD.)' }
      ]
    },
    {
      id: 2,
      title: 'Superlative: самый из многих',
      type: 'theory',
      content: [
        { type: 'text', value: 'Superlative (превосходная степень) используется для выделения одного из трёх и более объектов.\n\nОбразование:\n1. Короткие прилагательные (1 слог): the + -est\nfast — the fastest (самый быстрый), small — the smallest (самый маленький)\n\n2. Прилагательные на -y: the + -iest\nbusy — the busiest, easy — the easiest\n\n3. Длинные прилагательные: the most + прилагательное\nthe most efficient (наиболее эффективный), the most complex (наиболее сложный)\n\nСтруктура: A + is/are + the + superlative + (in/of + группа)' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'This is the fastest sorting algorithm we have. (Это самый быстрый алгоритм сортировки, который у нас есть.)\nPython is the most popular language for ML. (Python — самый популярный язык для машинного обучения.)\nThis was the worst production incident this year. (Это был худший производственный инцидент в этом году.)\nGoogle is the largest technology company in the world. (Google — крупнейшая технологическая компания в мире.)\nThis is the most complex bug I have ever fixed. (Это самый сложный баг, который я когда-либо исправлял.)\nWhat is the best database for our use case? (Какая база данных лучше всего подходит для нашего случая?)\nKubernetes has the steepest learning curve. (Kubernetes имеет наиболее крутую кривую обучения.)' }
      ]
    },
    {
      id: 3,
      title: 'Нерегулярные формы и особые случаи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Нерегулярные формы (важно запомнить!):\ngood — better — the best (хороший — лучше — лучший)\nbad — worse — the worst (плохой — хуже — худший)\nmany/much — more — the most (много — больше — больше всего)\nlittle/few — less/fewer — the least/fewest (мало — меньше — меньше всего)\nfar — farther/further — the farthest/furthest (далёкий)' },
        { type: 'heading', value: 'IT-примеры с нерегулярными формами' },
        { type: 'text', value: 'This code is better than my first version. (Этот код лучше, чем моя первая версия.)\nThe situation is getting worse — there are more bugs than yesterday. (Ситуация ухудшается — багов больше, чем вчера.)\nThis is the best solution we have tried. (Это лучшее решение, которое мы пробовали.)\nThis was the worst deployment in our history. (Это был худший деплой в нашей истории.)\nWe have less time than before to fix this. (У нас меньше времени, чем раньше, чтобы исправить это.)\nWe have more features to implement than originally planned. (У нас больше функций для реализации, чем изначально планировалось.)' },
        { type: 'heading', value: 'Less/Fewer: меньше' },
        { type: 'text', value: 'fewer — для исчисляемых существительных:\nWe have fewer bugs this sprint. (У нас меньше багов в этом спринте.)\nFewer engineers are working on legacy code. (Меньше инженеров работают над устаревшим кодом.)\n\nless — для неисчисляемых существительных:\nThis approach requires less memory. (Этот подход требует меньше памяти.)\nWe spend less time on manual testing now. (Теперь мы тратим меньше времени на ручное тестирование.)' }
      ]
    },
    {
      id: 4,
      title: 'Сравнения в IT: технологии и производительность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полезные прилагательные для IT-сравнений:\n\nбыстрый/медленный: fast/slow — faster/slower — the fastest/slowest\nпроизводительный: efficient — more efficient — the most efficient\nнадёжный: reliable — more reliable — the most reliable\nбезопасный: secure — more secure — the most secure\nмасштабируемый: scalable — more scalable — the most scalable\nгибкий: flexible — more flexible — the most flexible\nдорогой/дешёвый: expensive/cheap — more expensive/cheaper — the most expensive/cheapest\nлёгкий/сложный: easy/difficult — easier/more difficult — the easiest/most difficult\nмощный: powerful — more powerful — the most powerful\nлёгкий (по весу): lightweight — more lightweight — the most lightweight' },
        { type: 'heading', value: 'Примеры сравнения технологий' },
        { type: 'text', value: 'PostgreSQL is more reliable than MySQL for complex queries. (PostgreSQL надёжнее MySQL для сложных запросов.)\nDocker containers are lighter than virtual machines. (Docker-контейнеры легче виртуальных машин.)\nRust is safer than C++ in terms of memory management. (Rust безопаснее C++ с точки зрения управления памятью.)\nThe new API is faster and more efficient than the old one. (Новый API быстрее и эффективнее старого.)\nCloud services are more scalable than on-premise solutions. (Облачные сервисы масштабируемее локальных решений.)' }
      ]
    },
    {
      id: 5,
      title: 'Словарный запас: характеристики технологий',
      type: 'theory',
      content: [
        { type: 'text', value: 'performance (производительность) — high/low/better performance\nlatency (задержка) — low/high latency, lower/higher latency\nthroughput (пропускная способность) — higher/lower throughput\nscalability (масштабируемость) — better scalability\nreliability (надёжность) — more/less reliable\nsecurity (безопасность) — more/less secure\nmaintainability (поддерживаемость) — easier/harder to maintain\nreadability (читаемость) — more/less readable\ncomplexity (сложность) — more/less complex\nflexibility (гибкость) — more/less flexible\ncost (стоимость) — cheaper/more expensive\nspeed (скорость) — faster/slower' },
        { type: 'heading', value: 'Фразы для технических обсуждений' },
        { type: 'text', value: 'This solution is more efficient than... (Это решение эффективнее, чем...)\nCompared to X, Y is... (По сравнению с X, Y является...)\nThe main advantage is that it\'s faster. (Главное преимущество — оно быстрее.)\nThe biggest disadvantage is that it\'s more complex. (Главный недостаток — оно сложнее.)\nOption A is better for our use case. (Вариант А лучше подходит для нашего случая.)\nThe old version was worse in terms of performance. (Старая версия была хуже с точки зрения производительности.)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Составление сравнений',
      type: 'practice',
            description: 'Составьте предложения, используя comparative или superlative.',
      solution: 'Правильные ответы:\\n1. Go is faster than Python for network applications.\\n2. This is the most complex bug I have ever seen.\\n3. This approach requires less memory than the previous one.\\n4. AWS is the most widely used cloud provider.\\n5. The new version is more secure and reliable.\\n6. Docker is lighter than virtual machines.\\n7. Which programming language is the easiest to learn?',
content: [
        { type: 'text', value: 'Составьте предложения, используя comparative или superlative.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Go быстрее Python для сетевых приложений.', answer: 'Go is faster than Python for network applications.' },
            { id: 2, question: 'Это самый сложный баг, который я видел.', answer: 'This is the most complex bug I have ever seen.' },
            { id: 3, question: 'Этот подход требует меньше памяти, чем предыдущий.', answer: 'This approach requires less memory than the previous one.' },
            { id: 4, question: 'AWS является наиболее широко используемым облачным провайдером.', answer: 'AWS is the most widely used cloud provider.' },
            { id: 5, question: 'Новая версия более безопасна и надёжна.', answer: 'The new version is more secure and reliable.' },
            { id: 6, question: 'Docker легче виртуальных машин.', answer: 'Docker is lighter than virtual machines.' },
            { id: 7, question: 'Какой язык программирования самый лёгкий для изучения?', answer: 'Which programming language is the easiest to learn?' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Заполнить пропуски',
      type: 'practice',
            description: 'Вставьте правильную форму прилагательного.',
      solution: 'Правильные ответы:\\n1. easier\\n2. worst\\n3. more powerful\\n4. more\\n5. most efficient\\n6. more expensive / more scalable\\n7. faster',
content: [
        { type: 'text', value: 'Вставьте правильную форму прилагательного.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'Python is ___ (easy) to read than Java.', answer: 'easier' },
            { id: 2, question: 'This is the ___ (bad) production incident we\'ve ever had.', answer: 'worst' },
            { id: 3, question: 'The new server is ___ (powerful) than the old one.', answer: 'more powerful' },
            { id: 4, question: 'React has ___ (many) job opportunities than Vue.', answer: 'more' },
            { id: 5, question: 'This algorithm is the ___ (efficient) in our codebase.', answer: 'most efficient' },
            { id: 6, question: 'The cloud solution is ___ (expensive) but ___ (scalable).', answer: 'more expensive / more scalable' },
            { id: 7, question: 'After the optimization, the app is 3x ___ (fast).', answer: 'faster' }
          ]
        }
      ]
    }
  ]
}
