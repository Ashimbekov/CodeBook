export default {
  id: 9,
  title: 'Git workflow в команде',
  description: 'PR-процесс, branch naming, commit messages, стратегии мержа и Git-конвенции для команд.',
  lessons: [
    {
      id: 1,
      title: 'Git Flow vs Trunk-Based Development',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Два основных подхода к ветвлению' },
        { type: 'text', value: 'Git workflow — это набор правил о том, как команда работает с ветками. Неправильный workflow создаёт merge-конфликты, долгоживущие ветки и «страх мержить». Правильный — ускоряет разработку и снижает риски.' },
        { type: 'heading', value: 'Git Flow (классический)' },
        { type: 'list', value: [
          'main (production) → develop → feature branches',
          'Release branches для подготовки релиза',
          'Hotfix branches для срочных исправлений',
          'Плюсы: чёткая структура, подходит для релизных циклов',
          'Минусы: сложный, долгоживущие ветки, merge-конфликты'
        ]},
        { type: 'heading', value: 'Trunk-Based Development (современный)' },
        { type: 'list', value: [
          'main — единственная долгоживущая ветка',
          'Короткоживущие feature branches (1-2 дня)',
          'Feature flags для скрытия незавершённой функциональности',
          'Continuous Integration: мержим в main несколько раз в день',
          'Плюсы: простой, меньше конфликтов, быстрая обратная связь',
          'Минусы: требует CI/CD, feature flags и дисциплины'
        ]},
        { type: 'tip', value: 'Для большинства современных команд Trunk-Based Development — лучший выбор. Git Flow оправдан, если у вас длинные релизные циклы и несколько версий в production.' }
      ]
    },
    {
      id: 2,
      title: 'Branch naming и конвенции',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Почему имена веток важны' },
        { type: 'text', value: 'Когда в репозитории 50 веток с именами вроде «fix», «test123», «my-branch», невозможно понять, что происходит. Конвенция именования — это простое правило, которое приносит порядок.' },
        { type: 'heading', value: 'Формат имени ветки' },
        { type: 'code', language: 'text', value: 'Формат: <тип>/<номер-задачи>-<краткое-описание>\n\nПримеры:\n  feature/PROJ-123-add-payment-form\n  fix/PROJ-456-fix-login-redirect\n  refactor/PROJ-789-extract-auth-service\n  docs/PROJ-101-update-api-docs\n  chore/PROJ-202-upgrade-dependencies\n\nТипы:\n  feature/  — новая функциональность\n  fix/      — исправление бага\n  refactor/ — рефакторинг без изменения поведения\n  docs/     — документация\n  chore/    — обновление зависимостей, CI, конфиги\n  test/     — добавление/исправление тестов' },
        { type: 'heading', value: 'Правила хороших имён веток' },
        { type: 'list', value: [
          'Только lowercase и дефисы (не пробелы и не подчёркивания)',
          'Содержит номер задачи (ссылка на Jira/Linear/GitHub Issues)',
          'Краткое описание: 3-5 слов максимум',
          'На английском языке (международная конвенция)',
          'Удаляйте ветку после мержа — не копите мусор'
        ]},
        { type: 'note', value: 'Настройте автоматическое удаление веток после мержа PR в GitHub/GitLab. Это сохранит репозиторий чистым.' }
      ]
    },
    {
      id: 3,
      title: 'Conventional Commits',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Стандарт commit messages' },
        { type: 'text', value: 'Conventional Commits — это спецификация для написания commit messages. Она позволяет автоматически генерировать CHANGELOG, определять версию для семантического версионирования и упрощает навигацию по истории.' },
        { type: 'heading', value: 'Формат Conventional Commits' },
        { type: 'code', language: 'text', value: '<тип>(<scope>): <описание>\n\n[тело]\n\n[footer]\n\nТипы:\n  feat:     новая функциональность\n  fix:      исправление бага\n  docs:     документация\n  style:    форматирование (не CSS!)\n  refactor: рефакторинг\n  test:     тесты\n  chore:    обслуживание (зависимости, CI)\n  perf:     улучшение производительности\n\nПримеры:\n  feat(auth): add OAuth2 login with Google\n  fix(cart): prevent negative quantity in cart items\n  refactor(api): extract validation middleware\n  docs(readme): add deployment instructions\n  perf(db): add index for orders.user_id lookup' },
        { type: 'heading', value: 'Хорошие vs плохие commit messages' },
        { type: 'code', language: 'text', value: '❌ Плохие:\n  "fix"                          → Что исправлено?\n  "update"                       → Что обновлено?\n  "WIP"                          → Что за работа?\n  "fix tests"                    → Какие тесты? Почему падали?\n  "final fix (for real this time)" → Непрофессионально\n\n✅ Хорошие:\n  "fix(auth): handle expired JWT token gracefully"\n  "feat(search): add autocomplete with debounce (300ms)"\n  "refactor(orders): extract calculateTotal into pure function"\n  "fix(api): return 404 instead of 500 for missing user"\n  "perf(dashboard): lazy-load charts to reduce initial bundle"' },
        { type: 'tip', value: 'Установите commitlint + husky для автоматической проверки формата commit messages. Это предотвращает «fix» и «update» коммиты.' }
      ]
    },
    {
      id: 4,
      title: 'PR-процесс: от создания до мержа',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Anatomy of a Good PR' },
        { type: 'text', value: 'Pull Request — это не просто «запрос на мерж кода». Это единица коммуникации. Хороший PR рассказывает историю: что изменилось, зачем, и как это проверить.' },
        { type: 'heading', value: 'Шаблон описания PR' },
        { type: 'code', language: 'markdown', value: '## Что сделано\nДобавлена форма оплаты с интеграцией Stripe Elements.\n\n## Зачем\nJIRA-123: Пользователи не могут оплатить подписку.\n\n## Как это работает\n1. Пользователь выбирает план подписки\n2. Открывается модальное окно с формой оплаты (Stripe Elements)\n3. После успешной оплаты — redirect на страницу подтверждения\n\n## Как тестировать\n1. Открыть /pricing, выбрать план Pro\n2. В форме оплаты: карта 4242 4242 4242 4242\n3. Проверить: redirect на /thank-you, email-подтверждение\n\n## Скриншоты\n[скриншот формы]\n\n## Чеклист\n- [x] Тесты написаны\n- [x] Линтер проходит\n- [x] Проверено на staging\n- [ ] Документация обновлена' },
        { type: 'heading', value: 'Размер PR' },
        { type: 'list', value: [
          'Идеальный PR: 100-300 строк кода',
          'Допустимый PR: до 500 строк',
          'Большой PR (> 500 строк): разбейте на несколько',
          'Гигантский PR (> 1000 строк): отклоняйте, просите декомпозицию'
        ]},
        { type: 'note', value: 'Исследование Google: PR на 100 строк ревьюится за 15 минут с высоким качеством. PR на 1000 строк ревьюится за час с низким качеством. Маленькие PR → быстрый, качественный фидбек.' }
      ]
    },
    {
      id: 5,
      title: 'Merge-стратегии: merge, squash, rebase',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Три способа интегрировать изменения' },
        { type: 'text', value: 'Когда PR одобрен — как именно его влить в main? Каждая стратегия имеет свои плюсы и минусы. Выбор зависит от того, что для команды важнее: чистая история или полная трассировка.' },
        { type: 'heading', value: 'Сравнение стратегий' },
        { type: 'code', language: 'text', value: 'Merge commit (git merge --no-ff):\n  main: A → B → C → M (merge commit)\n  Плюсы: полная история, видно откуда пришли изменения\n  Минусы: шумная история с merge-коммитами\n  Когда: важна трассировка каждого изменения\n\nSquash and merge:\n  main: A → B → C → D (один коммит вместо 5)\n  Плюсы: чистая линейная история\n  Минусы: теряются промежуточные коммиты\n  Когда: PR содержит много мелких "WIP" коммитов\n\nRebase and merge:\n  main: A → B → C → D1 → D2 → D3 (коммиты перемещены)\n  Плюсы: линейная история, все коммиты сохранены\n  Минусы: коммиты переписываются (новые хеши)\n  Когда: каждый коммит в PR — логически завершённый шаг' },
        { type: 'heading', value: 'Рекомендация для команд' },
        { type: 'list', value: [
          'Начните с Squash and merge — самый простой вариант',
          'Каждый PR = один коммит в main с понятным сообщением',
          'Если команда дисциплинирована с коммитами — переходите на Rebase',
          'Merge commit используйте для release-веток и hotfixes'
        ]},
        { type: 'tip', value: 'Настройте GitHub/GitLab так, чтобы при Squash автоматически подставлялся заголовок PR как commit message. Это обеспечит чистую и понятную историю main.' }
      ]
    },
    {
      id: 6,
      title: 'Разрешение merge-конфликтов',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Конфликты — не проблема, а сигнал' },
        { type: 'text', value: 'Merge-конфликт возникает, когда два человека изменили одну и ту же часть кода. Это не баг Git — это сигнал, что нужна координация. Частые конфликты → плохая декомпозиция задач или слишком долгоживущие ветки.' },
        { type: 'heading', value: 'Как предотвратить конфликты' },
        { type: 'list', value: [
          'Маленькие, короткоживущие ветки (1-2 дня максимум)',
          'Регулярный rebase с main (git rebase main или git merge main)',
          'Разделение ответственности: не редактируйте одни файлы одновременно',
          'Коммуникация: «Я буду менять OrderService — предупредите, если тоже»',
          'Мелкие PR: чем меньше изменённый diff, тем меньше вероятность конфликта'
        ]},
        { type: 'heading', value: 'Как разрешать конфликты правильно' },
        { type: 'code', language: 'bash', value: '# 1. Обновите main\ngit checkout main\ngit pull origin main\n\n# 2. Вернитесь в свою ветку и rebase\ngit checkout feature/my-branch\ngit rebase main\n\n# 3. При конфликте — Git покажет проблемные файлы\n# CONFLICT (content): Merge conflict in src/services/order.js\n\n# 4. Откройте файл, найдите маркеры конфликта\n# <<<<<<< HEAD (ваш код)\n# =======\n# >>>>>>> main (код из main)\n\n# 5. Разрешите конфликт: оставьте правильную версию\n# 6. Пометьте как разрешённый\ngit add src/services/order.js\ngit rebase --continue' },
        { type: 'note', value: 'При разрешении конфликта ВСЕГДА проверяйте, что тесты проходят после мержа. Конфликт может быть «разрешён» синтаксически, но сломан логически.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: напишите commit messages и PR description',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вам даны описания изменений. Напишите правильные commit messages в формате Conventional Commits и описание PR.',
      requirements: [
        'Напишите 5 commit messages в формате Conventional Commits',
        'Для каждого укажите тип, scope и описание',
        'Напишите описание PR, объединяющего эти коммиты',
        'PR description должен содержать: что, зачем, как тестировать',
        'Определите правильное имя ветки для этих изменений'
      ],
      hint: 'Каждый коммит должен быть атомарным — одно логическое изменение. PR description должен рассказывать историю целиком.',
      expectedOutput: 'Branch: feature/PROJ-456-user-notifications\n5 commit messages в формате Conventional Commits\nPR description с секциями: что, зачем, как тестировать',
      solution: `// Контекст: вы добавляете систему уведомлений для пользователей
// Задача PROJ-456: "Как пользователь, я хочу получать уведомления о новых комментариях"

const branchName = 'feature/PROJ-456-user-notifications';

const commitMessages = [
  {
    message: 'feat(db): add notifications table with migration',
    body: 'Create notifications table with columns: id, user_id, type, message,\\nread_at, created_at. Add index on user_id for fast lookups.',
    files: ['migrations/20260404_create_notifications.sql', 'src/models/notification.js']
  },
  {
    message: 'feat(api): add CRUD endpoints for notifications',
    body: 'GET /api/notifications - list user notifications (paginated)\\nPATCH /api/notifications/:id/read - mark as read\\nDELETE /api/notifications/:id - delete notification',
    files: ['src/routes/notifications.js', 'src/controllers/notificationController.js']
  },
  {
    message: 'feat(service): add notification triggers for new comments',
    body: 'When a new comment is created on a post, create a notification\\nfor the post author. Respects user notification preferences.',
    files: ['src/services/notificationService.js', 'src/services/commentService.js']
  },
  {
    message: 'feat(ui): add notification bell with dropdown',
    body: 'NotificationBell component shows unread count badge.\\nDropdown lists last 10 notifications with mark-as-read on click.',
    files: ['src/components/NotificationBell.vue', 'src/components/NotificationList.vue']
  },
  {
    message: 'test(notifications): add unit and integration tests',
    body: 'Unit tests for NotificationService (8 cases).\\nIntegration tests for API endpoints (5 cases).\\nComponent tests for NotificationBell (3 cases).',
    files: ['tests/services/notification.test.js', 'tests/api/notifications.test.js']
  }
];

const prDescription = \`## Что сделано
Добавлена система уведомлений: пользователи получают уведомления
о новых комментариях к их постам.

## Зачем
PROJ-456: Пользователи не узнают о новых комментариях к своим
постам и пропускают обсуждения. Это снижает вовлечённость.

## Что включено
- Модель Notification + миграция БД
- REST API для уведомлений (list, mark read, delete)
- Триггер: новый комментарий → уведомление автору поста
- UI: колокольчик в хедере с dropdown списком уведомлений
- Тесты: 16 тестов (unit + integration + component)

## Как тестировать
1. Авторизуйтесь как user1, создайте пост
2. Авторизуйтесь как user2, оставьте комментарий к этому посту
3. Вернитесь в user1 — должно появиться уведомление (колокольчик)
4. Кликните колокольчик — список уведомлений
5. Кликните уведомление — пометится прочитанным

## Скриншоты
[скриншот колокольчика с badge]
[скриншот dropdown с уведомлениями]

## Checklist
- [x] Миграция БД
- [x] API endpoints
- [x] Unit тесты (coverage > 85%)
- [x] UI компоненты
- [x] Проверено на staging
- [ ] Документация API (обновлю после ревью)\`;

console.log('Branch: ' + branchName);
console.log('\\n=== Commit Messages ===');
commitMessages.forEach((c, i) => {
  console.log(\`\${i + 1}. \${c.message}\`);
  console.log(\`   Files: \${c.files.join(', ')}\`);
});
console.log('\\n=== PR Description ===');
console.log(prDescription);`,
      explanation: 'Хороший Git workflow — это система коммуникации. Имя ветки говорит, над чем вы работаете. Commit messages рассказывают историю изменений. PR description объясняет контекст и помогает ревьюеру. Всё вместе создаёт трассируемость: из production бага → git blame → commit → PR → задача в Jira.'
    }
  ]
}
