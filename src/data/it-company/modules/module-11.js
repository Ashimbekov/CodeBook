export default {
  id: 11,
  title: 'Git Flow',
  description: 'Стратегии ветвления в Git: Git Flow, GitHub Flow, Trunk-based development. Naming conventions для веток и выбор подхода для разных проектов.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужна стратегия ветвления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда в команде 2-3 человека, можно коммитить в main и договариваться устно. Но когда разработчиков 10+, без чётких правил начинается хаос: конфликты, сломанные билды, потерянный код. Стратегия ветвления — это соглашение команды о том, как организовать работу с ветками в Git.' },
        { type: 'heading', value: 'Что происходит без стратегии' },
        { type: 'list', value: [
          'Разработчик A коммитит в main незаконченную фичу — ломает билд',
          'Разработчик B делает ветку fix-bug, а C — ветку bugfix. Непонятно, что есть что',
          'QA не понимает, какую ветку тестировать — фичи перемешаны',
          'Релиз задерживается, потому что в main попал незаконченный код',
          'Hotfix в продакшен невозможно сделать быстро — main нестабилен',
          'Merge-конфликты растут как снежный ком — ветки живут неделями'
        ] },
        { type: 'heading', value: 'Что даёт стратегия ветвления' },
        { type: 'list', value: [
          'Main/master всегда стабилен — можно задеплоить в любой момент',
          'Фичи изолированы друг от друга — можно работать параллельно',
          'Понятный процесс для новых разработчиков — нет "а как у нас тут?"',
          'Быстрые хотфиксы — есть чёткий путь для экстренных исправлений',
          'QA знает, что и когда тестировать',
          'CI/CD пайплайн настроен под конкретные ветки'
        ] },
        { type: 'heading', value: 'Основные стратегии' },
        { type: 'code', language: 'bash', value: '# 3 основные стратегии ветвления:\n\n# 1. Git Flow (Vincent Driessen, 2010)\n#    main -> develop -> feature branches\n#    Много веток, строгие правила\n#    Подходит: enterprise, мобильные приложения, редкие релизы\n\n# 2. GitHub Flow (Scott Chacon, GitHub)\n#    main -> feature branches (через PR)\n#    Простая модель, частые деплои\n#    Подходит: SaaS, web-приложения, CD\n\n# 3. Trunk-Based Development\n#    Все коммитят в main (trunk)\n#    Feature flags вместо веток\n#    Подходит: большие команды Google/Meta, высокая зрелость' },
        { type: 'tip', value: 'Нет "лучшей" стратегии — есть подходящая для вашего проекта. Стартап из 3 человек с веб-приложением не нуждается в Git Flow. Enterprise с мобильным приложением и ежемесячными релизами не потянет trunk-based без feature flags.' },
        { type: 'note', value: 'В реальной практике большинство компаний используют GitHub Flow или его вариацию. Git Flow остался в enterprise и мобильной разработке. Trunk-based development набирает популярность в зрелых командах с сильным CI/CD.' }
      ]
    },
    {
      id: 2,
      title: 'Git Flow — main, develop, feature, release, hotfix',
      type: 'theory',
      content: [
        { type: 'text', value: 'Git Flow — классическая модель ветвления, предложенная Vincent Driessen в 2010 году. Она определяет строгую структуру веток с чёткими ролями. Несмотря на то что многие считают её избыточной для web-проектов, она до сих пор широко используется в enterprise и мобильной разработке.' },
        { type: 'heading', value: 'Структура веток' },
        { type: 'code', language: 'bash', value: '# Постоянные ветки (живут всегда):\n# main (master)  — код продакшена, каждый коммит = релиз\n# develop        — основная ветка разработки, сюда вливаются фичи\n\n# Временные ветки (создаются и удаляются):\n# feature/*      — новая функциональность\n# release/*      — подготовка релиза\n# hotfix/*       — экстренное исправление в продакшене\n\n# Визуально:\n# main:     ──●──────────────────●──────────●──\n#              \\                /          /\n# release:      \\         ──●──          /\n#                \\        /    \\        /\n# develop: ──●────●──●──●──────●──●──●──\n#              \\    /     \\    /\n# feature:      ●──●       ●──●' },
        { type: 'heading', value: 'Жизненный цикл фичи' },
        { type: 'code', language: 'bash', value: '# 1. Создаём ветку от develop\ngit checkout develop\ngit pull origin develop\ngit checkout -b feature/PROJ-123-user-registration\n\n# 2. Работаем, коммитим\ngit add .\ngit commit -m "feat: add registration form"\ngit commit -m "feat: add email validation"\ngit commit -m "test: add registration tests"\n\n# 3. Завершаем — мержим в develop\ngit checkout develop\ngit pull origin develop\ngit merge --no-ff feature/PROJ-123-user-registration\ngit push origin develop\n\n# 4. Удаляем ветку\ngit branch -d feature/PROJ-123-user-registration\ngit push origin --delete feature/PROJ-123-user-registration' },
        { type: 'heading', value: 'Release и Hotfix' },
        { type: 'code', language: 'bash', value: '# === Release Branch ===\n# Когда develop готов к релизу:\ngit checkout develop\ngit checkout -b release/1.2.0\n\n# На этой ветке: только багфиксы, обновление версий, документация\n# Никаких новых фич!\ngit commit -m "chore: bump version to 1.2.0"\ngit commit -m "fix: correct validation message"\n\n# Мержим в main И в develop\ngit checkout main\ngit merge --no-ff release/1.2.0\ngit tag -a v1.2.0 -m "Release 1.2.0"\ngit checkout develop\ngit merge --no-ff release/1.2.0\ngit branch -d release/1.2.0\n\n# === Hotfix Branch ===\n# Критический баг в продакшене:\ngit checkout main\ngit checkout -b hotfix/1.2.1-fix-payment\n\ngit commit -m "fix: correct payment calculation"\n\n# Мержим в main И в develop\ngit checkout main\ngit merge --no-ff hotfix/1.2.1-fix-payment\ngit tag -a v1.2.1 -m "Hotfix 1.2.1"\ngit checkout develop\ngit merge --no-ff hotfix/1.2.1-fix-payment\ngit branch -d hotfix/1.2.1-fix-payment' },
        { type: 'warning', value: 'Главная ошибка в Git Flow — не мержить hotfix/release обратно в develop. Это приводит к потере фиксов: в develop их нет, и при следующем релизе баг вернётся.' },
        { type: 'heading', value: 'Когда использовать Git Flow' },
        { type: 'list', value: [
          'Мобильные приложения с App Store/Google Play — фиксированные циклы релизов',
          'Enterprise-продукты с длинными циклами тестирования (банки, страховые)',
          'Проекты, где несколько версий поддерживаются параллельно',
          'Команды с выделенным QA-отделом, тестирующим release-ветки',
          'Проекты с жёстким compliance — нужно точно знать, что в каком релизе'
        ] },
        { type: 'tip', value: 'Используйте утилиту git-flow (brew install git-flow-avh) для автоматизации. Она оборачивает стандартные команды: git flow feature start, git flow release finish и т.д.' }
      ]
    },
    {
      id: 3,
      title: 'GitHub Flow — упрощённая модель',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub Flow — минималистичная стратегия ветвления. Есть только main (всегда деплоится в продакшен) и feature branches. Вся работа идёт через Pull Requests. Это стандарт де-факто для большинства web-компаний.' },
        { type: 'heading', value: 'Правила GitHub Flow' },
        { type: 'list', value: [
          'main всегда деплоится — в нём только рабочий, протестированный код',
          'Для любой работы создаётся ветка от main',
          'Коммиты в ветку + push на remote регулярно',
          'Когда готово — открывается Pull Request',
          'После ревью и прохождения CI — мержится в main',
          'После мержа — автоматический деплой в продакшен'
        ] },
        { type: 'heading', value: 'Рабочий процесс' },
        { type: 'code', language: 'bash', value: '# 1. Актуализируем main\ngit checkout main\ngit pull origin main\n\n# 2. Создаём ветку\ngit checkout -b feature/add-user-search\n\n# 3. Работаем, пушим регулярно\ngit add .\ngit commit -m "feat: add search input component"\ngit push origin feature/add-user-search\n\n# 4. Открываем PR на GitHub/GitLab\n# -> Запускается CI (тесты, линтер, build)\n# -> Назначаем ревьюеров\n# -> Обсуждаем, вносим правки\n\n# 5. После approve — Squash & Merge в main\n# -> Автоматический деплой в продакшен\n\n# 6. Удаляем ветку\ngit checkout main\ngit pull origin main\ngit branch -d feature/add-user-search' },
        { type: 'heading', value: 'Сравнение с Git Flow' },
        { type: 'code', language: 'bash', value: '# Git Flow:                    GitHub Flow:\n# main (продакшен)             main (продакшен)\n# develop (разработка)         --- нет ---\n# feature/* (фичи)             feature/* (фичи)\n# release/* (подготовка)       --- нет ---\n# hotfix/* (фиксы)             --- нет ---\n# ─────────────────────────    ───────────────\n# 5 типов веток                2 типа веток\n# Ручной релизный процесс     Автоматический CD\n# Фичи -> develop -> main     Фичи -> main\n# Долгие release-ветки         Мержим и деплоим сразу' },
        { type: 'heading', value: 'Как обрабатывать hotfix в GitHub Flow' },
        { type: 'code', language: 'bash', value: '# Hotfix — это та же feature branch, просто с высоким приоритетом:\ngit checkout main\ngit checkout -b fix/critical-payment-bug\n\n# Фиксим\ngit commit -m "fix: correct payment amount calculation"\ngit push origin fix/critical-payment-bug\n\n# PR с пометкой "urgent" -> fast review -> merge -> auto-deploy\n# Весь процесс занимает минуты, а не часы' },
        { type: 'tip', value: 'GitHub Flow отлично работает, когда у вас настроен CI/CD. Без автоматических тестов и деплоя мержить в main без release-ветки — рискованно.' },
        { type: 'note', value: 'GitLab Flow — вариация, добавляющая ветки окружений (staging, production) к GitHub Flow. Используется когда деплой не автоматический или нужен staging для ручного тестирования.' }
      ]
    },
    {
      id: 4,
      title: 'Trunk-based development — все в main',
      type: 'theory',
      content: [
        { type: 'text', value: 'Trunk-based development (TBD) — стратегия, при которой все разработчики коммитят напрямую в main (trunk) или используют очень короткоживущие ветки (не дольше 1-2 дней). Это подход Google, Meta, Netflix. Исследования DORA показали, что TBD коррелирует с высокой производительностью команд.' },
        { type: 'heading', value: 'Ключевые принципы' },
        { type: 'list', value: [
          'Все коммитят в main или мержат ветки в течение 1 дня',
          'Ветки — максимум 1-2 дня, не больше',
          'Незаконченные фичи скрываются за feature flags',
          'CI прогоняет тесты на каждый коммит в main',
          'Релизы через release branches или теги, но не через develop',
          'Нет долгоживущих веток — минимум merge-конфликтов'
        ] },
        { type: 'heading', value: 'Как это выглядит на практике' },
        { type: 'code', language: 'bash', value: '# Вариант 1: прямой коммит в main\ngit checkout main\ngit pull origin main\n# ... вносим небольшое изменение ...\ngit commit -m "feat: add tooltip to profile button"\ngit push origin main\n\n# Вариант 2: короткая ветка (< 1 дня)\ngit checkout main\ngit pull origin main\ngit checkout -b short-lived/add-tooltip\n# ... работаем пару часов ...\ngit commit -m "feat: add tooltip component"\ngit push origin short-lived/add-tooltip\n# -> быстрый PR, review, merge в main в тот же день\n\n# Feature flag для большой фичи:\nif (featureFlags.isEnabled("new-checkout")) {\n  // Новый код checkout — в main, но скрыт за флагом\n  renderNewCheckout();\n} else {\n  // Старый код — пользователи видят это\n  renderOldCheckout();\n}' },
        { type: 'heading', value: 'Требования для TBD' },
        { type: 'list', value: [
          'Быстрый CI — тесты за 5-10 минут, не 30+',
          'Хорошее покрытие тестами — коммит в main без тестов = рулетка',
          'Feature flags инфраструктура (LaunchDarkly, Unleash, самописная)',
          'Культура маленьких коммитов — не "200 файлов за раз"',
          'Доверие в команде — нет gatekeeping на каждый коммит',
          'Автоматический rollback при сбоях'
        ] },
        { type: 'heading', value: 'Как Google делает TBD' },
        { type: 'code', language: 'bash', value: '# Google monorepo (Piper):\n# - 1 репозиторий, 2+ миллиарда строк кода\n# - 50,000+ разработчиков\n# - 40,000+ коммитов в день\n# - Все в одной main ветке\n# - Обязательные code reviews (Critique)\n# - Автоматические тесты (TAP — Test Automation Platform)\n# - Feature flags для незаконченных фич\n# - Релизы через release branches от main\n\n# Процесс:\n# 1. Разработчик меняет код\n# 2. Отправляет на code review\n# 3. Автоматические тесты проходят\n# 4. Ревьюер одобряет\n# 5. Коммит в main\n# 6. Через release branch попадает в продакшен' },
        { type: 'warning', value: 'TBD не значит "коммить что хочешь в main". Это требует высокой инженерной культуры: автоматические тесты, feature flags, быстрый CI/CD. Без этих условий TBD превратится в хаос.' },
        { type: 'tip', value: 'Начните с GitHub Flow. Когда команда дозреет (хорошее покрытие тестами, быстрый CI, feature flags), можно переходить к TBD, сокращая время жизни веток постепенно: от недели до 2-3 дней, потом до 1 дня.' }
      ]
    },
    {
      id: 5,
      title: 'Naming conventions для веток',
      type: 'theory',
      content: [
        { type: 'text', value: 'Единообразные имена веток — это не просто эстетика. Когда в репозитории сотни веток, понятное именование позволяет моментально определить: кто работает, над чем, и какого типа изменение. Многие CI/CD пайплайны запускают разные джобы в зависимости от имени ветки.' },
        { type: 'heading', value: 'Стандартный формат' },
        { type: 'code', language: 'bash', value: '# Формат: <тип>/<тикет>-<краткое-описание>\n\n# Типы веток:\n# feature/  — новая функциональность\n# fix/      — исправление бага\n# hotfix/   — экстренный фикс продакшена\n# refactor/ — рефакторинг без изменения поведения\n# chore/    — рутинные задачи (обновление зависимостей, CI)\n# test/     — добавление/исправление тестов\n# docs/     — документация\n\n# Примеры:\nfeature/PROJ-123-user-registration\nfeature/PROJ-456-payment-gateway-integration\nfix/PROJ-789-null-pointer-on-login\nhotfix/PROJ-101-payment-calculation-error\nrefactor/PROJ-202-extract-auth-service\nchore/PROJ-303-upgrade-spring-boot-3\ntest/PROJ-404-add-payment-integration-tests\ndocs/PROJ-505-api-documentation' },
        { type: 'heading', value: 'Правила именования' },
        { type: 'list', value: [
          'Только lowercase — feature/Add-User недопустимо',
          'Разделитель слов — дефис (kebab-case): user-registration, не user_registration',
          'Тикет обязателен — связывает ветку с задачей в трекере',
          'Краткое описание — 2-4 слова, суть изменения',
          'Без спецсимволов — никаких пробелов, кириллицы, точек',
          'Не слишком длинные — max 50-60 символов'
        ] },
        { type: 'heading', value: 'CI/CD на основе имён веток' },
        { type: 'code', language: 'bash', value: '# GitHub Actions — запуск разных workflow по имени ветки:\n\n# .github/workflows/ci.yml\n# on:\n#   push:\n#     branches:\n#       - main\n#       - \'feature/**\'\n#       - \'fix/**\'\n#       - \'hotfix/**\'\n\n# Правила в GitLab CI:\n# deploy_staging:\n#   only:\n#     - /^release\\/.*$/\n# deploy_production:\n#   only:\n#     - main\n#     - /^hotfix\\/.*$/\n\n# Branch protection rules в GitHub:\n# main:\n#   - Require PR review (1+ approvals)\n#   - Require CI to pass\n#   - No direct pushes\n#   - No force pushes\n# develop:\n#   - Require CI to pass\n# feature/*:\n#   - Автоматически запускать тесты' },
        { type: 'heading', value: 'Частые ошибки в именовании' },
        { type: 'code', language: 'bash', value: '# ❌ Плохо:                       ✅ Хорошо:\nmy-branch                        feature/PROJ-123-user-search\nfix-bug                          fix/PROJ-456-login-null-pointer\nnew-feature                      feature/PROJ-789-email-notifications\nwip                              feature/PROJ-101-draft-payment-form\njohn/some-work                   feature/PROJ-202-refund-api\ntest123                          test/PROJ-303-payment-unit-tests\nPROJ-123                         feature/PROJ-123-add-user-avatar\nfeature/PROJ-123-add-the-new-user-registration-form-with-validation-and-email\n                                 feature/PROJ-123-user-registration' },
        { type: 'tip', value: 'Настройте Git hook (pre-push) или CI check для валидации имён веток. Это автоматически отклонит ветки вроде "my-branch" или "fix" без тикета.' },
        { type: 'note', value: 'Если в команде используется Jira, тикеты выглядят как PROJ-123. В Linear — LIN-123. В GitHub Issues — #123. Адаптируйте формат под ваш трекер: feature/#123-user-search или feature/LIN-123-user-search.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Выбрать стратегию ветвления',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перед вами три проекта с разными условиями. Выберите для каждого стратегию ветвления и обоснуйте выбор.',
      requirements: [
        'Проект A: Мобильное банковское приложение, команда 15 человек, релизы раз в 2 недели, строгий QA',
        'Проект B: SaaS-платформа для управления проектами, команда 6 человек, деплой несколько раз в день',
        'Проект C: Open-source библиотека, 50+ контрибьюторов, семантическое версионирование',
        'Для каждого проекта: указать стратегию, структуру веток, naming convention',
        'Объяснить почему именно эта стратегия, а не другая',
        'Привести пример имён веток для типичных задач каждого проекта'
      ],
      hint: 'Обратите внимание на частоту релизов, размер команды и требования к стабильности. Банковское приложение требует строгого контроля, SaaS живёт на continuous deployment, open-source работает через fork + PR.',
      expectedOutput: 'Проект A: Git Flow\n- main, develop, feature/*, release/*, hotfix/*\n- feature/BANK-123-biometric-auth\n- release/2.5.0, hotfix/2.4.1-fix-transfer\n- Обоснование: фиксированные релизы, строгий QA, compliance\n\nПроект B: GitHub Flow\n- main, feature/*, fix/*\n- feature/PM-456-gantt-chart\n- fix/PM-789-task-sorting\n- Обоснование: частые деплои, маленькая команда, CD\n\nПроект C: GitHub Flow + форки\n- main (protected), feature branches через fork\n- feature/add-retry-logic (в форке)\n- Обоснование: внешние контрибьюторы, PR-based workflow',
      solution: '# Проект A: Мобильное банковское приложение → Git Flow\n\n# Обоснование:\n# - Релизы в App Store/Google Play требуют подготовки (review 1-3 дня)\n# - Строгий QA = нужна release-ветка для стабилизации\n# - Compliance: нужно точно знать, что в каком релизе\n# - Hotfix-ветки для экстренных фиксов без нового release цикла\n\n# Структура:\n# main (продакшен, теги: v2.4.0, v2.5.0)\n# develop (текущая разработка)\n# feature/BANK-123-biometric-auth\n# feature/BANK-124-push-notifications\n# release/2.5.0 (стабилизация перед релизом)\n# hotfix/2.4.1-fix-transfer-amount\n\n# ──────────────────────────────────────\n\n# Проект B: SaaS-платформа → GitHub Flow\n\n# Обоснование:\n# - Деплой несколько раз в день = нет смысла в release-ветках\n# - 6 человек = Git Flow избыточен, overhead не оправдан\n# - CD: merge в main → автодеплой в продакшен\n# - Hotfix = обычный PR с пометкой urgent\n\n# Структура:\n# main (всегда деплоится)\n# feature/PM-456-gantt-chart\n# fix/PM-789-task-sorting-bug\n# chore/PM-101-upgrade-react-18\n\n# ──────────────────────────────────────\n\n# Проект C: Open-source библиотека → GitHub Flow + Fork\n\n# Обоснование:\n# - Внешние контрибьюторы не имеют push-доступа к репозиторию\n# - Fork + PR — стандарт open-source\n# - Семантическое версионирование через теги на main\n# - Maintainers делают code review каждого PR\n\n# Структура:\n# main (stable, protected)\n# Контрибьюторы:\n#   fork -> feature/add-retry-logic -> PR в upstream/main\n# Maintainers:\n#   release/1.5.0 для подготовки мажорных релизов\n#   Теги: v1.4.0, v1.4.1, v1.5.0',
      explanation: 'Выбор стратегии зависит от трёх факторов: частота релизов (редкие → Git Flow, частые → GitHub Flow/TBD), размер команды и уровень доверия (внешние контрибьюторы → Fork + PR), требования к стабильности (compliance → Git Flow, быстрый фидбек → TBD). Не существует универсальной стратегии — важно понимать контекст проекта.'
    }
  ]
}
