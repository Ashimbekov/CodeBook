export default {
  id: 27,
  title: 'Аудирование: подкасты и конференции',
  description: 'Стратегии понимания технического английского на слух: подкасты, конференции, accent work',
  lessons: [
    {
      id: 1,
      title: 'Почему понимать на слух сложнее, чем читать',
      type: 'theory',
      content: [
        { type: 'text', value: 'Многие B2+ студенты читают технические тексты без проблем, но теряются, когда слушают носителей. Это нормально и объясняется несколькими факторами.' },
        { type: 'heading', value: 'Почему it\'s harder' },
        { type: 'list', items: [
          'Connected speech: слова сливаются ("gonna", "wanna", "d\'you know", "sort of")',
          'Reduction: "I\'m going to" → "I\'m gonna", "want to" → "wanna"',
          'Stress patterns: новая информация ударная, данная — нет',
          'Regional accents: American vs British vs Australian vs Indian vs Singapore',
          'Fast speech: native speakers talk at 150-180 words per minute',
          'Ellipsis: "You coming?" вместо "Are you coming?"'
        ]},
        { type: 'heading', value: 'Стратегии улучшения' },
        { type: 'text', value: '"Active listening: pause, rewind, shadow what was said."\n"Note-taking: write down key points while listening."\n"Exposure variety: listen to multiple accents."\n"Gradual speed: start at 0.75x speed, work up to 1.25x."' },
        { type: 'tip', value: 'Shadowing — лучший метод улучшения аудирования И произношения одновременно: слушайте предложение, поставьте на паузу, повторите его точно так же — с той же интонацией, темпом и connected speech.' }
      ]
    },
    {
      id: 2,
      title: 'Connected speech: как звучит живой английский',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание феноменов connected speech резко улучшает восприятие на слух.' },
        { type: 'heading', value: 'Linking — соединение слов' },
        { type: 'text', value: 'Consonant + vowel: слова сливаются\n"check it out" → "checki-tout"\n"turned it on" → "turni-ton"\n"set it up" → "seti-tup"' },
        { type: 'heading', value: 'Weak forms — редуцированные слова' },
        { type: 'text', value: '"can" → /kən/ (не /kæn/) в не-ударной позиции\n"have" → /həv/ или /əv/: "should have" → "should\'ve" → /ʃʊdəv/\n"to" → /tə/: "going to" → "gonna" /ˈɡɒnə/\n"for" → /fər/: "wait for it" → "wait f\'rit"\n"and" → /ən/ или /n/: "black and white" → "black\'n white"' },
        { type: 'heading', value: 'Elision — выпадение звуков' },
        { type: 'text', value: '"last night" → "las\' night" (выпадает /t/)\n"next week" → "nex\' week"\n"old friend" → "ol\' friend"\n"don\'t know" → "dunno" /dəˈnəʊ/\n"going to" → "gonna"; "want to" → "wanna"; "have to" → "hafta"' }
      ]
    },
    {
      id: 3,
      title: 'Лучшие подкасты для IT-инженеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Подкасты — идеальный формат для развития аудирования: слушайте по дороге, в спортзале, во время готовки.' },
        { type: 'heading', value: 'Технические подкасты' },
        { type: 'text', value: '"Software Engineering Daily: deep technical interviews, daily new episodes. Good for: system design, distributed systems."\n"The Changelog: open source, developer culture. Good for: broad tech landscape."\n"CoRecursive: deep stories about important software. Good for: history of technology."\n"Staff Eng Podcast: career development for senior engineers."\n"Lenny\'s Podcast: product and engineering in startups."' },
        { type: 'heading', value: 'Стратегия прослушивания подкастов' },
        { type: 'text', value: '"First listen at 1.0x without transcript: focus on gist comprehension."\n"Second listen at 0.75x: note words you didn\'t catch."\n"Third: look up transcript (if available) to fill gaps."\n"Shadow 1-2 sentences that were unclear."' },
        { type: 'tip', value: 'Lex Fridman Podcast — отличный для аудирования технического American English. Длинные, медленно проведённые интервью с ясной дикцией. Хорошая точка входа для тех, кто привык к более медленному темпу.' }
      ]
    },
    {
      id: 4,
      title: 'Конференции: QCon, KubeCon, AWS re:Invent',
      type: 'theory',
      content: [
        { type: 'text', value: 'Смотреть conference talks на YouTube — эффективный способ сочетать техническое обучение с развитием аудирования.' },
        { type: 'heading', value: 'Рекомендуемые конференции на YouTube' },
        { type: 'text', value: '"QCon: practitioner talks from senior engineers at top companies (Google, Netflix, Amazon)."\n"GOTO Conference: practical software development talks."\n"KubeCon + CloudNativeCon: Kubernetes and cloud-native ecosystem."\n"AWS re:Invent: comprehensive AWS and cloud architecture talks."\n"StrangeLoop: cutting-edge programming language and distributed systems talks."' },
        { type: 'heading', value: 'Стратегия просмотра' },
        { type: 'text', value: '"Watch with auto-generated captions first to improve accessibility."\n"Turn off captions on second viewing to test comprehension."\n"Summarise the talk in 3 sentences after watching."\n"Note new vocabulary and phrases from the talk."' },
        { type: 'heading', value: 'Разные акценты' },
        { type: 'text', value: '"American English: rhotic, strong r-sounds"\n"British English: non-rhotic, \'received pronunciation\' in formal contexts"\n"Indian English: clear consonants, different stress patterns"\n"Australian English: rising intonation, distinctive vowels"\n"Singapore English (Singlish): unique rhythm, lah particles in informal speech"' }
      ]
    },
    {
      id: 5,
      title: 'Note-taking во время listening',
      type: 'theory',
      content: [
        { type: 'text', value: 'Активное конспектирование улучшает понимание и запоминание материала.' },
        { type: 'heading', value: 'Cornell Note-taking метод' },
        { type: 'text', value: '"Main column (2/3 страницы): основные идеи и примеры во время слушания."\n"Cue column (1/3 слева): ключевые слова и вопросы — заполняется после."\n"Summary (внизу): краткое резюме 2-3 предложения — сразу после."\n"Review: вернитесь к заметкам в течение 24 часов для закрепления."' },
        { type: 'heading', value: 'Символы и сокращения' },
        { type: 'text', value: '"→ causes / leads to"\n"↑ increases / goes up"\n"↓ decreases / goes down"\n"≈ approximately"\n"∴ therefore"\n"∵ because"\n"w/ with; w/o without; re: regarding"\n"bc because; imo in my opinion; tho though"' },
        { type: 'tip', value: 'Не пытайтесь записать каждое слово — это мешает пониманию. Записывайте ключевые слова, цифры и необычные термины. После — реконструируйте из памяти, опираясь на ключевые слова.' }
      ]
    },
    {
      id: 6,
      title: 'Понимание различных акцентов',
      type: 'theory',
      content: [
        { type: 'text', value: 'В международных командах вы будете работать с коллегами из разных стран. Умение понимать различные акценты — практическая необходимость.' },
        { type: 'heading', value: 'American English особенности' },
        { type: 'text', value: '"Rhotic: \'r\' произносится в конце слов и перед согласными (\'server\', \'parser\')"\n"Flap: /t/ между гласными звучит как /d/: \'better\' → \'bedder\', \'data\' → \'dada\'"\n"Low-back merger: \'cot\' и \'caught\' звучат одинаково"' },
        { type: 'heading', value: 'Indian English особенности' },
        { type: 'text', value: '"Retroflexive consonants: /t/ и /d/ произносятся с языком загнутым назад"\n"Syllable-timed: каждый слог примерно одинаковой длины (в отличие от stress-timed английского)"\n"Stress patterns отличаются: \'INternet\' может звучать как \'inTERnet\'"' },
        { type: 'heading', value: 'Стратегии понимания' },
        { type: 'text', value: '"Ask for clarification without embarrassment: \'Sorry, could you repeat that?\', \'Could you say that again more slowly?\'"\n"Confirm understanding: \'Just to confirm, you\'re saying that...?\'" \n"Context helps: if you miss a word, the surrounding words usually provide enough context."' }
      ]
    },
    {
      id: 7,
      title: 'Практика: listening log',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте план регулярного прослушивания и ведите listening log.',
      requirements: [
        'Составьте недельный план прослушивания (минимум 5 часов в неделю)',
        'Определите 2-3 источника разных типов',
        'Шаблон для listening log: что слушал, новые слова, непонятые фрагменты'
      ],
      hint: 'Реалистичный план: 30-40 минут подкаста в день (дорога/спорт/кухня) + 1-2 conference talk в неделю (с активным заметками).',
      solution: 'WEEKLY LISTENING PLAN:\n\nMon/Wed/Fri: Software Engineering Daily (30 min) during commute\n- Level: intermediate-advanced\n- Goal: technical vocabulary and natural speech patterns\n\nTue/Thu: The Changelog (45 min) at the gym\n- Level: intermediate\n- Goal: developer culture vocabulary and conversational English\n\nWeekend: 1 conference talk from QCon YouTube (45-60 min)\n- Level: advanced\n- Goal: presentation language and technical deep-dives\n\nTOTAL: ~5.5 hours/week\n\nLISTENING LOG TEMPLATE:\nDate: [date]\nSource: [podcast/conference/YouTube]\nTopic: [topic]\nDuration: [time]\nNew vocabulary:\n- [word] = [definition/context]\n- [word] = [definition/context]\nUnderstanding: [1-5 scale]\nUnclear fragments: [what I couldn\'t follow]\nKey takeaway: [one sentence summary]\nWill shadow: [sentence or phrase to practice]',
      explanation: 'Регулярность важнее интенсивности. 30 минут каждый день эффективнее 3.5 часов по выходным. Listening log превращает пассивное прослушивание в активное обучение.'
    }
  ]
}
