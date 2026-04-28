export default {
  id: 8,
  title: 'Kanban для разработчиков',
  description: 'WIP limits, flow-метрики, визуализация работы, continuous delivery и отличия от Scrum.',
  lessons: [
    {
      id: 1,
      title: 'Kanban vs Scrum: когда что использовать',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Два подхода к организации работы' },
        { type: 'text', value: 'Scrum работает итерациями (спринтами) с фиксированным scope. Kanban работает потоком — задачи поступают и завершаются непрерывно. Ни один подход не «лучше» — они подходят для разных контекстов.' },
        { type: 'heading', value: 'Когда использовать Scrum' },
        { type: 'list', value: [
          'Разработка нового продукта с чёткими итерациями',
          'Команда, которой нужна структура и предсказуемость',
          'Проект с фиксированными релизами',
          'Команда, которая учится работать вместе'
        ]},
        { type: 'heading', value: 'Когда использовать Kanban' },
        { type: 'list', value: [
          'Support-команда: задачи приходят непрерывно, нельзя планировать спринты',
          'DevOps/SRE: инциденты не ждут конца спринта',
          'Зрелая команда, которой не нужна жёсткая структура',
          'Continuous delivery: частые мелкие релизы',
          'Проект в фазе поддержки (багфиксы + мелкие улучшения)'
        ]},
        { type: 'note', value: 'Многие команды используют гибрид — «Scrumban»: спринты из Scrum + WIP limits из Kanban. Это нормально — берите лучшее из обоих подходов.' }
      ]
    },
    {
      id: 2,
      title: 'Kanban-доска и визуализация потока',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Визуализация — ключевой принцип Kanban' },
        { type: 'text', value: 'Kanban-доска делает работу видимой. Когда задачи «в голове» — невозможно понять загрузку команды. Когда они на доске — сразу видно бутылочные горлышки, перегрузку и простои.' },
        { type: 'heading', value: 'Типичная Kanban-доска для разработки' },
        { type: 'code', language: 'text', value: '┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐\n│ Backlog  │ To Do    │ In Dev   │ In Review│ Testing  │ Done     │\n│          │ (WIP: 3) │ (WIP: 4) │ (WIP: 3) │ (WIP: 2) │          │\n├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤\n│ ░░░░░░░░ │ [TASK-5] │ [TASK-3] │ [TASK-1] │ [TASK-0] │ [TASK-A] │\n│ ░░░░░░░░ │ [TASK-6] │ [TASK-4] │ [TASK-2] │          │ [TASK-B] │\n│ ░░░░░░░░ │          │          │          │          │ [TASK-C] │\n└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘' },
        { type: 'heading', value: 'Принципы хорошей доски' },
        { type: 'list', value: [
          'Каждая колонка = этап работы (не статус в Jira, а реальный этап)',
          'Карточка содержит: название, исполнитель, дата начала, приоритет',
          'Движение только слева направо (нет возвратов «в работу»)',
          'Блокированные задачи помечены (красный флаг)',
          'Swimlanes для разных типов работ (фичи, баги, техдолг)'
        ]},
        { type: 'tip', value: 'Попробуйте физическую доску со стикерами, даже если вы удалённая команда. Фотографируйте и обновляйте. Физическое перемещение стикера создаёт ощущение прогресса.' }
      ]
    },
    {
      id: 3,
      title: 'WIP Limits: меньше значит быстрее',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Закон Литтла и WIP Limits' },
        { type: 'text', value: 'WIP (Work In Progress) limit — это максимальное количество задач, которые могут одновременно находиться в одной колонке. Это самый контр-интуитивный, но и самый мощный принцип Kanban: ограничивая параллельную работу, вы ускоряете поставку.' },
        { type: 'heading', value: 'Почему это работает' },
        { type: 'text', value: 'Представьте: разработчик берёт 5 задач одновременно. Он тратит время на переключение контекста, ни одна задача не завершается быстро, и в конце недели у него 5 задач «почти готовых» вместо 3 завершённых. WIP limit = 2 заставляет завершить текущее, прежде чем начинать новое.' },
        { type: 'heading', value: 'Как определить WIP limit' },
        { type: 'list', value: [
          'Правило: WIP limit = количество людей в колонке × 1.5',
          'Для In Dev (4 разработчика): WIP = 4-6',
          'Для Code Review (2 ревьюера): WIP = 2-3',
          'Для Testing (1 QA): WIP = 1-2',
          'Начните с WIP = количество людей. Если поток идёт — уменьшите. Если простои — увеличьте'
        ]},
        { type: 'heading', value: 'Что делать, когда WIP limit достигнут' },
        { type: 'code', language: 'text', value: 'Ситуация: In Review колонка заполнена (3/3), разработчик завершил\nзадачу и хочет перевести в Review.\n\n❌ Неправильно: превысить WIP limit ("одна лишняя — не страшно")\n❌ Неправильно: начать новую задачу из To Do\n\n✅ Правильно: помочь разгрузить Review колонку!\n   - Посмотреть, есть ли PR который ты можешь ревьюить\n   - Помочь коллеге с тестированием\n   - Улучшить документацию\n   - Закрыть технический долг\n\nWIP limit — это сигнал: "Не начинай новое, помоги закончить текущее"' },
        { type: 'note', value: 'WIP limits будут вызывать дискомфорт. Это нормально — значит, они работают! Дискомфорт заставляет команду решать реальные проблемы потока.' }
      ]
    },
    {
      id: 4,
      title: 'Flow-метрики: Lead Time, Cycle Time, Throughput',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Измеряем эффективность потока' },
        { type: 'text', value: 'В Scrum основная метрика — velocity (SP за спринт). В Kanban — flow-метрики, которые показывают, насколько быстро и предсказуемо задачи проходят через систему.' },
        { type: 'heading', value: 'Три ключевые метрики' },
        { type: 'list', value: [
          'Lead Time — время от появления задачи в Backlog до Done. Включает ожидание. Важно для заказчика.',
          'Cycle Time — время от начала работы (In Dev) до Done. Не включает ожидание. Важно для команды.',
          'Throughput — количество задач, завершённых за период. Аналог velocity.'
        ]},
        { type: 'code', language: 'text', value: 'Пример:\n\nЗадача TASK-42:\n  Создана в Backlog:    1 апреля (пн)\n  Взята в работу:       3 апреля (ср)     ← ожидание: 2 дня\n  Code Review:          4 апреля (чт)\n  Testing:              5 апреля (пт)      ← ожидание ревью: 0.5 дня\n  Done:                 5 апреля (пт)\n\n  Lead Time:  5 дней (1 апр → 5 апр)\n  Cycle Time: 3 дня  (3 апр → 5 апр)\n\nЕсли Lead Time >> Cycle Time — проблема в ожидании,\nне в скорости работы. Нужно уменьшить очередь (Backlog → To Do).' },
        { type: 'tip', value: 'Отслеживайте Cycle Time еженедельно. Если он растёт — ищите бутылочное горлышко. Обычно это Code Review или Testing.' }
      ]
    },
    {
      id: 5,
      title: 'Continuous Delivery и частые релизы',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Kanban + Continuous Delivery = идеальная пара' },
        { type: 'text', value: 'В Scrum релиз привязан к концу спринта. В Kanban — задача релизится, как только она готова. Это требует зрелого CI/CD pipeline и культуры feature flags, но даёт колоссальное преимущество: пользователи получают ценность быстрее.' },
        { type: 'heading', value: 'Предпосылки для continuous delivery' },
        { type: 'list', value: [
          'Автоматические тесты с высоким покрытием (> 80%)',
          'CI/CD pipeline: commit → build → test → deploy (автоматически)',
          'Feature flags: неготовые фичи скрыты за флагом',
          'Monitoring: быстрое обнаружение проблем в production',
          'Rollback: возможность откатить за минуты, не часы',
          'Маленькие изменения: каждый PR — маленький, безопасный шаг'
        ]},
        { type: 'heading', value: 'Feature flags в действии' },
        { type: 'code', language: 'javascript', value: '// Feature flag позволяет деплоить неготовую фичу\n// без риска для пользователей\n\nfunction renderDashboard(user) {\n  const features = getFeatureFlags(user);\n\n  return {\n    widgets: [\n      renderSalesWidget(),\n      renderOrdersWidget(),\n      // Новый виджет аналитики — пока только для бета-тестеров\n      features.isEnabled(\'analytics-widget\')\n        ? renderAnalyticsWidget()\n        : null,\n    ].filter(Boolean)\n  };\n}\n\n// Включить для 10% пользователей:\n// featureFlags.enable(\'analytics-widget\', { percentage: 10 });\n\n// Включить для всех:\n// featureFlags.enable(\'analytics-widget\', { percentage: 100 });' },
        { type: 'note', value: 'Continuous delivery — это не только техническая практика, но и культурная. Команда должна быть комфортна с маленькими, частыми деплоями вместо больших, редких релизов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: спроектируйте Kanban-доску',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте Kanban-доску для вашей команды: определите колонки, WIP limits, swimlanes и политики перехода между колонками.',
      requirements: [
        'Определите 5-7 колонок для Kanban-доски',
        'Установите WIP limits для каждой колонки',
        'Создайте swimlanes для разных типов работ',
        'Опишите политику перехода задач между колонками (Definition of Done для каждого перехода)',
        'Определите метрики, которые будете отслеживать'
      ],
      hint: 'Учтите специфику команды: сколько разработчиков, есть ли QA, как проводится ревью. WIP limits зависят от размера команды.',
      expectedOutput: 'Kanban-доска: 6 колонок с WIP limits\nSwimлanes: 3 типа работ\nПолитики перехода: 5 правил\nМетрики: 4 ключевые метрики',
      solution: `// Контекст: команда из 4 разработчиков, 1 QA, 1 тимлид
const team = { developers: 4, qa: 1, lead: 1 };

const kanbanBoard = {
  columns: [
    { name: 'Backlog', wipLimit: null, description: 'Все задачи, приоритизированные Product Owner' },
    { name: 'Ready', wipLimit: 5, description: 'Уточнённые задачи, готовые к работе' },
    { name: 'In Development', wipLimit: 6, description: 'Задачи в активной разработке' },
    { name: 'Code Review', wipLimit: 4, description: 'PR создан, ожидает ревью' },
    { name: 'Testing', wipLimit: 3, description: 'Код на staging, QA тестирует' },
    { name: 'Done', wipLimit: null, description: 'Задеплоено в production' }
  ],
  swimlanes: [
    { name: 'Expedite', color: 'red', description: 'Критические баги production. WIP = 1. Приоритет над всем.' },
    { name: 'Features', color: 'blue', description: 'Новая функциональность. Основной поток.' },
    { name: 'Tech Debt', color: 'yellow', description: 'Рефакторинг и улучшения. Минимум 20% capacity.' }
  ],
  transitionPolicies: [
    {
      from: 'Backlog',
      to: 'Ready',
      rules: [
        'Acceptance criteria определены',
        'Задача оценена (story points)',
        'Зависимости проверены',
        'Дизайн/макеты приложены (если UI)'
      ]
    },
    {
      from: 'Ready',
      to: 'In Development',
      rules: [
        'Разработчик назначен',
        'WIP limit не превышен',
        'Branch создан от актуального main'
      ]
    },
    {
      from: 'In Development',
      to: 'Code Review',
      rules: [
        'PR создан с описанием и скриншотами',
        'Все тесты проходят в CI',
        'Self-review проведён',
        'Линтер без ошибок'
      ]
    },
    {
      from: 'Code Review',
      to: 'Testing',
      rules: [
        'Минимум 1 approve от ревьюера',
        'Все комментарии resolved',
        'Задеплоено на staging'
      ]
    },
    {
      from: 'Testing',
      to: 'Done',
      rules: [
        'QA подтвердил acceptance criteria',
        'Нет критических багов',
        'Задеплоено в production',
        'Monitoring настроен (если нужно)'
      ]
    }
  ],
  metrics: [
    { name: 'Cycle Time', target: '< 3 дней', frequency: 'Еженедельно' },
    { name: 'Lead Time', target: '< 7 дней', frequency: 'Еженедельно' },
    { name: 'Throughput', target: '> 8 задач/неделю', frequency: 'Еженедельно' },
    { name: 'WIP Age', target: '< 5 дней в одной колонке', frequency: 'Ежедневно' }
  ]
};

console.log('=== Kanban Board ===');
kanbanBoard.columns.forEach(col => {
  const wip = col.wipLimit ? \`WIP: \${col.wipLimit}\` : 'без лимита';
  console.log(\`[\${col.name}] (\${wip}) — \${col.description}\`);
});

console.log('\\n=== Swimlanes ===');
kanbanBoard.swimlanes.forEach(s => {
  console.log(\`\${s.name} (\${s.color}): \${s.description}\`);
});

console.log('\\n=== Политики перехода ===');
kanbanBoard.transitionPolicies.forEach(p => {
  console.log(\`\${p.from} → \${p.to}:\`);
  p.rules.forEach(r => console.log(\`  - \${r}\`));
});

console.log('\\n=== Метрики ===');
kanbanBoard.metrics.forEach(m => {
  console.log(\`\${m.name}: цель \${m.target} (измеряем \${m.frequency})\`);
});`,
      explanation: 'Kanban-доска — это не просто визуальный инструмент, а система управления потоком работы. WIP limits предотвращают перегрузку, swimlanes разделяют типы работ, а политики перехода — это «Definition of Done» для каждого этапа. Метрики позволяют объективно измерять эффективность и находить бутылочные горлышки.'
    }
  ]
}
