export default {
  id: 5,
  title: 'Kanban',
  description: 'Kanban как система управления потоком работы: доска, карточки, WIP-лимиты, метрики, сравнение со Scrum и Scrumban.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Kanban',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Kanban — визуализация потока работы' },
        { type: 'text', value: 'Kanban (в переводе с японского — «вывеска» или «визуальная карточка») — метод управления потоком работы, разработанный компанией Toyota в 1950-х для производственных процессов. В IT его адаптировал Дэвид Андерсон в 2007 году. В отличие от Scrum, Kanban не предписывает роли, церемонии или фиксированные итерации. Он фокусируется на визуализации работы и оптимизации потока.' },
        { type: 'heading', value: 'Основные принципы Kanban' },
        { type: 'list', value: [
          'Визуализируйте поток работы — сделайте все задачи видимыми на доске',
          'Ограничивайте количество незавершённой работы (WIP) — не берите больше, чем можете завершить',
          'Управляйте потоком — следите за скоростью прохождения задач через систему',
          'Сделайте правила явными — каждый должен знать, когда задача переходит из колонки в колонку',
          'Внедряйте циклы обратной связи — регулярно обсуждайте процесс',
          'Улучшайте совместно, экспериментируйте — эволюция, не революция'
        ]},
        { type: 'heading', value: 'Когда использовать Kanban' },
        { type: 'text', value: 'Kanban отлично подходит для команд, где работа приходит непредсказуемо: support-команды, DevOps, команды, обрабатывающие инциденты, или продуктовые команды с постоянным потоком мелких задач. Он также хорош как стартовая точка: можно начать с Kanban и эволюционировать процесс постепенно, не внедряя Scrum «под ключ».' },
        { type: 'tip', value: 'Главное преимущество Kanban перед Scrum — его можно внедрить прямо сейчас, не меняя структуру команды. Просто визуализируйте то, что уже делаете, и начните улучшать. Kanban говорит: «начните с того, что есть».' }
      ]
    },
    {
      id: 2,
      title: 'Kanban-доска',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Структура Kanban-доски' },
        { type: 'text', value: 'Kanban-доска — центральный инструмент метода. Каждая колонка представляет этап работы, каждая карточка — задачу. Задача движется слева направо через все этапы. Доска может быть физической (стикеры на стене) или цифровой (Jira, Trello, Linear, YouTrack).' },
        { type: 'heading', value: 'Типичные колонки' },
        { type: 'code', language: 'text', value: 'Простая доска:          Расширенная доска:\n\nBacklog                 Backlog\n  ↓                       ↓\nIn Progress             Selected (готово к работе)\n  ↓                       ↓\nDone                    In Development\n                          ↓\n                        Code Review\n                          ↓\n                        QA Testing\n                          ↓\n                        Ready to Deploy\n                          ↓\n                        Done' },
        { type: 'heading', value: 'Карточки (Tasks)' },
        { type: 'text', value: 'Каждая карточка на доске содержит информацию о задаче. Хорошая карточка — самодостаточная: любой член команды может взять её и понять, что нужно делать.' },
        { type: 'list', value: [
          'Заголовок — краткое описание задачи',
          'Описание — детали, acceptance criteria',
          'Тип — баг, фича, техдолг, исследование',
          'Приоритет — блокирующий, высокий, средний, низкий',
          'Исполнитель — кто сейчас работает над задачей',
          'Дата создания — когда задача появилась на доске',
          'Метки/теги — компонент системы, эпик, спринт'
        ]},
        { type: 'heading', value: 'Swimlanes (дорожки)' },
        { type: 'text', value: 'Горизонтальные дорожки разделяют доску на категории. Это помогает визуально группировать задачи. Например: по типу (фичи, баги, техдолг), по приоритету (срочные наверху), по команде (если доска общая), по эпику (большие фичи).' },
        { type: 'note', value: 'Доска должна отражать реальный процесс, а не идеальный. Если в вашей команде нет этапа QA — не добавляйте колонку QA. Если code review занимает 3 дня — это видно на доске и это сигнал для улучшения.' }
      ]
    },
    {
      id: 3,
      title: 'WIP-лимиты',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Зачем ограничивать работу в процессе' },
        { type: 'text', value: 'WIP (Work In Progress) лимит — максимальное количество задач, которые могут одновременно находиться в одной колонке. Это самая контринтуитивная, но самая мощная практика Kanban. Наш мозг говорит: «чем больше задач в работе, тем быстрее закончим». Данные говорят обратное: чем меньше параллельных задач, тем быстрее каждая из них завершается.' },
        { type: 'heading', value: 'Почему многозадачность — враг продуктивности' },
        { type: 'text', value: 'Переключение контекста (context switching) между задачами стоит 15-25 минут продуктивного времени. Если разработчик работает над 5 задачами одновременно, он тратит больше времени на переключение, чем на саму работу. Исследования показывают: переход от 1 задачи к 2 снижает продуктивность на 20%, к 5 задачам — на 75%.' },
        { type: 'code', language: 'text', value: 'Пример: 3 задачи по 3 дня каждая\n\nБЕЗ WIP-лимита (все параллельно):\n  День: 1  2  3  4  5  6  7  8  9\n  A:    ▓  .  ▓  .  ▓  .  ▓  .  ▓  → Готово на день 9\n  B:    .  ▓  .  ▓  .  ▓  .  ▓  .  → Готово на день 9\n  C:    .  .  .  .  ▓  .  .  .  ▓  → Готово на день 9\n  Lead Time каждой задачи: 9 дней\n\nС WIP-лимитом = 1 (последовательно):\n  День: 1  2  3  4  5  6  7  8  9\n  A:    ▓  ▓  ▓                     → Готово на день 3!\n  B:             ▓  ▓  ▓            → Готово на день 6\n  C:                      ▓  ▓  ▓   → Готово на день 9\n  Lead Time: 3, 6, 9 дней (среднее 6 дней vs 9)' },
        { type: 'heading', value: 'Как установить WIP-лимиты' },
        { type: 'list', value: [
          'Начните с количества разработчиков + 1 (например, 4 разработчика → WIP = 5)',
          'Если задачи скапливаются в колонке — уменьшите WIP-лимит',
          'Если разработчики простаивают — увеличьте WIP-лимит (но это случается редко)',
          'WIP-лимит — не для отдельного человека, а для всей колонки',
          'Когда колонка достигла WIP-лимита, команда должна сначала завершить текущие задачи, прежде чем брать новые'
        ]},
        { type: 'warning', value: 'Самая частая ошибка: установить WIP-лимит и игнорировать его. «У нас WIP = 3, но сейчас срочно, поэтому возьмём 6». Если вы постоянно нарушаете WIP-лимит, у вас нет WIP-лимита. Дисциплина здесь критична.' }
      ]
    },
    {
      id: 4,
      title: 'Метрики Kanban',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что измерять в Kanban' },
        { type: 'text', value: 'Kanban — метод, основанный на данных. Без метрик вы не знаете, улучшается ли ваш процесс. Три ключевые метрики: Lead Time, Cycle Time и Throughput.' },
        { type: 'heading', value: 'Lead Time' },
        { type: 'text', value: 'Время от момента, когда задача появилась в системе (попала в Backlog), до момента, когда она завершена (перешла в Done). Lead Time включает время ожидания — задача может лежать в Backlog 2 недели, прежде чем кто-то начнёт над ней работать. Это метрика для заказчика: «сколько ждать, пока фича будет готова?».' },
        { type: 'heading', value: 'Cycle Time' },
        { type: 'text', value: 'Время от начала работы над задачей (In Progress) до её завершения (Done). Cycle Time не включает время ожидания в бэклоге. Это метрика для команды: «сколько времени уходит на выполнение задачи?». Cycle Time всегда меньше или равен Lead Time.' },
        { type: 'code', language: 'text', value: 'Пример:\n\n  Задача создана в Backlog: 1 апреля\n  Взята в работу (In Progress): 5 апреля\n  Code Review: 7 апреля\n  QA Testing: 8 апреля\n  Задеплоена (Done): 9 апреля\n\n  Lead Time  = 9 апреля - 1 апреля = 8 дней\n  Cycle Time = 9 апреля - 5 апреля = 4 дня\n  Wait Time  = 5 апреля - 1 апреля = 4 дня (50% — тревожный сигнал!)' },
        { type: 'heading', value: 'Throughput (Пропускная способность)' },
        { type: 'text', value: 'Количество задач, завершённых за единицу времени (обычно за неделю). Например, команда завершает 8 задач в неделю. Throughput помогает прогнозировать: если в бэклоге 40 задач и throughput = 8 задач/неделю, понадобится примерно 5 недель.' },
        { type: 'heading', value: 'Cumulative Flow Diagram (CFD)' },
        { type: 'text', value: 'CFD — график, показывающий количество задач в каждой колонке на каждый день. Если полоса одной колонки расширяется — значит, задачи застревают на этом этапе (bottleneck). Это самый мощный инструмент для обнаружения проблем в потоке.' },
        { type: 'tip', value: 'Начните с простого: запишите дату перехода каждой задачи в каждую колонку. Через месяц у вас будет достаточно данных, чтобы рассчитать средний Lead Time, Cycle Time и Throughput. Эти числа — основа для обсуждений на ретро.' }
      ]
    },
    {
      id: 5,
      title: 'Scrum vs Kanban vs Scrumban',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Три подхода — одна цель' },
        { type: 'text', value: 'Scrum и Kanban — не конкуренты, а инструменты для разных ситуаций. Многие команды используют гибрид — Scrumban, который берёт лучшее из обоих подходов.' },
        { type: 'heading', value: 'Сравнительная таблица' },
        { type: 'code', language: 'text', value: 'Критерий          | Scrum                  | Kanban                 | Scrumban\n-------------------|------------------------|------------------------|------------------\nИтерации           | Фиксированные спринты  | Непрерывный поток      | Спринты + поток\nРоли               | PO, SM, Dev Team       | Не предписывает        | PO, SM (опционально)\nПланирование       | Sprint Planning        | По мере необходимости  | Sprint Planning\nМетрики            | Velocity, Burndown     | Lead Time, Cycle Time  | Обе группы\nИзменения в scope  | Только между спринтами | В любой момент         | Минимизируются\nWIP-лимиты         | Неявные (velocity)     | Явные, строгие         | Явные\nЦеремонии          | 5 обязательных         | Не предписывает        | Выборочные\nДоска              | Обнуляется каждый спринт| Непрерывная           | Непрерывная' },
        { type: 'heading', value: 'Когда что выбирать' },
        { type: 'list', value: [
          'Scrum: команда работает над продуктом с длинным бэклогом фич, нужна предсказуемость, нужны чёткие ритуалы и роли. Пример: продуктовая команда, разрабатывающая новое мобильное приложение.',
          'Kanban: поток задач непредсказуемый, много мелких задач, команда поддержки или DevOps. Пример: support-команда, обрабатывающая баг-репорты от пользователей.',
          'Scrumban: команда уже работает по Scrum, но хочет больше гибкости. Или команда переходит от Kanban к более структурированному процессу. Пример: команда, которая делает фичи по спринтам, но также обрабатывает входящие баги.'
        ]},
        { type: 'heading', value: 'Как работает Scrumban' },
        { type: 'text', value: 'Scrumban берёт из Scrum: итерации (но длиннее — 2-4 недели), Sprint Planning, ретроспективы. Из Kanban: WIP-лимиты, непрерывный поток (не обнуляем доску), Cycle Time как основную метрику. Задачи не обязательно привязаны к спринту — можно брать новые задачи, когда освобождается ёмкость.' },
        { type: 'note', value: 'Не существует «лучшего» подхода. Существует подход, который подходит вашей команде и контексту. Многие успешные команды даже не могут точно сказать, что они используют — «что-то между Scrum и Kanban, адаптированное под нас».' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка Kanban-доски',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вы — тимлид DevOps-команды из 4 человек. Ваша команда обрабатывает инфраструктурные запросы от 5 продуктовых команд, управляет инцидентами и делает плановые улучшения. Настройте Kanban-доску: определите колонки, WIP-лимиты, типы задач. Смоделируйте поток задач и рассчитайте метрики.',
      requirements: [
        'Создайте объект board с колонками (columns) и WIP-лимитами для каждой колонки',
        'Минимум 5 колонок, отражающих реальный процесс DevOps-команды',
        'Создайте массив tasks с 8+ задачами разных типов (incident, request, improvement)',
        'Каждая задача: { id, title, type, priority, column, createdDate, startedDate, completedDate }',
        'Добавьте функцию calculateMetrics(tasks), которая считает Lead Time, Cycle Time, Throughput',
        'Добавьте функцию checkWipLimits(board, tasks), которая проверяет, не превышены ли WIP-лимиты'
      ],
      hint: 'Lead Time = completedDate - createdDate. Cycle Time = completedDate - startedDate. Throughput = количество завершённых задач / количество недель. Для проверки WIP-лимитов подсчитайте задачи в каждой колонке и сравните с лимитом.',
      expectedOutput: 'Kanban-доска DevOps-команды\n\nКолонки:\n  Backlog (без лимита) — 3 задачи\n  Selected (WIP: 3) — 2 задачи [OK]\n  In Progress (WIP: 4) — 3 задачи [OK]\n  Review (WIP: 2) — 1 задача [OK]\n  Done (без лимита) — 4 задачи\n\nМетрики (завершённые задачи):\n  Средний Lead Time: 5.5 дней\n  Средний Cycle Time: 3.3 дня\n  Throughput: 4 задачи за 2 недели (2.0 задач/неделю)\n\nWIP-лимиты: Все в норме',
      solution: `const board = {
  name: 'DevOps Team Board',
  columns: [
    { name: 'Backlog', wipLimit: null },
    { name: 'Selected', wipLimit: 3 },
    { name: 'In Progress', wipLimit: 4 },
    { name: 'Review', wipLimit: 2 },
    { name: 'Done', wipLimit: null }
  ]
};

const tasks = [
  { id: 1, title: 'Настроить мониторинг нового сервиса', type: 'request', priority: 'high', column: 'Done', createdDate: '2026-03-25', startedDate: '2026-03-26', completedDate: '2026-03-28' },
  { id: 2, title: 'Инцидент: падение staging-окружения', type: 'incident', priority: 'critical', column: 'Done', createdDate: '2026-03-27', startedDate: '2026-03-27', completedDate: '2026-03-28' },
  { id: 3, title: 'Обновить Kubernetes до 1.30', type: 'improvement', priority: 'medium', column: 'Done', createdDate: '2026-03-20', startedDate: '2026-03-24', completedDate: '2026-03-28' },
  { id: 4, title: 'Автоматизировать бэкапы БД', type: 'improvement', priority: 'medium', column: 'Done', createdDate: '2026-03-22', startedDate: '2026-03-26', completedDate: '2026-04-01' },
  { id: 5, title: 'Создать CI-пайплайн для нового микросервиса', type: 'request', priority: 'high', column: 'In Progress', createdDate: '2026-03-28', startedDate: '2026-04-01', completedDate: null },
  { id: 6, title: 'Настроить алерты для CPU > 80%', type: 'request', priority: 'medium', column: 'In Progress', createdDate: '2026-03-30', startedDate: '2026-04-02', completedDate: null },
  { id: 7, title: 'Миграция на новый Docker registry', type: 'improvement', priority: 'low', column: 'In Progress', createdDate: '2026-03-29', startedDate: '2026-04-02', completedDate: null },
  { id: 8, title: 'Доступ к prod для новой команды', type: 'request', priority: 'high', column: 'Review', createdDate: '2026-04-01', startedDate: '2026-04-02', completedDate: null },
  { id: 9, title: 'Оптимизировать размер Docker-образов', type: 'improvement', priority: 'low', column: 'Selected', createdDate: '2026-04-01', startedDate: null, completedDate: null },
  { id: 10, title: 'Настроить auto-scaling для API Gateway', type: 'request', priority: 'medium', column: 'Selected', createdDate: '2026-04-02', startedDate: null, completedDate: null },
  { id: 11, title: 'Внедрить GitOps с ArgoCD', type: 'improvement', priority: 'low', column: 'Backlog', createdDate: '2026-04-03', startedDate: null, completedDate: null },
  { id: 12, title: 'Обновить SSL-сертификаты', type: 'request', priority: 'high', column: 'Backlog', createdDate: '2026-04-04', startedDate: null, completedDate: null },
  { id: 13, title: 'Terraform модули для новых окружений', type: 'improvement', priority: 'medium', column: 'Backlog', createdDate: '2026-04-05', startedDate: null, completedDate: null }
];

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function calculateMetrics(tasks) {
  const completed = tasks.filter(t => t.completedDate);

  const leadTimes = completed.map(t => daysBetween(t.createdDate, t.completedDate));
  const cycleTimes = completed.map(t => daysBetween(t.startedDate, t.completedDate));

  const avgLeadTime = (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length).toFixed(1);
  const avgCycleTime = (cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length).toFixed(1);

  const firstDate = new Date(Math.min(...completed.map(t => new Date(t.completedDate))));
  const lastDate = new Date(Math.max(...completed.map(t => new Date(t.completedDate))));
  const weeks = Math.max(1, daysBetween(firstDate, lastDate) / 7);
  const throughput = (completed.length / weeks).toFixed(1);

  return {
    completedCount: completed.length,
    avgLeadTime,
    avgCycleTime,
    throughput,
    weeks: Math.round(weeks)
  };
}

function checkWipLimits(board, tasks) {
  const violations = [];
  board.columns.forEach(col => {
    const count = tasks.filter(t => t.column === col.name).length;
    const status = col.wipLimit === null ? '' : (count > col.wipLimit ? 'ПРЕВЫШЕН!' : 'OK');
    const limitStr = col.wipLimit === null ? 'без лимита' : 'WIP: ' + col.wipLimit;
    violations.push({ column: col.name, count, wipLimit: col.wipLimit, limitStr, status });
  });
  return violations;
}

console.log('Kanban-доска DevOps-команды');
console.log('');
console.log('Колонки:');
const wipStatus = checkWipLimits(board, tasks);
wipStatus.forEach(col => {
  const statusStr = col.status ? ' [' + col.status + ']' : '';
  console.log('  ' + col.column + ' (' + col.limitStr + ') — ' + col.count + ' задачи' + statusStr);
});

const metrics = calculateMetrics(tasks);
console.log('');
console.log('Метрики (завершённые задачи):');
console.log('  Средний Lead Time: ' + metrics.avgLeadTime + ' дней');
console.log('  Средний Cycle Time: ' + metrics.avgCycleTime + ' дня');
console.log('  Throughput: ' + metrics.completedCount + ' задачи за ' + metrics.weeks + ' недели (' + metrics.throughput + ' задач/неделю)');

const hasViolations = wipStatus.some(c => c.status === 'ПРЕВЫШЕН!');
console.log('');
console.log('WIP-лимиты: ' + (hasViolations ? 'Есть нарушения!' : 'Все в норме'));`,
      explanation: 'В этой практике мы настроили реалистичную Kanban-доску для DevOps-команды. Ключевые моменты: 1) колонки отражают реальный процесс, 2) WIP-лимиты устанавливаются исходя из размера команды, 3) метрики считаются автоматически по датам переходов. В реальности эти метрики визуализируются на CFD-диаграмме и обсуждаются на еженедельных обзорах потока. Lead Time и Cycle Time помогают давать прогнозы: «ваш запрос будет выполнен за 4-6 дней».'
    }
  ]
}
