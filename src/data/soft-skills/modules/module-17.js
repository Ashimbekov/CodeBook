export default {
  id: 17,
  title: 'Управление временем',
  description: 'Pomodoro, deep work, context switching, приоритизация задач и защита фокуса.',
  lessons: [
    {
      id: 1,
      title: 'Context Switching — враг продуктивности',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Цена переключения контекста' },
        { type: 'text', value: 'Исследования показывают: после переключения с одной задачи на другую нужно 23 минуты, чтобы вернуться в состояние глубокого фокуса. Если вас отвлекают 5 раз в день — вы теряете почти 2 часа только на «разгон».' },
        { type: 'heading', value: 'Типичные прерывания разработчика' },
        { type: 'list', value: [
          'Slack-сообщения с @mention',
          'Срочный баг от QA (который не всегда срочный)',
          'Вопрос от коллеги «на минутку» (который занимает 20 минут)',
          'Уведомления: email, Jira, GitHub, календарь',
          'Собственная прокрастинация: «Проверю Slack, пока думаю»'
        ]},
        { type: 'heading', value: 'Как измерить потери' },
        { type: 'code', language: 'text', value: 'Эксперимент на 1 неделю:\n\nЗаписывайте каждое переключение контекста:\n- Время прерывания\n- Источник (Slack, коллега, сам)\n- Длительность\n- Было ли необходимо прямо сейчас?\n\nТипичный результат:\nПн: 12 переключений, 8 необязательных\nВт: 15 переключений, 11 необязательных\n...\n\nВывод: 60-70% прерываний можно было отложить на 1-2 часа\nбез потери для команды.' },
        { type: 'tip', value: 'Попробуйте 1 день работать с закрытым Slack (кроме DM от менеджера). Проверяйте Slack каждые 2 часа. Вы удивитесь, как много успеете.' }
      ]
    },
    {
      id: 2,
      title: 'Deep Work: погружённая работа',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Концепция Кэла Ньюпорта' },
        { type: 'text', value: 'Deep Work — это работа в состоянии полного фокуса, без отвлечений, на когнитивно сложной задаче. Для разработчика это: проектирование архитектуры, решение сложного бага, написание алгоритма. Shallow work — email, Slack, встречи, рутина.' },
        { type: 'heading', value: 'Правила Deep Work для разработчика' },
        { type: 'list', value: [
          'Блокируйте время: 2-3 часа утром (или в пиковое время) — sacred time',
          'Отключите уведомления: Slack, email, телефон — на DND',
          'Один таб — одна задача: закройте социальные сети и новости',
          'Предупредите команду: «С 9 до 12 я в deep work, пишите в Slack — отвечу после»',
          'Ритуал начала: заварите кофе, закройте дверь, откройте IDE — мозг привыкнет',
          'Ритуал конца: закройте IDE, запишите прогресс, переключитесь на shallow work'
        ]},
        { type: 'heading', value: 'Расписание дня разработчика' },
        { type: 'code', language: 'text', value: '09:00-09:15  Daily standup\n09:15-12:00  Deep Work (архитектура, сложный код)\n12:00-13:00  Обед\n13:00-14:00  Code review, PR, Slack-ответы (shallow)\n14:00-16:00  Deep Work (реализация, тесты)\n16:00-17:00  Встречи, 1-on-1, документация (shallow)\n17:00-17:30  Wrap-up: записать прогресс, план на завтра' },
        { type: 'note', value: 'Даже 2 часа deep work в день = 10 часов в неделю глубокого фокуса. Это больше, чем у большинства разработчиков, у которых весь день раздроблен встречами.' }
      ]
    },
    {
      id: 3,
      title: 'Техника Pomodoro',
      type: 'theory',
      content: [
        { type: 'heading', value: '25 минут фокуса + 5 минут отдыха' },
        { type: 'text', value: 'Pomodoro — простая техника: работаете 25 минут без отвлечений, затем 5 минут отдыха. После 4 циклов — длинный перерыв 15-30 минут. Для разработчиков часто лучше работают 50/10 или 90/15 интервалы — 25 минут мало для «входа в зону».' },
        { type: 'heading', value: 'Адаптация Pomodoro для разработчиков' },
        { type: 'list', value: [
          'Классический: 25/5 — для рутинных задач (email, ревью, документация)',
          'Extended: 50/10 — для средних задач (реализация фичи, тесты)',
          'Deep: 90/15 — для сложных задач (архитектура, сложный баг)',
          'Flexible: работайте до «естественной паузы» (завершили функцию, достигли commit point)'
        ]},
        { type: 'heading', value: 'Что делать во время перерыва' },
        { type: 'list', value: [
          'Встаньте и пройдитесь (не скролльте телефон!)',
          'Посмотрите в окно — глазам нужен отдых от экрана',
          'Налейте воды или чай',
          'Сделайте 5 простых упражнений (растяжка шеи, плеч)',
          'НЕ проверяйте Slack/email — это отдых, не shallow work'
        ]},
        { type: 'tip', value: 'Приложения: Focus To-Do, Forest, Pomofocus.io. Но простой таймер на телефоне тоже работает.' }
      ]
    },
    {
      id: 4,
      title: 'Приоритизация задач: матрица Эйзенхауэра',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Важное vs Срочное' },
        { type: 'text', value: 'Разработчики часто путают «срочное» и «важное». Баг в production — срочный И важный. Рефакторинг — важный, но НЕ срочный. Ответ в Slack — срочный (кажется), но НЕ важный. Понимание разницы — ключ к продуктивности.' },
        { type: 'heading', value: 'Матрица Эйзенхауэра' },
        { type: 'code', language: 'text', value: '                 Срочно              Не срочно\n              ┌──────────────────┬──────────────────┐\n  Важно      │ 🔴 ДЕЛАЙ СЕЙЧАС  │ 🟢 ПЛАНИРУЙ      │\n             │ Production баг    │ Рефакторинг      │\n             │ Security incident │ Тесты            │\n             │ Дедлайн сегодня   │ Обучение         │\n             ├──────────────────┼──────────────────┤\n  Неважно    │ 🟡 ДЕЛЕГИРУЙ     │ ⚪ УДАЛИ          │\n             │ Slack-вопросы     │ Бесполезные встречи│\n             │ Мелкие запросы    │ Scroll соцсетей  │\n             │ Email рассылки    │ Оптимизация ОК кода│\n             └──────────────────┴──────────────────┘' },
        { type: 'heading', value: 'Ловушка: жить в квадранте «Срочно + Неважно»' },
        { type: 'text', value: 'Если весь день — это ответы в Slack, мелкие запросы и тушение пожаров — вы застряли в квадранте «срочно, но неважно». Важные вещи (архитектура, тесты, обучение) откладываются «на потом», которое никогда не наступает.' },
        { type: 'note', value: 'Каждое утро определяйте 1-3 задачи из квадранта «Важно, но не срочно» и делайте их ПЕРВЫМИ, до Slack и email.' }
      ]
    },
    {
      id: 5,
      title: 'Защита своего времени',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Научитесь говорить «нет»' },
        { type: 'text', value: 'Каждое «да» — это «нет» чему-то другому. Когда вы соглашаетесь на внеплановую встречу — вы отказываете своей задаче в deep work. Умение вежливо, но твёрдо защищать своё время — критический soft skill.' },
        { type: 'heading', value: 'Как говорить «нет» профессионально' },
        { type: 'list', value: [
          '«Сейчас в deep work — могу посмотреть после 14:00»',
          '«Это важно, но у меня дедлайн по X. Можем обсудить завтра?»',
          '«Давай запишем в задачу и приоритизируем на планировании»',
          '«Я не эксперт в этом — Мария знает лучше, спроси её»',
          '«Могу помочь, но мне нужно 30 минут. Подождёшь?»'
        ]},
        { type: 'heading', value: 'Тактики защиты фокуса' },
        { type: 'list', value: [
          'Calendar blocking: забронируйте 2-3 часа deep work в календаре',
          'Slack status: «В фокусе до 12:00, отвечу позже»',
          'Наушники: универсальный сигнал «не отвлекайте» в офисе',
          'Batch processing: проверяйте Slack/email 2-3 раза в день, не постоянно',
          'No-meeting day: договоритесь с командой о дне без встреч'
        ]},
        { type: 'tip', value: 'Попробуйте правило «2-минутное правило»: если задача займёт менее 2 минут — сделайте сразу. Если больше — запишите и сделайте в запланированное время.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: спланируйте идеальную рабочую неделю',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спроектируйте расписание рабочей недели с балансом deep work, shallow work, встреч и перерывов.',
      requirements: [
        'Распланируйте 5 рабочих дней по часам',
        'Выделите минимум 3 часа deep work каждый день',
        'Учтите обязательные встречи (standup, planning, retro)',
        'Добавьте блоки для shallow work (Slack, email, code review)',
        'Посчитайте: сколько часов deep work vs shallow work в неделю'
      ],
      hint: 'Поставьте deep work на утро (когнитивный пик для большинства людей). Встречи — на после обеда. Slack — блоками, не постоянно.',
      expectedOutput: 'Расписание на 5 дней\nDeep work: 15+ часов/неделю\nShallow work: 10-15 часов/неделю\nВстречи: 5-8 часов/неделю',
      solution: `const weekSchedule = {
  monday: {
    '09:00-09:15': { type: 'meeting', desc: 'Daily standup' },
    '09:15-12:00': { type: 'deep', desc: 'Deep work: основная задача спринта' },
    '12:00-13:00': { type: 'break', desc: 'Обед' },
    '13:00-14:00': { type: 'shallow', desc: 'Code review, PR, Slack' },
    '14:00-16:00': { type: 'deep', desc: 'Deep work: продолжение задачи' },
    '16:00-17:00': { type: 'shallow', desc: 'Документация, email, wrap-up' }
  },
  tuesday: {
    '09:00-09:15': { type: 'meeting', desc: 'Daily standup' },
    '09:15-12:00': { type: 'deep', desc: 'Deep work: сложная задача' },
    '12:00-13:00': { type: 'break', desc: 'Обед' },
    '13:00-14:00': { type: 'shallow', desc: 'Code review, Slack' },
    '14:00-15:00': { type: 'meeting', desc: 'Backlog Grooming' },
    '15:00-17:00': { type: 'deep', desc: 'Deep work: тесты / рефакторинг' }
  },
  wednesday: {
    '09:00-09:15': { type: 'meeting', desc: 'Daily standup' },
    '09:15-12:00': { type: 'deep', desc: 'Deep work: No-meeting morning' },
    '12:00-13:00': { type: 'break', desc: 'Обед' },
    '13:00-15:00': { type: 'deep', desc: 'Deep work: архитектура / spike' },
    '15:00-16:00': { type: 'shallow', desc: 'Code review, mentoring' },
    '16:00-17:00': { type: 'shallow', desc: 'Slack, email, техдолг' }
  },
  thursday: {
    '09:00-09:15': { type: 'meeting', desc: 'Daily standup' },
    '09:15-12:00': { type: 'deep', desc: 'Deep work: основная задача' },
    '12:00-13:00': { type: 'break', desc: 'Обед' },
    '13:00-14:00': { type: 'shallow', desc: 'Code review, PR' },
    '14:00-15:00': { type: 'meeting', desc: '1-on-1 с менеджером' },
    '15:00-17:00': { type: 'deep', desc: 'Deep work: завершение задач' }
  },
  friday: {
    '09:00-09:15': { type: 'meeting', desc: 'Daily standup' },
    '09:15-11:00': { type: 'deep', desc: 'Deep work: закрытие задач спринта' },
    '11:00-12:00': { type: 'shallow', desc: 'Code review финальный' },
    '12:00-13:00': { type: 'break', desc: 'Обед' },
    '13:00-14:00': { type: 'meeting', desc: 'Sprint Review / Demo (раз в 2 недели)' },
    '14:00-15:00': { type: 'meeting', desc: 'Retrospective (раз в 2 недели)' },
    '15:00-16:00': { type: 'shallow', desc: 'Обучение, статьи, tech talks' },
    '16:00-17:00': { type: 'shallow', desc: 'Wrap-up, план на следующую неделю' }
  }
};

// Подсчёт
let deepHours = 0, shallowHours = 0, meetingHours = 0;
Object.values(weekSchedule).forEach(day => {
  Object.entries(day).forEach(([time, slot]) => {
    const [start, end] = time.split('-').map(t => {
      const [h, m] = t.split(':').map(Number);
      return h + m / 60;
    });
    const hours = end - start;
    if (slot.type === 'deep') deepHours += hours;
    else if (slot.type === 'shallow') shallowHours += hours;
    else if (slot.type === 'meeting') meetingHours += hours;
  });
});

console.log('=== Расписание недели ===');
Object.entries(weekSchedule).forEach(([day, slots]) => {
  console.log(\`\\n\${day.toUpperCase()}:\`);
  Object.entries(slots).forEach(([time, slot]) => {
    const icon = slot.type === 'deep' ? '🔵' : slot.type === 'meeting' ? '🔴' : slot.type === 'shallow' ? '🟡' : '⚪';
    console.log(\`  \${icon} \${time} \${slot.desc}\`);
  });
});

console.log(\`\\n=== Итоги ===\`);
console.log(\`Deep work: \${deepHours} часов/неделю\`);
console.log(\`Shallow work: \${shallowHours} часов/неделю\`);
console.log(\`Встречи: \${meetingHours} часов/неделю\`);
console.log(\`Баланс: \${Math.round(deepHours / (deepHours + shallowHours + meetingHours) * 100)}% deep work\`);`,
      explanation: 'Идеальное расписание — это не жёсткий план, а ориентир. Ключевые принципы: 1) Deep work утром, когда мозг свежий. 2) Встречи сгруппированы, а не разбросаны. 3) Slack/email — блоками 2-3 раза в день. 4) Минимум 50% рабочего времени — deep work. 5) Пятница — обучение и wrap-up.'
    }
  ]
}
