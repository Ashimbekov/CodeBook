export default {
  id: 1,
  title: 'Алфавит и произношение',
  description: 'Английский алфавит, буквы, звуки и базовое произношение',
  lessons: [
    {
      id: 1,
      title: 'Английский алфавит',
      type: 'theory',
      content: [
        { type: 'text', value: 'Английский алфавит состоит из 26 букв. Каждая буква имеет своё название и звук. Знание алфавита необходимо для чтения документации, имён переменных и комментариев в коде.' },
        { type: 'code', language: 'text', value: 'A a - [эй]      B b - [би]      C c - [си]\nD d - [ди]      E e - [и]       F f - [эф]\nG g - [джи]     H h - [эйч]     I i - [ай]\nJ j - [джей]    K k - [кей]     L l - [эл]\nM m - [эм]      N n - [эн]      O o - [оу]\nP p - [пи]      Q q - [кью]     R r - [ар]\nS s - [эс]      T t - [ти]      U u - [ю]\nV v - [ви]      W w - [дабл-ю]  X x - [экс]\nY y - [вай]     Z z - [зед/зи]' },
        { type: 'tip', value: 'В IT особенно важны буквы: A (array), B (boolean), C (class), D (debug), F (function), I (index), O (object), S (string), V (variable). Запомни их первыми!' },
        { type: 'note', value: 'Гласные буквы: A, E, I, O, U. Все остальные — согласные. Это важно для правила артиклей a/an, которое мы изучим в модуле 3.' }
      ]
    },
    {
      id: 2,
      title: 'Гласные и согласные звуки',
      type: 'theory',
      content: [
        { type: 'text', value: 'В английском языке буква и звук часто не совпадают. Одна буква может давать разные звуки в зависимости от позиции в слове.' },
        { type: 'code', language: 'text', value: 'Гласные:\nA - [æ] cat, app, add    или [eɪ] name, game, save\nE - [e] get, set, test   или [iː] see, free, delete\nI - [ɪ] it, bit, list    или [aɪ] file, time, drive\nO - [ɒ] not, log, stop   или [əʊ] code, mode, home\nU - [ʌ] run, bug, function или [uː] use, true, include' },
        { type: 'code', language: 'text', value: 'Согласные (особые случаи):\nC - [k] перед a,o,u: code, copy, cut\nC - [s] перед e,i,y: cell, circle, cycle\nG - [g] перед a,o,u: get, go, grep\nG - [dʒ] перед e,i,y: general, git\nPH - [f]: PHP, phase, graph' },
        { type: 'tip', value: 'Слово "git" произносится [гит], "GitHub" — [гитхаб], "grep" — [грэп]. Эти IT-слова вы будете слышать и произносить каждый день.' }
      ]
    },
    {
      id: 3,
      title: 'Произношение IT-терминов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Программисты ежедневно используют английские технические термины. Важно знать, как их правильно произносить на встречах и в разговорах с коллегами.' },
        { type: 'code', language: 'text', value: 'Базовые IT-слова и произношение:\ncode      - [коуд]     - код\nfile      - [файл]     - файл\ndata      - [дэйта]    - данные\nbug       - [баг]      - ошибка\ntest      - [тест]     - тест\nloop      - [луп]      - цикл\narray     - [эрэй]     - массив\nstring    - [стринг]   - строка\nclass     - [клас]     - класс\nfunction  - [фанкшн]   - функция' },
        { type: 'code', language: 'text', value: 'Трудные для произношения:\nalgorithm - [элгоритм]  - алгоритм\nvariable  - [вэриэбл]   - переменная\nboolean   - [булиэн]    - логический тип\ndatabase  - [дэйтэбейс] - база данных\nexecute   - [эксикьют]  - выполнить\ninterface - [интерфейс] - интерфейс\nrepository- [рипозитори]- репозиторий' },
        { type: 'warning', value: 'Распространённые ошибки: "cache" — [кэш], не [кэйч]; "queue" — [кью], не [куэуэ]; "schema" — [скима], не [схема]; "sudo" — [судоу], не [суду].' }
      ]
    },
    {
      id: 4,
      title: 'Транскрипция и словари',
      type: 'theory',
      content: [
        { type: 'text', value: 'Транскрипция — это запись произношения слова с помощью специальных символов IPA (International Phonetic Alphabet). Все словари используют транскрипцию.' },
        { type: 'code', language: 'text', value: 'Основные символы IPA:\n[æ]  - короткий "а" как в слове "cat"\n[iː] - длинный "и" как в слове "free"\n[ɒ]  - короткий "о" как в слове "not"\n[uː] - длинный "у" как в слове "true"\n[ʌ]  - краткий звук как в слове "run"\n[ə]  - нейтральный звук "э" (schwa)\n[θ]  - "th" как в слове "think" (межзубный)\n[ð]  - "th" как в слове "the" (звонкий)' },
        { type: 'code', language: 'text', value: 'Примеры с IT-словами:\nrun     [rʌn]    - запускать\nset     [set]    - устанавливать\nget     [get]    - получать\ntype    [taɪp]   - тип\nbuild   [bɪld]   - собирать\nthrow   [θrəʊ]   - выбрасывать (исключение)' },
        { type: 'tip', value: 'Используй онлайн-словарь Cambridge Dictionary (dictionary.cambridge.org) — там есть аудиопроизношение каждого слова. Нажимай на иконку динамика и слушай.' }
      ]
    },
    {
      id: 5,
      title: 'Ударение в словах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ударение (stress) в английских словах очень важно. Неправильное ударение может помешать вас понять. В транскрипции ударение обозначается знаком [ˈ] перед ударным слогом.' },
        { type: 'code', language: 'text', value: 'IT-слова с ударением:\nCOMputer   - [kəmˈpjuːtər]  - компьютер\nPROgram    - [ˈprəʊɡræm]   - программа\nINternet   - [ˈɪntənet]    - интернет\nDATAbase   - [ˈdeɪtəbeɪs]  - база данных\nALgorithm  - [ˈælɡərɪðm]   - алгоритм\nDEveloper  - [dɪˈveləpər]  - разработчик\nAPPlication- [ˌæplɪˈkeɪʃn]- приложение\nREpository - [rɪˈpɒzɪtri]  - репозиторий' },
        { type: 'warning', value: 'Слово "program" — ударение на первый слог [ˈprəʊɡræm]. Слово "programmer" — тоже на первый [ˈprəʊɡræmər]. Не путайте с русским "программИст".' }
      ]
    },
    {
      id: 6,
      title: 'Чтение названий букв и аббревиатур',
      type: 'theory',
      content: [
        { type: 'text', value: 'В IT постоянно встречаются аббревиатуры. Нужно уметь читать как отдельные буквы (по названиям), так и произносить как слово (акроним).' },
        { type: 'code', language: 'text', value: 'Аббревиатуры — читаем буквы по названиям:\nAPI  - [эй-пи-ай]   - Application Programming Interface\nURL  - [ю-ар-эл]    - Uniform Resource Locator\nHTTP - [эйч-ти-ти-пи] - HyperText Transfer Protocol\nSQL  - [эс-кью-эл]  - Structured Query Language\nCSS  - [си-эс-эс]   - Cascading Style Sheets\nCPU  - [си-пи-ю]    - Central Processing Unit\nRAM  - [ар-эй-эм]   - Random Access Memory\nOS   - [оу-эс]      - Operating System' },
        { type: 'code', language: 'text', value: 'Акронимы — произносим как слово:\nNASA  - [нэйса]\nSCSI  - [скази]\nWIFI  - [вайфай]\nSaaS  - [сас]     - Software as a Service\nGUI   - [гуи]     - Graphical User Interface\nRegex - [риджекс] - Regular Expression' },
        { type: 'tip', value: 'SQL произносят по-разному: [эс-кью-эл] (официально) или [сиквел] (неформально). Оба варианта правильны!' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Алфавит',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Как называется буква "W" в английском алфавите?',
          options: ['дабл-ю', 'ви', 'вэ', 'ву'],
          correct: 0,
          explanation: 'Буква W называется "double-u" [дабл-ю]. Это единственная буква алфавита с двухсложным названием.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Как правильно произносится слово "cache"?',
          options: ['[кэш]', '[кэйч]', '[каче]', '[кейс]'],
          correct: 0,
          explanation: 'Cache [кэш] — кэш, временная память. Произносится как русское слово "кэш".'
        },
        {
          type: 'task',
          taskType: 'match',
          question: 'Соедините аббревиатуру с её произношением:',
          pairs: [
            { left: 'API', right: '[эй-пи-ай]' },
            { left: 'URL', right: '[ю-ар-эл]' },
            { left: 'CSS', right: '[си-эс-эс]' },
            { left: 'SQL', right: '[эс-кью-эл]' }
          ],
          explanation: 'Все эти аббревиатуры читаются побуквенно, используя английские названия букв.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Произношение IT-терминов',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите на русский и напишите произношение: "variable"',
          solution: 'переменная — [вэриэбл]',
          explanation: 'Variable [ˈveəriəbl] — переменная. Ударение на первый слог "ВЭ-ри-эбл".'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите на русский: "function", "loop", "array", "string"',
          solution: 'function — функция, loop — цикл, array — массив, string — строка',
          explanation: 'Это четыре самых важных IT-слова для программиста. Выучите их наизусть!'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Заполните пропуск: "________ [баг]" — это ошибка в программе.',
          solution: 'Bug',
          explanation: 'Bug [bʌɡ] — баг, ошибка в программе. Говорят: "I found a bug" — "Я нашёл ошибку".'
        }
      ]
    }
  ]
}
