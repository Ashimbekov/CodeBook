export default {
  id: 27,
  title: 'Listening: Conference Talks',
  description: 'Как слушать и понимать технические доклады на конференциях. Стратегии аудирования, типичные структуры докладов и ключевая лексика.',
  lessons: [
    {
      id: 1,
      title: 'Understanding conference talk structure',
      type: 'theory',
      content: [
        { type: 'text', value: 'Технические доклады на конференциях (JSConf, PyCon, KubeCon и др.) имеют типичную структуру. Зная её, легче следить за содержанием даже при неполном понимании слов.' },
        { type: 'heading', value: 'Typical talk structure' },
        { type: 'list', items: [
          'Hook / Opening — захватывающее начало: история, шокирующий факт или вопрос',
          'Speaker intro — кто докладчик и почему он говорит об этом',
          'Problem statement — проблема, которую решает доклад',
          'Agenda — что будет в докладе (3-4 пункта)',
          'Main content — основной материал, обычно 3-5 разделов',
          'Demo / Examples — живая демонстрация или примеры',
          'Lessons learned — выводы',
          'Q&A — вопросы и ответы'
        ]},
        { type: 'heading', value: 'Signpost phrases speakers use' },
        { type: 'list', items: [
          '"Today I\'m going to talk about..." — сегодня я расскажу о...',
          '"Let me start by..." — начну с...',
          '"Moving on to..." — переходя к...',
          '"This brings me to my next point..." — это подводит меня к следующей теме...',
          '"Let me give you an example..." — позвольте привести пример...',
          '"So, to summarize..." — итак, подведём итог...',
          '"Before I finish, I want to..." — прежде чем закончить, хочу...'
        ]},
        { type: 'tip', value: 'Сигнальные фразы ("Moving on to...", "Let me summarize...") — твои маяки при аудировании. Даже если что-то пропустил, они помогают снова поймать нить.' }
      ]
    },
    {
      id: 2,
      title: 'Listening strategies for technical talks',
      type: 'theory',
      content: [
        { type: 'text', value: 'Профессиональные конференционные доклады бывают сложны для понимания из-за акцентов, скорости речи и технического жаргона. Вот стратегии для улучшения восприятия.' },
        { type: 'heading', value: 'Active listening strategies' },
        { type: 'list', items: [
          'Take notes — записывай ключевые термины и идеи, не всё подряд',
          'Use slides — слайды помогают понять, о чём говорит докладчик',
          'Don\'t stop at unknown words — не застревай на незнакомых словах, слушай контекст',
          'Predict what comes next — предсказывай содержание по сигнальным фразам',
          'Use playback control — используй паузу и перемотку на 15-30 секунд назад',
          'Watch with subtitles first — сначала с субтитрами, потом без'
        ]},
        { type: 'heading', value: 'Understanding accents' },
        { type: 'text', value: 'На международных конференциях докладчики говорят с разными акцентами: американским, британским, индийским, французским. Чем больше ты слушаешь, тем легче понимать.' },
        { type: 'list', items: [
          'Recommended YouTube channels: Fireship, Theo (t3.gg), TechWorld with Nana',
          'Conferences: Google I/O, AWS re:Invent, JSConf (все есть на YouTube)',
          'Podcasts: Syntax.fm, The Changelog, Software Engineering Daily'
        ]},
        { type: 'note', value: 'Начни с докладов с субтитрами. Постепенно переходи к тем, где субтитры только автоматические (менее точные), и наконец — без субтитров.' }
      ]
    },
    {
      id: 3,
      title: 'Key vocabulary in conference talks',
      type: 'theory',
      content: [
        { type: 'text', value: 'В конференционных докладах повторяется определённый словарный запас. Знание этих слов резко улучшает понимание.' },
        { type: 'heading', value: 'Presentation vocabulary' },
        { type: 'list', items: [
          'walk through — пройти по шагам ("Let me walk you through the architecture")',
          'dive into — углубиться в ("Today we\'re going to dive into React internals")',
          'zoom out / zoom in — посмотреть шире / углубиться',
          'unpack — распаковать, подробно рассмотреть ("Let\'s unpack what this means")',
          'level set — выровнять понимание ("Let me level set on what we mean by...")',
          'call out — отметить, выделить ("I want to call out one important thing here")',
          'touch on — кратко коснуться ("We\'ll touch on performance later")'
        ]},
        { type: 'heading', value: 'Rhetorical patterns' },
        { type: 'list', items: [
          'Problem-Solution: "The problem is... The solution is..."',
          'Before-After: "Before this change... After this change..."',
          'Myth-Reality: "You might think... But actually..."',
          'Rule of Three: три примера, три причины, три шага',
          'Callback: возврат к теме из начала доклада в конце'
        ]},
        { type: 'tip', value: '"Walk through" — одно из самых частых выражений в технических докладах. "Let me walk you through the code" означает "давайте я покажу вам код шаг за шагом".' }
      ]
    },
    {
      id: 4,
      title: 'Understanding Q&A sessions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Q&A (вопросы и ответы) после доклада — сложная часть для понимания: вопросы задаются спонтанно, без подготовки, с разными акцентами.' },
        { type: 'heading', value: 'Common Q&A question patterns' },
        { type: 'list', items: [
          '"Have you considered...?" — вы рассматривали...?',
          '"How does this compare to...?" — как это соотносится с...?',
          '"What are the limitations of this approach?" — каковы ограничения?',
          '"Did you benchmark this against...?" — вы сравнивали производительность с...?',
          '"Is this production-ready?" — это готово к продакшну?',
          '"How do you handle the case where...?" — как вы обрабатываете случай, когда...?'
        ]},
        { type: 'heading', value: 'Speaker answer patterns' },
        { type: 'list', items: [
          '"That\'s a great question." — хороший вопрос (дежурная фраза)',
          '"So what you\'re asking is..." — перефразирование вопроса',
          '"The short answer is... The longer answer is..." — краткий и развёрнутый ответ',
          '"I don\'t have the data on that, but..." — у меня нет данных, но...',
          '"We\'ve seen in our benchmarks that..." — в наших тестах...',
          '"That\'s something we\'re actively working on." — над этим мы активно работаем'
        ]},
        { type: 'note', value: 'Если ты не понял вопрос в Q&A — не страшно. Смотри за реакцией докладчика и контекстом ответа.' }
      ]
    },
    {
      id: 5,
      title: 'Recommended talks and how to use them',
      type: 'theory',
      content: [
        { type: 'text', value: 'Регулярное просмотр технических докладов — лучший способ улучшить понимание на слух и обогатить словарный запас.' },
        { type: 'heading', value: 'How to watch a talk effectively' },
        { type: 'list', items: [
          '1. Первый просмотр — с субтитрами, общее понимание',
          '2. Записывай незнакомые слова (не всё, а ключевые)',
          '3. Второй просмотр — без субтитров, проверяй понимание',
          '4. Ищи незнакомые слова после просмотра, не во время',
          '5. Пробуй пересказать главную мысль доклада одним абзацем'
        ]},
        { type: 'heading', value: 'Recommended talks for B1 level' },
        { type: 'list', items: [
          '"The Future of Programming" by Bret Victor (чёткая речь, исторический контекст)',
          '"You don\'t know JS" talks by Kyle Simpson (практический JavaScript)',
          'TechWorld with Nana Kubernetes tutorials (чёткое произношение, хорошая структура)',
          'Google I/O keynotes (профессиональная подача, субтитры)'
        ]},
        { type: 'tip', value: 'Смотри один и тот же доклад несколько раз с промежутком в несколько дней. С каждым разом будешь понимать больше — мозг продолжает обрабатывать язык.' }
      ]
    },
    {
      id: 6,
      title: 'Practice: Transcribe and analyze',
      type: 'practice',
      difficulty: 'hard',
      description: 'Выполни задания на основе просмотра реального технического доклада.',
      solution: 'Это открытое задание — ответы зависят от выбранного доклада. Проверочные критерии:\n- Правильно определена проблема из введения доклада.\n- Описана структура (intro → problem → solution → demo → conclusion).\n- Записаны минимум 5 технических терминов с переводом.\n- Определён акцент докладчика (американский, британский, индийский и т.д.).\n- Для подкаста: тема идентифицирована, 3 новых слова с контекстуальным переводом.',
      tasks: [
        {
          task: 'Посмотри первые 5 минут любого доклада с Google I/O или JSConf на YouTube.',
          questions: [
            'Какую проблему описывает докладчик во введении?',
            'Какую структуру доклада он обещает?',
            'Запиши 5 технических слов, которые встретились в первых 5 минутах.',
            'С каким акцентом говорит докладчик?'
          ]
        },
        {
          task: 'Послушай 2 минуты технического подкаста (Syntax.fm или The Changelog).',
          questions: [
            'О какой технологии или теме идёт речь?',
            'Запиши 3 неизвестных слова и угадай их значение из контекста.',
            'Насколько быстро говорят ведущие по сравнению с конференционным докладом?'
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Practice: Presentation phrases gap-fill',
      type: 'practice',
      difficulty: 'easy',
      description: 'Заполни пропуски подходящими фразами из доклада.',
      solution: 'Правильные ответы:\n1. "Today I\'m going to talk" (стандартная открывающая фраза)\n2. "let me level set on" (выровнять общее понимание)\n3. "walk you through" (пройти по коду шаг за шагом)\n4. "So, to summarize" (переход к заключению)',
      tasks: [
        {
          incomplete: '"Good morning, everyone. _____ about something that\'s been on my mind for the past year: the future of serverless computing."',
          options: ["Today I'm going to talk", 'Let me summarize', 'Moving on to'],
          correct: 0,
          explanation: '"Today I\'m going to talk about..." — стандартная открывающая фраза конференционного доклада.'
        },
        {
          incomplete: '"Before we go deeper, _____ the problem we\'re solving. Many teams struggle with deployment consistency across environments."',
          options: ['let me zoom in on', 'let me level set on', 'I want to call out'],
          correct: 1,
          explanation: '"Level set" — выровнять общее понимание перед углублением в тему.'
        },
        {
          incomplete: '"That covers the theory. Now let me _____ the code and show you how it works in practice."',
          options: ['walk you through', 'dive into', 'touch on'],
          correct: 0,
          explanation: '"Walk you through the code" — пройти по коду шаг за шагом, показывая каждую часть.'
        },
        {
          incomplete: '"_____, the key takeaway is: don\'t optimize prematurely. Measure first, optimize second."',
          options: ['Moving on', 'So, to summarize', 'Let me walk through'],
          correct: 1,
          explanation: '"So, to summarize..." — стандартная фраза для перехода к заключению.'
        }
      ]
    }
  ]
}
