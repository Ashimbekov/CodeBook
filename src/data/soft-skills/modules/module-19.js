export default {
  id: 19,
  title: 'Удалённая работа',
  description: 'Remote culture, асинхронная коммуникация, инструменты, часовые пояса и продуктивность на удалёнке.',
  lessons: [
    {
      id: 1,
      title: 'Принципы удалённой работы',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Remote-first vs Remote-friendly' },
        { type: 'text', value: 'Remote-friendly — это офисная компания, которая «разрешает» работать из дома. Remote-first — компания, где все процессы построены для удалёнки. В remote-friendly удалённые сотрудники — «второй сорт». В remote-first — все равны, независимо от расположения.' },
        { type: 'heading', value: 'Ключевые принципы remote-first' },
        { type: 'list', value: [
          'Async by default: все обсуждения начинаются в письменном виде, звонок — по необходимости',
          'Documentation over conversation: если не записано — не существует',
          'Trust over surveillance: оценивайте результат, а не часы онлайн',
          'Explicit communication: тон и контекст в тексте важнее, чем при живом общении',
          'Over-communicate: лучше сказать лишнее, чем промолчать'
        ]},
        { type: 'tip', value: 'Правило: если на встрече есть хоть один удалённый участник — все подключаются по видео со своих ноутбуков, даже те, кто в офисе. Это уравнивает условия.' }
      ]
    },
    {
      id: 2,
      title: 'Асинхронная коммуникация',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Async — суперсила удалённых команд' },
        { type: 'text', value: 'В распределённой команде синхронная коммуникация — роскошь. Когда ваш коллега спит (другой часовой пояс), вы не можете «зайти и спросить». Async-коммуникация позволяет работать без блокировки.' },
        { type: 'heading', value: 'Правила async-сообщений' },
        { type: 'list', value: [
          'Дайте контекст: не «посмотри», а «посмотри PR #456 — нужен approve для релиза завтра»',
          'Укажите дедлайн: «Нужен ответ до 15:00 UTC» вместо «когда сможешь»',
          'Предложите варианты: не «как делать?», а «варианты: A, B, C — что выбираем?»',
          'Не ожидайте мгновенного ответа: SLA для Slack — 4 часа (не 4 минуты)',
          'Используйте threads: не засоряйте общий канал обсуждениями'
        ]},
        { type: 'heading', value: 'Async-альтернативы встречам' },
        { type: 'code', language: 'text', value: 'Вместо встречи            Async-альтернатива\n──────────────────────────────────────────────\nСтатусный созвон    →  Ежедневный пост в Slack (#standup)\nBrainstorm          →  Google Doc + комментарии за 2 дня\nСпринт-демо         →  Loom-видео (5 мин) + комментарии\nCode review обсуждение → Комментарии в PR + async-голосовое\n1-on-1              →  Sync, не заменяемо (оставьте как есть)' },
        { type: 'note', value: 'Не всё можно сделать async. Конфликты, чувствительная обратная связь и brainstorm лучше работают синхронно. Ключевое — осознанный выбор.' }
      ]
    },
    {
      id: 3,
      title: 'Работа с часовыми поясами',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Overlap hours — время для синхронного общения' },
        { type: 'text', value: 'В распределённой команде (Москва, Берлин, Нью-Йорк) нужно найти «overlap hours» — окно, когда все онлайн. Обычно это 2-4 часа. Все синхронные встречи — в это окно. Всё остальное — async.' },
        { type: 'heading', value: 'Пример: команда в 3 часовых поясах' },
        { type: 'code', language: 'text', value: 'Часовые пояса:\nМосква:    UTC+3   (рабочий день: 10:00-19:00)\nБерлин:    UTC+1   (рабочий день: 09:00-18:00)\nНью-Йорк:  UTC-4   (рабочий день: 09:00-18:00)\n\nOverlap (все онлайн):\n  16:00-19:00 MSK = 14:00-17:00 CET = 09:00-12:00 EST\n\nПравила:\n- Daily standup: 16:30 MSK (14:30 CET, 09:30 EST)\n- Sprint Planning: 17:00 MSK (15:00 CET, 10:00 EST)\n- Async: всё остальное\n- Дежурство: ротация по поясам' },
        { type: 'heading', value: 'Инструменты для часовых поясов' },
        { type: 'list', value: [
          'World Time Buddy — визуальное сравнение часовых поясов',
          'Slack status: укажите свой часовой пояс и рабочие часы',
          'Google Calendar: несколько часовых поясов на одном экране',
          'Every Time Zone — красивый визуализатор overlap'
        ]},
        { type: 'tip', value: 'Всегда указывайте часовой пояс при назначении времени: «Встреча в 15:00 UTC» вместо «в 3 часа». UTC — универсальный язык.' }
      ]
    },
    {
      id: 4,
      title: 'Инструменты удалённой работы',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Стек инструментов для remote-команды' },
        { type: 'list', value: [
          'Коммуникация: Slack / Microsoft Teams (async чаты + huddles)',
          'Видеозвонки: Zoom / Google Meet / Around (для quick calls)',
          'Управление задачами: Jira / Linear / Notion',
          'Документация: Notion / Confluence / Google Docs',
          'Код: GitHub / GitLab (PR, code review)',
          'Дизайн: Figma (collaborative design)',
          'Whiteboarding: Miro / Excalidraw / FigJam',
          'Видео-сообщения: Loom (async видео вместо звонков)'
        ]},
        { type: 'heading', value: 'Loom — async-видео для разработчиков' },
        { type: 'text', value: 'Loom позволяет записать короткое видео (экран + камера) и отправить ссылку. Идеально для: демо фичи (вместо созвона), объяснения бага (показать экран), code review walkthrough (показать код с комментариями).' },
        { type: 'heading', value: 'Рабочее место для удалёнки' },
        { type: 'list', value: [
          'Отдельное рабочее место (не диван!): стол, стул, монитор',
          'Хорошая камера и микрофон — инвестиция в коммуникацию',
          'Стабильный интернет (backup: мобильный hotspot)',
          'Шумоподавляющие наушники — для open space и кафе',
          'Хорошее освещение — лицо, а не силуэт на камере'
        ]},
        { type: 'note', value: 'Многие компании компенсируют оборудование для удалёнки. Спросите HR — возможно, вам положена компенсация на стол, стул и монитор.' }
      ]
    },
    {
      id: 5,
      title: 'Поддержание связи с командой',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Социальная изоляция — главный риск удалёнки' },
        { type: 'text', value: 'На удалёнке исчезают случайные разговоры у кофемашины. А именно они создают доверие, понимание контекста и чувство принадлежности. Нужно осознанно воссоздавать социальные связи.' },
        { type: 'heading', value: 'Практики для team bonding' },
        { type: 'list', value: [
          'Virtual coffee: случайная пара коллег общается 15 минут (Donut bot в Slack)',
          'Water cooler channel: #random канал для нерабочих обсуждений',
          'Начало встречи: 5 минут small talk перед бизнесом',
          'Online games: раз в месяц командная игра (Codenames, Among Us)',
          'Show & Tell: еженедельная сессия «покажи что интересного нашёл»',
          'Team offsites: встречи в реальности 1-2 раза в год (очень важно!)'
        ]},
        { type: 'heading', value: 'Видимость на удалёнке' },
        { type: 'text', value: 'На удалёнке легко стать «невидимым». Если вы не пишете в Slack, не выступаете на встречах — о вас забывают. Это влияет на повышение и оценку. Осознанно делайте свою работу видимой: делитесь прогрессом, выступайте на демо, помогайте в публичных каналах.' },
        { type: 'tip', value: 'Раз в неделю отправляйте менеджеру краткий update: что сделали, что планируете, есть ли блокеры. 5 предложений достаточно.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: настройте remote-процесс для команды',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте набор правил и процессов для удалённой команды из 6 человек в 3 часовых поясах.',
      requirements: [
        'Определите overlap hours для 3 часовых поясов',
        'Составьте расписание обязательных sync-встреч',
        'Определите SLA для ответов в разных каналах',
        'Создайте набор правил async-коммуникации (team agreement)',
        'Предложите 3 практики для team bonding'
      ],
      hint: 'Начните с определения overlap hours, затем расположите все sync-встречи внутри этого окна.',
      expectedOutput: 'Overlap: 3 часа (15:00-18:00 UTC)\nМетинги: 4 обязательных в неделю\nSLA: Slack 4ч, PR review 24ч\nTeam agreement: 8 правил\nBonding: 3 практики',
      solution: `const remotePolicy = {
  team: {
    size: 6,
    timezones: [
      { city: 'Алматы', utc: 'UTC+5', workHours: '09:00-18:00' },
      { city: 'Москва', utc: 'UTC+3', workHours: '09:00-18:00' },
      { city: 'Лиссабон', utc: 'UTC+0', workHours: '09:00-18:00' }
    ]
  },

  overlapHours: {
    window: '12:00-15:00 UTC (17:00-20:00 Алматы, 15:00-18:00 Москва, 12:00-15:00 Лиссабон)',
    note: '3 часа overlap — все sync-встречи в этом окне'
  },

  syncMeetings: [
    { name: 'Daily Standup', time: '12:15 UTC', duration: '15 мин', frequency: 'Ежедневно' },
    { name: 'Sprint Planning', time: '12:30 UTC', duration: '1.5 часа', frequency: 'Раз в 2 недели' },
    { name: 'Retro', time: '13:00 UTC', duration: '1 час', frequency: 'Раз в 2 недели' },
    { name: '1-on-1 с менеджером', time: 'Индивидуально', duration: '30 мин', frequency: 'Еженедельно' }
  ],

  sla: {
    'Slack (general)': '4 рабочих часа',
    'Slack (direct message)': '2 рабочих часа',
    'Slack (@here/@channel)': '1 рабочий час',
    'PR review': '24 рабочих часа',
    'Incident (PagerDuty)': '15 минут',
    'Email': '24 часа (не срочное)',
  },

  teamAgreement: [
    'Все обсуждения начинаются в Slack/документе, созвон — если async не работает',
    'Результат каждого созвона записывается в Slack-тред или Notion',
    'PR description обязательно содержит: что, зачем, как тестировать',
    'Время указывается с часовым поясом (UTC)',
    'Статус в Slack: рабочие часы, DND, отпуск',
    'Daily standup: async-пост в #standup до 12:00 UTC (или sync-звонок)',
    'Камеры включены на всех встречах (если возможно)',
    'Пятница после 14:00 UTC — no-meeting time'
  ],

  bonding: [
    { practice: 'Virtual Coffee (Donut bot)', frequency: 'Еженедельно', description: 'Случайные пары для 15-минутного нерабочего разговора' },
    { practice: 'Show & Tell', frequency: 'Раз в 2 недели', description: 'Каждый показывает интересный инструмент, статью или побочный проект' },
    { practice: 'Online Game Night', frequency: 'Ежемесячно', description: 'Codenames, Gartic Phone или другие онлайн-игры' }
  ]
};

console.log('=== Remote Policy ===');
console.log('Overlap: ' + remotePolicy.overlapHours.window);

console.log('\\n=== Sync-встречи ===');
remotePolicy.syncMeetings.forEach(m => {
  console.log(\`\${m.name}: \${m.time}, \${m.duration} (\${m.frequency})\`);
});

console.log('\\n=== SLA ===');
Object.entries(remotePolicy.sla).forEach(([channel, sla]) => {
  console.log(\`\${channel}: \${sla}\`);
});

console.log('\\n=== Team Agreement ===');
remotePolicy.teamAgreement.forEach((r, i) => console.log(\`\${i + 1}. \${r}\`));

console.log('\\n=== Bonding ===');
remotePolicy.bonding.forEach(b => console.log(\`\${b.practice} (\${b.frequency}): \${b.description}\`));`,
      explanation: 'Remote-first процесс строится на трёх столпах: 1) Async by default — sync только когда async не работает. 2) Explicit communication — пишите больше, чем кажется нужным. 3) Intentional bonding — социальные связи не возникают сами, их нужно создавать. Overlap hours — святое время, которое нельзя занимать deep work.'
    }
  ]
}
