export default {
  id: 19,
  title: 'Feature Flags',
  description: 'Feature Flags: управление функциональностью без деплоя, типы флагов, инструменты, trunk-based development и борьба с техническим долгом.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Feature Flags и зачем они нужны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Feature Flag (feature toggle) — условие в коде, которое включает или выключает функциональность без деплоя. Вместо того чтобы мержить код, когда фича готова, вы мержите его сразу, но за флагом. Флаг можно включить или выключить в любой момент через админку или конфиг.' },
        { type: 'heading', value: 'Зачем нужны Feature Flags' },
        { type: 'list', value: [
          'Безопасный деплой — код в продакшене, но фича выключена для пользователей',
          'Постепенный раскат — включить фичу для 5% пользователей, потом для всех',
          'A/B тестирование — показать вариант A одним, вариант B другим',
          'Kill switch — мгновенно выключить проблемную фичу без деплоя',
          'Trunk-based development — нет долгоживущих feature-веток',
          'Бета-тестирование — включить фичу только для бета-тестеров'
        ] },
        { type: 'heading', value: 'Как это работает в коде' },
        { type: 'code', language: 'bash', value: '# Простейший feature flag:\n\n# Backend (Node.js)\n# if (featureFlags.isEnabled("new-checkout")) {\n#   return newCheckoutFlow(order);\n# } else {\n#   return oldCheckoutFlow(order);\n# }\n\n# Frontend (React)\n# function CheckoutPage() {\n#   const showNewCheckout = useFeatureFlag("new-checkout");\n#   return showNewCheckout\n#     ? <NewCheckout />\n#     : <OldCheckout />;\n# }\n\n# Мобильное приложение (Flutter/React Native)\n# if (remoteConfig.getBool("new_checkout")) {\n#   showNewCheckout();\n# } else {\n#   showOldCheckout();\n# }' },
        { type: 'heading', value: 'Реальный пример' },
        { type: 'text', value: 'Компания решила переделать страницу оформления заказа. Это займёт 3 спринта (6 недель). Без feature flags: разработчики работают в отдельной ветке 6 недель, потом мучительно мержат. С feature flags: разработчики мержат код каждый день, но страница скрыта за флагом. QA тестирует, включив флаг в staging. Когда всё готово — флаг включается для пользователей.' },
        { type: 'tip', value: 'Feature Flags — это не только про код. Это про культуру: мержить маленькими кусками, деплоить часто, управлять риском через конфигурацию, а не через ветвление.' },
        { type: 'note', value: 'Facebook, Google, Netflix, LinkedIn — все массово используют feature flags. У Facebook более 10 000 активных флагов одновременно. Это позволяет им деплоить код десятки раз в день.' }
      ]
    },
    {
      id: 2,
      title: 'Типы флагов — release, experiment, ops, permission',
      type: 'theory',
      content: [
        { type: 'text', value: 'Не все feature flags одинаковы. Есть четыре основных типа, и у каждого своя цель, срок жизни и уровень управления. Понимание типов помогает правильно их использовать и вовремя убирать.' },
        { type: 'heading', value: 'Release Flags — управление релизами' },
        { type: 'code', language: 'bash', value: '# Release Flag: скрыть незавершённую фичу в продакшене\n# Срок жизни: дни — недели (убрать после полного раската)\n#\n# Пример: новый checkout\n# if (flags.isEnabled("release.new-checkout")) {\n#   return <NewCheckout />;\n# }\n#\n# Жизненный цикл:\n# 1. Создали флаг: OFF\n# 2. Разработка 3 недели (код мержится за флагом)\n# 3. QA тестирует на staging (флаг ON на staging)\n# 4. Включили для 10% пользователей в проде\n# 5. Мониторинг 2 дня → OK\n# 6. Включили для 100% пользователей\n# 7. Убрали флаг из кода (cleanup) ← ВАЖНО!' },
        { type: 'heading', value: 'Experiment Flags — A/B тесты' },
        { type: 'code', language: 'bash', value: '# Experiment Flag: показать разные варианты разным группам\n# Срок жизни: недели — месяцы (до окончания эксперимента)\n#\n# Пример: какая кнопка конвертит лучше?\n# const variant = flags.getVariant("experiment.checkout-button");\n# // variant = "control" | "green-button" | "large-button"\n#\n# if (variant === "green-button") {\n#   return <Button color="green">Купить</Button>;\n# } else if (variant === "large-button") {\n#   return <Button size="xl">Купить сейчас!</Button>;\n# } else {\n#   return <Button>Купить</Button>;  // control\n# }\n#\n# Важно:\n# - Пользователь всегда видит один вариант (стабильное распределение)\n# - Собираем метрики: конверсия, средний чек, отказы\n# - Через 2-4 недели: анализируем результат, выбираем победителя' },
        { type: 'heading', value: 'Ops Flags — операционные переключатели' },
        { type: 'code', language: 'bash', value: '# Ops Flag: управление системой в реальном времени\n# Срок жизни: постоянные (живут в коде всегда)\n#\n# Пример 1: Kill switch\n# if (flags.isEnabled("ops.enable-recommendations")) {\n#   const recs = await getRecommendations(user);\n#   return recs;\n# } else {\n#   return [];  // Рекомендации отключены\n# }\n# Если сервис рекомендаций упал — выключаем флаг через админку\n# Пользователи просто не видят рекомендации, но сайт работает\n#\n# Пример 2: Maintenance mode\n# if (flags.isEnabled("ops.maintenance-mode")) {\n#   return <MaintenancePage />;\n# }\n#\n# Пример 3: Rate limiting\n# const maxRPS = flags.getNumber("ops.api-rate-limit");\n# // Можно динамически менять без деплоя' },
        { type: 'heading', value: 'Permission Flags — доступ по ролям' },
        { type: 'code', language: 'bash', value: '# Permission Flag: включить фичу для определённых пользователей\n# Срок жизни: долгосрочные\n#\n# Пример: премиум-функция\n# if (flags.isEnabled("permission.advanced-analytics", { userId })) {\n#   return <AdvancedAnalytics />;\n# }\n#\n# Правила:\n# - Включено для пользователей с планом "enterprise"\n# - Включено для бета-тестеров (список email)\n# - Включено для сотрудников компании (домен @company.com)\n\n# Настройка в LaunchDarkly / Unleash:\n# Flag: permission.advanced-analytics\n# Rules:\n#   IF user.plan == "enterprise" → ON\n#   IF user.email ENDS WITH "@company.com" → ON\n#   IF user.id IN [123, 456, 789] → ON (бета)\n#   DEFAULT → OFF' },
        { type: 'tip', value: 'Называйте флаги с префиксом типа: release.new-checkout, experiment.checkout-button, ops.enable-recommendations. Это помогает понять назначение и срок жизни флага.' }
      ]
    },
    {
      id: 3,
      title: 'Инструменты — LaunchDarkly, Unleash, самописные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Feature flags можно реализовать по-разному: от простого JSON-конфига до облачных платформ. Выбор зависит от размера команды, количества флагов и требований к A/B тестированию.' },
        { type: 'heading', value: 'Самописное решение — для старта' },
        { type: 'code', language: 'bash', value: '# Уровень 1: Переменные окружения\n# .env\n# FEATURE_NEW_CHECKOUT=true\n# FEATURE_DARK_MODE=false\n#\n# Код:\n# const isNewCheckout = process.env.FEATURE_NEW_CHECKOUT === "true";\n# Минус: нужен деплой для изменения (перезапуск сервиса)\n\n# Уровень 2: JSON/YAML конфиг\n# features.json\n# {\n#   "new-checkout": { "enabled": true },\n#   "dark-mode": { "enabled": false, "users": [123, 456] }\n# }\n# Можно менять без деплоя (перечитать файл)\n# Минус: нет UI, нет аудита, нет A/B тестов\n\n# Уровень 3: Таблица в БД + Admin UI\n# CREATE TABLE feature_flags (\n#   name VARCHAR(100) PRIMARY KEY,\n#   enabled BOOLEAN DEFAULT false,\n#   rules JSONB,\n#   updated_by VARCHAR(100),\n#   updated_at TIMESTAMP\n# );\n# Плюс: можно менять через админку без деплоя\n# Минус: нужно написать UI, нет SDK для клиента' },
        { type: 'heading', value: 'LaunchDarkly — лидер рынка' },
        { type: 'code', language: 'bash', value: '# LaunchDarkly — SaaS платформа для feature flags\n# Стоимость: от $10/месяц за разработчика\n\n# Установка SDK:\n# npm install launchdarkly-node-server-sdk\n\n# Инициализация:\n# import LaunchDarkly from "launchdarkly-node-server-sdk";\n# const client = LaunchDarkly.init("sdk-key-xxx");\n#\n# // Проверка флага\n# const showNewCheckout = await client.variation(\n#   "new-checkout",\n#   { key: user.id, email: user.email, plan: user.plan },\n#   false  // значение по умолчанию\n# );\n\n# Возможности LaunchDarkly:\n# - Targeting: включить для конкретных пользователей, стран, планов\n# - Percentage rollout: 5% → 25% → 50% → 100%\n# - A/B testing: несколько вариантов с метриками\n# - Audit log: кто, когда, что включил/выключил\n# - SDK для всех языков: JS, Python, Java, Go, iOS, Android\n# - Streaming: изменения применяются мгновенно (без перезагрузки)' },
        { type: 'heading', value: 'Unleash — open source альтернатива' },
        { type: 'code', language: 'bash', value: '# Unleash — self-hosted решение для feature flags\n# Бесплатный open source, есть платная cloud-версия\n\n# Развёртывание через Docker:\ndocker run -d \\\n  -e DATABASE_URL=postgresql://postgres:password@db:5432/unleash \\\n  -p 4242:4242 \\\n  unleashorg/unleash-server\n\n# Открываем UI: http://localhost:4242\n# Создаём флаг через UI или API\n\n# SDK (Node.js):\n# import { initialize } from "unleash-client";\n# const unleash = initialize({\n#   url: "http://unleash:4242/api",\n#   appName: "my-app",\n#   customHeaders: { Authorization: "api-key-xxx" },\n# });\n#\n# if (unleash.isEnabled("new-checkout")) {\n#   // новый checkout\n# }\n\n# Стратегии Unleash:\n# - Standard: ON/OFF для всех\n# - Gradual rollout: процент пользователей\n# - UserIDs: список конкретных user ID\n# - IPs: по IP-адресу\n# - Hostname: по хосту' },
        { type: 'heading', value: 'Сравнение решений' },
        { type: 'list', value: [
          'Переменные окружения — 0-5 флагов, стартап на 2-3 человека, бесплатно',
          'БД + Admin UI — 5-20 флагов, команда 5-10 человек, бесплатно (но писать самим)',
          'Unleash (self-hosted) — 20-100 флагов, нужен свой сервер, бесплатно (open source)',
          'LaunchDarkly — 100+ флагов, A/B тесты, enterprise, от $10/разработчик/месяц'
        ] },
        { type: 'tip', value: 'Начните с переменных окружения или простого JSON-конфига. Переходите на Unleash или LaunchDarkly, когда флагов станет больше 10 и появится потребность в A/B тестах или percentage rollout.' }
      ]
    },
    {
      id: 4,
      title: 'Trunk-based development + Feature Flags',
      type: 'theory',
      content: [
        { type: 'text', value: 'Trunk-based development (TBD) — модель ветвления, где все разработчики коммитят в одну ветку (trunk/main). Долгоживущих feature-веток нет. Вместо них — feature flags. Код мержится в main ежедневно, но незавершённые фичи скрыты за флагами.' },
        { type: 'heading', value: 'Git Flow vs Trunk-Based Development' },
        { type: 'code', language: 'bash', value: '# Git Flow: долгие ветки, редкие мёржи\n#\n# main ─────────────────────────────────►\n# develop ──●──●──●──────●──●──────●───►\n#            \\         /    \\     /\n# feature/A   ●──●──●──●    \\   /\n#                            \\ /\n# feature/B        ●──●──●──●──●\n#\n# Проблемы:\n# - feature/A жила 3 недели → конфликты при мёрже\n# - feature/B зависит от A → ждёт, пока A замержат\n# - Integration hell: всё ломается при слиянии\n\n# Trunk-Based Development: короткие ветки, частые мёржи\n#\n# main ──●──●──●──●──●──●──●──●──●──●──►\n#         \\  / \\  / \\  /     \\  /\n# PR-1     ●    ●    ●        ●\n#               (каждый PR живёт 1-2 дня)\n#\n# Feature flags скрывают незавершённое:\n# main содержит код новой фичи, но за флагом\n# Флаг OFF в проде → пользователи не видят\n# Флаг ON на staging → QA тестирует' },
        { type: 'heading', value: 'Как это работает на практике' },
        { type: 'code', language: 'bash', value: '# Задача: переделать страницу профиля (2 недели работы)\n\n# День 1: Создаём флаг и базовую структуру\ngit checkout -b profile-v2-skeleton\n# Код:\n# if (flags.isEnabled("release.profile-v2")) {\n#   return <ProfileV2 />;  // Пока пустой компонент\n# }\n# return <ProfileV1 />;\ngit push && gh pr create  # PR живёт 1 день\n\n# День 2-3: Добавляем header нового профиля\ngit checkout -b profile-v2-header\n# Расширяем <ProfileV2 /> — добавляем header\ngit push && gh pr create  # Мёрж в main\n\n# День 4-5: Добавляем секцию настроек\ngit checkout -b profile-v2-settings\n# Добавляем <SettingsSection /> внутри ProfileV2\ngit push && gh pr create\n\n# День 6-10: Остальные секции (по 1-2 PR в день)\n# Каждый PR: 50-200 строк, review за 30 минут\n\n# День 11: Включаем флаг на staging\n# QA тестирует новый профиль\n\n# День 12: Включаем для 10% пользователей в проде\n# Мониторим метрики\n\n# День 13: 100% пользователей\n\n# День 14: Убираем флаг из кода (cleanup PR)' },
        { type: 'heading', value: 'Правила Trunk-Based Development' },
        { type: 'list', value: [
          'Ветки живут максимум 1-2 дня — если дольше, декомпозируй',
          'PR не больше 200-300 строк — большие PR = плохая декомпозиция',
          'Мёрж минимум раз в день — код должен интегрироваться постоянно',
          'Feature flags для всего незавершённого — не мержь сломанный UI без флага',
          'CI обязателен — каждый PR проходит тесты перед мёржем',
          'Нет feature-веток, которые живут неделями — это антипаттерн в TBD'
        ] },
        { type: 'tip', value: 'Google, Facebook, LinkedIn используют trunk-based development. В Google monorepo все 25 000+ разработчиков коммитят в один trunk. Feature flags — ключевой инструмент, который делает это возможным.' },
        { type: 'warning', value: 'Trunk-based development не означает "коммить прямо в main без review". PR нужны! Но PR должен быть маленьким (1-2 дня работы) и проходить CI. Прямые пуши в main допускаются только для trivial изменений в очень зрелых командах.' }
      ]
    },
    {
      id: 5,
      title: 'Технический долг от флагов — когда убирать',
      type: 'theory',
      content: [
        { type: 'text', value: 'Feature flags — мощный инструмент, но каждый флаг — это технический долг. Флаг добавляет ветвление в код (if/else), усложняет тестирование (нужно проверять оба пути) и создаёт когнитивную нагрузку (что включено, что нет?). Если флаги не убирать — код превращается в лабиринт условий.' },
        { type: 'heading', value: 'Проблемы старых флагов' },
        { type: 'code', language: 'bash', value: '# Пример кода с 3 вложенными флагами:\n# function getPrice(product, user) {\n#   if (flags.isEnabled("release.new-pricing")) {\n#     if (flags.isEnabled("experiment.discount-v2")) {\n#       if (flags.isEnabled("permission.vip-pricing")) {\n#         return vipPriceV2(product, user);\n#       }\n#       return discountV2(product);\n#     }\n#     return newPricing(product);\n#   }\n#   return oldPricing(product);\n# }\n#\n# 3 флага = 2^3 = 8 возможных комбинаций\n# Тестировать нужно все 8 веток\n# Если добавить 4-й флаг: 16 комбинаций\n#\n# Через 6 месяцев:\n# - Никто не помнит, что делает "release.new-pricing"\n# - Автор уволился\n# - Флаг включён для всех уже 5 месяцев\n# - Но удалить страшно — "а вдруг что-то сломается"' },
        { type: 'heading', value: 'Правила жизненного цикла флагов' },
        { type: 'list', value: [
          'Release flags: убрать через 1-2 недели после полного раската',
          'Experiment flags: убрать после завершения эксперимента (макс 4-6 недель)',
          'Ops flags (kill switch): живут в коде постоянно — это нормально',
          'Permission flags: живут долго, но пересматриваются каждый квартал',
          'Правило: у каждого флага должен быть owner и expiration date'
        ] },
        { type: 'heading', value: 'Процесс cleanup' },
        { type: 'code', language: 'bash', value: '# 1. Создать тикет на cleanup при создании флага\n# Jira: "CLEANUP: Remove flag release.new-checkout"\n# Дедлайн: 2 недели после полного раската\n\n# 2. Удаление флага из кода\ngit checkout -b cleanup/remove-new-checkout-flag\n\n# До:\n# if (flags.isEnabled("release.new-checkout")) {\n#   return <NewCheckout />;\n# } else {\n#   return <OldCheckout />;\n# }\n\n# После:\n# return <NewCheckout />;\n# (и удалить компонент <OldCheckout />)\n\n# 3. Удаление флага из системы управления\n# LaunchDarkly → Archive flag\n# Unleash → Delete toggle\n\n# 4. Удаление тестов для старого пути\n# Тесты для OldCheckout больше не нужны\n\n# 5. Code review как обычный PR\ngit push && gh pr create --title "cleanup: remove new-checkout flag"' },
        { type: 'heading', value: 'Автоматизация cleanup' },
        { type: 'code', language: 'bash', value: '# Мониторинг старых флагов:\n\n# 1. Дашборд "Flag Age"\n# Список всех флагов с датой создания\n# Подсветка красным: release-флаги старше 30 дней\n\n# 2. Slack-напоминания\n# Бот: "@ivan, флаг release.new-checkout создан 25 дней назад.\n#       Он включён для 100% пользователей.\n#       Пора удалить? Тикет: PROJ-456"\n\n# 3. Лимит на количество флагов\n# Правило: максимум 20 release-флагов одновременно\n# Если лимит достигнут — нельзя создать новый, пока не удалишь старый\n\n# 4. Lint-правила\n# Кастомное ESLint правило:\n# "Флаг release.old-feature используется в коде,\n#  но помечен как archived в системе. Удалите."' },
        { type: 'warning', value: 'Самая частая ошибка: "Потом уберём". Потом не наступает никогда. Через год в коде 50 флагов, из которых 40 включены для всех и никто не знает, можно ли их убрать. Убирайте флаги сразу после полного раската.' },
        { type: 'tip', value: 'Введите "Flag Cleanup Friday" — каждую пятницу 30 минут на удаление старых флагов. Или правило: прежде чем создать новый release-флаг, удали один старый.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Спроектировать стратегию feature flags для продукта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вы — тимлид команды из 7 разработчиков, работающей над SaaS-продуктом для управления проектами (аналог Jira). Команда переходит на trunk-based development и нуждается в стратегии feature flags. Нужно продумать типы флагов, инструменты, правила и процесс cleanup.',
      requirements: [
        'Выбрать и обосновать инструмент для feature flags',
        'Описать конвенцию именования флагов и минимум 4 примера',
        'Описать процесс работы с release-флагами (создание → раскат → cleanup)',
        'Составить правила для команды (максимальный возраст, лимиты, ответственные)',
        'Привести пример A/B эксперимента с описанием метрик',
        'Описать plan для cleanup — как не накопить технический долг'
      ],
      hint: 'Для SaaS из 7 человек: Unleash (self-hosted, бесплатный). Именование: тип.название (release.board-v2, experiment.task-card-layout). Процесс: создать флаг + тикет на cleanup → разработка за флагом → staging (ON) → canary 10% → 100% → cleanup через 1-2 недели.',
      expectedOutput: 'Инструмент: Unleash (self-hosted, бесплатный, подходит для 7 человек)\n\nИменование:\n- release.board-redesign — новый дизайн доски\n- experiment.task-card-layout — A/B тест карточки\n- ops.disable-notifications — kill switch уведомлений\n- permission.gantt-chart — Gantt только для Enterprise\n\nПроцесс release-флага:\n1. Создать флаг + тикет CLEANUP-xxx (дедлайн: +2 недели после раската)\n2. Разработка: 1-2 дня на PR, мёрж в main за флагом\n3. Staging: флаг ON, QA тестирует\n4. Production: 10% → 50% → 100% (3 дня)\n5. Cleanup: удалить флаг и старый код (1-2 недели)\n\nПравила:\n- Release-флаги: max 30 дней, max 15 штук одновременно\n- Каждый флаг имеет owner\n- Flag Cleanup Friday: 30 минут еженедельно\n\nA/B эксперимент: task-card-layout\n- Вариант A: текущая карточка, Вариант B: компактная карточка\n- Метрики: скорость перетаскивания, клики, время на доске',
      solution: '# Стратегия Feature Flags для SaaS (project management tool)\n\n# 1. ИНСТРУМЕНТ: Unleash (self-hosted)\n# Обоснование:\n#   - Бесплатный open-source\n#   - Для 7 разработчиков — достаточно функциональности\n#   - Self-hosted: данные у нас, нет vendor lock-in\n#   - SDK для Node.js и React\n#   - Gradual rollout, user targeting\n#   - Переход на LaunchDarkly, если вырастем до 30+ человек\n\n# 2. КОНВЕНЦИЯ ИМЕНОВАНИЯ: тип.название-фичи\n# release.board-redesign — новый дизайн доски задач\n# release.timeline-view — новое представление Timeline\n# experiment.task-card-compact — A/B тест компактных карточек\n# experiment.onboarding-flow-v2 — новый онбординг\n# ops.disable-email-notifications — kill switch email\n# ops.maintenance-mode — режим обслуживания\n# permission.gantt-chart — Gantt только для Enterprise\n# permission.custom-fields — кастомные поля для Business+\n\n# 3. ПРОЦЕСС RELEASE-ФЛАГА\n# Создание:\n#   - Разработчик создаёт флаг в Unleash (OFF)\n#   - Создаёт тикет CLEANUP-xxx (дедлайн: +14 дней после 100%)\n#   - Owner = автор флага\n#\n# Разработка:\n#   - PR 1-2 дня, мёрж в main за флагом\n#   - Тесты для обоих путей (flag ON и OFF)\n#\n# Раскат:\n#   - Staging: флаг ON → QA тестирует 2-3 дня\n#   - Production 10%: мониторинг 1 день\n#   - Production 50%: мониторинг 1 день\n#   - Production 100%: мониторинг 1 день\n#\n# Cleanup:\n#   - PR: удалить if/else, оставить только новый код\n#   - Удалить старые компоненты и тесты\n#   - Архивировать флаг в Unleash\n\n# 4. ПРАВИЛА ДЛЯ КОМАНДЫ\n# - Release-флаги: max возраст 30 дней после раската\n# - Max 15 release-флагов одновременно\n# - Каждый флаг имеет owner (в описании флага в Unleash)\n# - Нельзя создать новый release-флаг, если у тебя есть\n#   невычищенный старый\n# - Flag Cleanup Friday: 30 минут каждую пятницу\n# - Experiment-флаги: max 6 недель\n\n# 5. A/B ЭКСПЕРИМЕНТ: task-card-compact\n# Гипотеза: компактные карточки ускоряют работу с доской\n# Вариант A (control): текущая карточка (большая, с аватарами)\n# Вариант B: компактная карточка (меньше, только title + priority)\n# Распределение: 50/50\n# Метрики:\n#   - Drag & drop count (больше = лучше)\n#   - Time on board page (меньше = эффективнее)\n#   - Tasks completed per session\n# Срок: 3 недели\n# Результат: если B лучше на 10%+ → внедряем\n\n# 6. PLAN CLEANUP\n# Автоматизация:\n#   - Slack-бот: напоминание owner-у за 5 дней до дедлайна\n#   - Дашборд: все флаги с возрастом и статусом\n#   - CI lint: warning если флаг archived, но есть в коде\n# Процесс:\n#   - Weekly: Slack-бот постит список флагов старше 14 дней\n#   - Monthly: тимлид ревьюит все флаги на ретро\n#   - Quarterly: полный аудит всех permission и ops флагов',
      explanation: 'Unleash — оптимальный выбор для команды из 7 человек: бесплатный, self-hosted, покрывает все потребности. Конвенция именования с префиксом типа помогает понять назначение и срок жизни флага. Ключевой элемент — тикет на cleanup при создании флага и правило "30 дней максимум". Без принудительного cleanup через полгода код станет неуправляемым. A/B тесты помогают принимать product-решения на основе данных, а не мнений.'
    }
  ]
}
