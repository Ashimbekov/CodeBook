export default {
  id: 35,
  title: 'Типовые задачи разработчика',
  description: 'Полная симуляция рабочих задач: CRUD-фича от тикета до деплоя, баг-фикс, интеграция с внешним API, миграция базы данных, срочный hotfix в пятницу и типичный рабочий день разработчика.',
  lessons: [
    {
      id: 1,
      title: 'CRUD-фича от А до Я — от тикета до деплоя',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Полный workflow реализации фичи' },
        { type: 'text', value: 'Реализация CRUD-фичи — самая типовая задача разработчика. Но «написать CRUD» — это 20% работы. Остальные 80% — это коммуникация, тестирование, code review, деплой и мониторинг. Рассмотрим полный путь фичи «Управление адресами доставки» от появления в бэклоге до работы в продакшене.' },
        { type: 'heading', value: 'Шаг 1: Получение задачи' },
        { type: 'code', language: 'text', value: 'Jira: SHOP-1234 — CRUD для адресов доставки\n\nОписание:\n  Как пользователь, я хочу управлять своими адресами доставки,\n  чтобы быстро выбирать адрес при оформлении заказа.\n\nAcceptance Criteria:\n  ✓ Пользователь может добавить адрес (город, улица, дом, квартира, индекс)\n  ✓ Пользователь может редактировать адрес\n  ✓ Пользователь может удалить адрес\n  ✓ Пользователь может отметить адрес как \"по умолчанию\"\n  ✓ Максимум 5 адресов на пользователя\n  ✓ Валидация индекса (6 цифр)\n\nDependencies: Figma-макет готов, API-контракт согласован\nEstimate: 5 Story Points\nSprint: Sprint 42\nAssignee: Вы' },
        { type: 'heading', value: 'Шаг 2: Подготовка' },
        { type: 'list', value: [
          'Прочитать Jira-тикет, Acceptance Criteria и Figma-макет',
          'Задать вопросы PO: «Что происходит при удалении адреса, если он используется в активном заказе?»',
          'Обсудить с QA: какие тест-кейсы они планируют?',
          'Создать ветку: git checkout -b feature/SHOP-1234-delivery-addresses',
          'Обновить Jira-статус: In Progress'
        ]},
        { type: 'heading', value: 'Шаг 3: Разработка' },
        { type: 'code', language: 'bash', value: '# 1. Создаём миграцию базы данных\n# delivery_addresses: id, user_id, city, street, building, apartment, zip_code, is_default, created_at\n\n# 2. Пишем модель/entity\n# 3. Пишем репозиторий (DAO)\n# 4. Пишем сервис с бизнес-логикой:\n#    - Валидация (макс 5 адресов, формат индекса)\n#    - Только один адрес \"по умолчанию\"\n# 5. Пишем контроллер (REST API):\n#    POST   /api/v1/addresses      — создать\n#    GET    /api/v1/addresses      — список\n#    GET    /api/v1/addresses/:id  — получить\n#    PUT    /api/v1/addresses/:id  — обновить\n#    DELETE /api/v1/addresses/:id  — удалить\n#    PATCH  /api/v1/addresses/:id/default — сделать по умолчанию\n# 6. Пишем unit-тесты (сервис) и integration-тесты (API)\n# 7. Обновляем Swagger/OpenAPI документацию' },
        { type: 'heading', value: 'Шаг 4: Code Review → Merge → Deploy' },
        { type: 'list', value: [
          'Создать Pull Request с описанием: что сделано, скриншоты, как тестировать',
          'Назначить ревьюера (обычно Tech Lead или Senior из команды)',
          'Исправить замечания, получить approve',
          'Merge в develop, автоматический деплой на staging',
          'QA тестирует на staging, подтверждает',
          'Деплой в production (вручную или автоматически, зависит от процесса)',
          'Проверить логи и метрики после деплоя: error rate, latency, 5xx',
          'Обновить Jira-статус: Done'
        ]},
        { type: 'tip', value: 'Золотое правило: не коммитьте всё одним огромным PR. Разбивайте на части: первый PR — миграция + модель, второй — сервис + тесты, третий — контроллер + API-тесты. Маленькие PR ревьюятся быстрее и качественнее.' }
      ]
    },
    {
      id: 2,
      title: 'Баг-фикс — воспроизведение → дебаг → фикс → тесты → PR → деплой',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Анатомия баг-фикса' },
        { type: 'text', value: 'Баг-фикс — вторая по частоте задача разработчика после новых фич. Хороший баг-фикс — это не «поменял строчку и задеплоил». Это дисциплинированный процесс: воспроизведение, локализация, фикс, тесты, деплой. Многие баги, «исправленные» без этого процесса, возвращаются через неделю (regression).' },
        { type: 'heading', value: 'Шаг 1: Понять проблему' },
        { type: 'code', language: 'text', value: 'Баг-репорт из Jira:\n\nBUG-567: Пользователь не может оплатить заказ при использовании промокода\n\nШаги воспроизведения:\n1. Добавить товар в корзину (любой)\n2. Применить промокод \"SPRING2026\"\n3. Нажать \"Оплатить\"\n4. Ожидание: переход на страницу оплаты\n5. Реальность: ошибка 500, белый экран\n\nОкружение: Production\nБраузер: Chrome 124, Safari 18\nЧастота: воспроизводится у всех (100%)\nПриоритет: P1 (блокирует оплату)\n\nСкриншот: [ошибка 500]\nЛоги: \"NullPointerException at OrderService.java:142\"' },
        { type: 'heading', value: 'Шаг 2: Воспроизвести локально' },
        { type: 'text', value: 'НИКОГДА не чините баг, который не можете воспроизвести. Поднимите локальное окружение, повторите шаги. Если не воспроизводится — проверьте данные (может баг только с конкретным промокодом), окружение (staging vs production), конфигурацию.' },
        { type: 'heading', value: 'Шаг 3: Локализация и дебаг' },
        { type: 'list', value: [
          'Читаем логи: NullPointerException at OrderService.java:142 — уже знаем файл и строку',
          'Ставим breakpoint в дебаггере, проходим по шагам',
          'Находим причину: метод getDiscount() возвращает null для промокодов с процентной скидкой (не обработан новый тип промокода)',
          'Проверяем git blame: кто и когда менял этот код? Был ли недавний PR?',
          'Оказывается, в Sprint 41 добавили новый тип промокода (percentage), но не обновили OrderService'
        ]},
        { type: 'heading', value: 'Шаг 4: Фикс + Тесты' },
        { type: 'code', language: 'bash', value: '# 1. Создаём ветку\ngit checkout -b fix/BUG-567-promo-code-npe\n\n# 2. СНАЧАЛА пишем тест, который воспроизводит баг (TDD)\n#    test: \"should apply percentage promo code correctly\"\n#    Тест должен ПАДАТЬ с текущим кодом\n\n# 3. Исправляем код\n#    OrderService.getDiscount() — добавляем обработку percentage type\n\n# 4. Запускаем тест — теперь проходит\n\n# 5. Запускаем ВСЕ тесты — убеждаемся, что ничего не сломали\n\n# 6. Создаём PR с описанием:\n#    - Что было: NPE при оплате с промокодом\n#    - Причина: не обработан тип промокода \"percentage\"\n#    - Фикс: добавлена обработка + unit-тест\n#    - Как тестировал: unit-тест + manual testing на staging' },
        { type: 'heading', value: 'Шаг 5: Деплой и верификация' },
        { type: 'list', value: [
          'PR одобрен → merge → деплой на staging → QA верифицирует',
          'Деплой в production (для P1 — ускоренный процесс)',
          'Мониторинг: error rate упал, 500-е ошибки исчезли',
          'Закрыть Jira-тикет, оставить комментарий с описанием причины и фикса',
          'Если баг критический — написать мини-постмортем: почему CI не поймал? Какие тесты добавить?'
        ]},
        { type: 'warning', value: 'Самая частая ошибка при баг-фиксе — не написать тест. Без теста баг ВЕРНЁТСЯ. Тест — это гарантия, что конкретно этот баг никогда не появится снова. Правило: нет теста — нет фикса.' }
      ]
    },
    {
      id: 3,
      title: 'Интеграция с внешним API — исследование → POC → реализация → мониторинг',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Интеграция — это сложнее, чем кажется' },
        { type: 'text', value: 'Интеграция с внешним API (платёжная система, SMS-провайдер, карты, CRM) — задача, которая часто недооценивается. «Просто вызвать API» — это 10% работы. Остальные 90% — обработка ошибок, retry, timeout, мониторинг, rate limiting, fallback и документация. Рассмотрим интеграцию с SMS-провайдером для отправки OTP-кодов.' },
        { type: 'heading', value: 'Шаг 1: Исследование (Research)' },
        { type: 'list', value: [
          'Изучить API-документацию провайдера (Twilio, MessageBird, локальный провайдер)',
          'Проверить: есть ли sandbox для тестирования? Какие лимиты? Какая цена?',
          'Убедиться в надёжности: SLA, uptime history, отзывы',
          'Проверить безопасность: как хранятся ключи? Есть ли IP whitelisting?',
          'Задокументировать findings и обсудить с командой'
        ]},
        { type: 'heading', value: 'Шаг 2: POC (Proof of Concept)' },
        { type: 'code', language: 'bash', value: '# POC — минимальный рабочий прототип (1-2 дня)\n# Цель: убедиться, что API работает как ожидается\n\n# 1. Создать аккаунт в sandbox провайдера\n# 2. Получить API ключи (тестовые!)\n# 3. Написать простой скрипт:\n\n# curl -X POST https://api.smsprovider.com/v1/messages \\\n#   -H \"Authorization: Bearer test_key_xxx\" \\\n#   -d \'{\n#     \"to\": \"+77001234567\",\n#     \"message\": \"Ваш код: 123456\",\n#     \"from\": \"MyApp\"\n#   }\'\n\n# 4. Проверить:\n#    - Сообщение доставлено?\n#    - Какое время доставки? (< 5 сек — ок)\n#    - Как выглядит ответ при ошибке?\n#    - Есть ли callback/webhook о статусе доставки?\n# 5. Результат POC → техническое решение (go/no-go)' },
        { type: 'heading', value: 'Шаг 3: Реализация (Production-ready)' },
        { type: 'list', value: [
          'Adapter Pattern: абстракция над провайдером. Интерфейс SmsProvider с реализациями TwilioProvider, LocalProvider. Легко сменить провайдера.',
          'Обработка ошибок: HTTP 429 (rate limit) → retry с exponential backoff. HTTP 5xx → retry 3 раза, потом fallback на второго провайдера.',
          'Timeout: максимум 5 секунд на вызов API. Если не ответил — ошибка, не висим вечно.',
          'Circuit Breaker: если провайдер упал (5 ошибок за минуту) — прекращаем вызовы на 30 секунд, потом пробуем снова.',
          'Безопасность: API-ключи в Vault/Secrets Manager, не в коде. Rate limiting на нашей стороне (макс 1 SMS в 60 секунд на номер).',
          'Логирование: каждый вызов логируется (request_id, status, latency). Без содержания SMS (PII)!',
          'Тесты: mock провайдера в unit-тестах. Integration-тесты с sandbox.'
        ]},
        { type: 'heading', value: 'Шаг 4: Мониторинг' },
        { type: 'code', language: 'text', value: 'Dashboard в Grafana:\n\n┌─────────────────────────────────────────┐\n│ SMS Provider Health                      │\n│                                          │\n│ Success Rate:  98.5%  [████████████░]    │\n│ Avg Latency:   230ms  [████░░░░░░░░]    │\n│ Sent Today:    12,456                    │\n│ Failed Today:  187                       │\n│ Budget Used:   $234 / $500               │\n│                                          │\n│ Alerts:                                  │\n│ ⚠ Success rate < 95% → PagerDuty P2     │\n│ 🔴 Success rate < 90% → PagerDuty P1     │\n│ ⚠ Latency > 3s → Slack #alerts          │\n│ 🔴 Budget > 80% → Email to PM            │\n└─────────────────────────────────────────┘' },
        { type: 'tip', value: 'Всегда планируйте fallback: что делать, если провайдер лежит? Варианты: второй провайдер (active-passive), очередь (retry позже), graceful degradation (показать пользователю «попробуйте через 5 минут»). Без fallback вы зависите от чужой инфраструктуры на 100%.' }
      ]
    },
    {
      id: 4,
      title: 'Миграция базы данных — планирование → backward compat → rolling migration',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Почему миграции БД — это сложно' },
        { type: 'text', value: 'Миграция базы данных — одна из самых рискованных операций в production. Ошибка в миграции может привести к потере данных или простою. В отличие от кода, который можно откатить за секунды (git revert), данные откатить гораздо сложнее. Миграция с 10 миллионами записей может занять часы и блокировать таблицу. Поэтому к миграциям относятся с особой осторожностью.' },
        { type: 'heading', value: 'Типы миграций' },
        { type: 'list', value: [
          'Добавление столбца/таблицы — самый простой тип. Обычно безопасно, не ломает текущий код.',
          'Удаление столбца — опасно! Нельзя удалять, пока старый код ещё работает (при деплое).',
          'Переименование столбца — очень опасно. Эквивалент add + copy + delete.',
          'Изменение типа данных — рискованно. VARCHAR(50) → VARCHAR(100) — ок. INT → VARCHAR — проблема.',
          'Миграция данных — перенос данных из одной структуры в другую. Самый сложный тип.',
          'Миграция на другую СУБД — MongoDB → PostgreSQL. Проектная работа на недели/месяцы.'
        ]},
        { type: 'heading', value: 'Backward Compatibility — ключевой принцип' },
        { type: 'code', language: 'text', value: 'Проблема: Вы хотите переименовать столбец \"name\" → \"full_name\"\n\n❌ НЕПРАВИЛЬНО (один шаг, downtime):\n  1. ALTER TABLE users RENAME COLUMN name TO full_name;\n  2. Деплой нового кода\n  → Между шагами 1 и 2 старый код ломается (ищет \"name\")\n\n✅ ПРАВИЛЬНО (три шага, zero downtime):\n\n  Шаг 1 (Sprint N): Добавить новый столбец\n    ALTER TABLE users ADD COLUMN full_name VARCHAR(255);\n    -- Триггер: копировать name → full_name при каждом INSERT/UPDATE\n    -- Backfill: UPDATE users SET full_name = name WHERE full_name IS NULL;\n    -- Код: пишет в ОБА столбца, читает из full_name (с fallback на name)\n\n  Шаг 2 (Sprint N+1): Переключить код\n    -- Код: пишет только в full_name, читает из full_name\n    -- Убедиться, что все сервисы обновлены\n\n  Шаг 3 (Sprint N+2): Удалить старый столбец\n    ALTER TABLE users DROP COLUMN name;\n    -- Код: удалить все упоминания старого столбца' },
        { type: 'heading', value: 'Rolling Migration для больших таблиц' },
        { type: 'text', value: 'Миграция таблицы с 50 миллионами записей не может быть выполнена одним UPDATE — это заблокирует таблицу на часы. Решение — rolling (batch) migration: обновляем данные пакетами по 1000-10000 записей с паузами между пакетами. Инструменты: gh-ost (GitHub), pt-online-schema-change (Percona), pgrollup (PostgreSQL).' },
        { type: 'heading', value: 'Чеклист перед миграцией' },
        { type: 'list', value: [
          'Бэкап базы данных (проверьте, что бэкап восстанавливается!)',
          'Протестировать миграцию на staging с production-like данными',
          'Оценить время выполнения: запустите EXPLAIN на staging',
          'Проверить backward compatibility: старый код работает с новой схемой?',
          'Подготовить rollback скрипт: что делать, если миграция сломалась?',
          'Согласовать окно миграции с командой (если нужен downtime)',
          'Мониторинг: CPU, disk I/O, lock wait time базы данных во время миграции'
        ]},
        { type: 'warning', value: 'НИКОГДА не запускайте непротестированную миграцию на production. Даже «простой» ALTER TABLE может заблокировать таблицу на минуты. Всегда тестируйте на staging с объёмом данных, близким к production.' }
      ]
    },
    {
      id: 5,
      title: 'Срочный hotfix в пятницу вечером — инцидент → фикс → деплой → постмортем',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Пятница, 18:47. Телефон вибрирует.' },
        { type: 'text', value: 'Вы уже собрались уходить. Вдруг — алерт в PagerDuty: «P1: Payment Service — Error Rate > 15%, affected users > 5000». Slack-канал #incidents взрывается. Вы — дежурный инженер (on-call). Это ваш инцидент. Рассмотрим полный сценарий от звонка до постмортема.' },
        { type: 'heading', value: 'Минуты 0-5: Подтверждение и оценка' },
        { type: 'code', language: 'text', value: '18:47 — PagerDuty: 🔴 P1 ALERT: payment-service error rate 15.3%\n\n18:48 — Вы в Slack #incidents:\n  @here Я взял инцидент INC-892. Начинаю разбор.\n  Статус: Investigating\n  Impact: Пользователи не могут оплатить заказы\n  Affected: payment-service\n\n18:49 — Проверяем дашборд Grafana:\n  Error rate: 15% и растёт (обычно < 0.1%)\n  Latency P99: 12s (обычно 200ms)\n  Последний деплой: 17:30 (1.5 часа назад) ← ПОДОЗРИТЕЛЬНО\n\n18:50 — Проверяем логи (Kibana/Datadog):\n  \"Connection refused: payment-provider-api.com:443\"\n  \"Timeout after 30000ms\"\n  → Внешний платёжный провайдер не отвечает!' },
        { type: 'heading', value: 'Минуты 5-15: Mitigation (остановить кровотечение)' },
        { type: 'list', value: [
          'Первый приоритет — ОСТАНОВИТЬ потери, а не найти причину.',
          'Вариант 1: Откатить последний деплой (если проблема в нашем коде).',
          'Вариант 2: Включить feature flag для fallback на второго провайдера.',
          'Вариант 3: Показать пользователям сообщение «Оплата временно недоступна, попробуйте через 15 минут».',
          'В нашем случае: включаем fallback провайдера через feature flag. Error rate падает с 15% до 0.5% за 2 минуты.'
        ]},
        { type: 'heading', value: 'Минуты 15-60: Фикс и стабилизация' },
        { type: 'code', language: 'text', value: '19:05 — Slack #incidents:\n  Mitigation applied. Включён fallback провайдер.\n  Error rate: 0.5% (норма). Пользователи могут платить.\n  Статус: Mitigated\n\n19:10 — Root Cause Analysis:\n  Основной провайдер (PaymentCorp) лежит.\n  Проверяем их status page: \"Investigating elevated error rates\"\n  Проблема на их стороне, не в нашем коде.\n  НО: наш circuit breaker не сработал!\n  Таймаут был 30 секунд — слишком долго.\n\n19:20 — Hotfix:\n  - Уменьшить таймаут с 30s до 5s\n  - Исправить circuit breaker (порог: 5 ошибок за 30 сек → открытие)\n  - Ускоренный PR → review от Tech Lead (в Slack) → merge → deploy\n\n19:45 — Slack #incidents:\n  Hotfix задеплоен. Circuit breaker теперь работает.\n  Основной провайдер восстановился. Переключаемся обратно.\n  Error rate: 0.02%. Всё нормально.\n  Статус: Resolved' },
        { type: 'heading', value: 'Понедельник: Постмортем' },
        { type: 'code', language: 'text', value: 'POSTMORTEM: INC-892 — Payment Service Outage\n\nDuration: 18 минут (18:47 — 19:05)\nImpact: ~5,200 пользователей не смогли оплатить заказ\nEstimated Revenue Loss: ~$8,500\n\nTimeline:\n  17:30 — Деплой (не связан с инцидентом)\n  18:47 — Алерт: error rate > 15%\n  18:50 — Причина найдена: внешний провайдер недоступен\n  19:02 — Mitigation: включён fallback провайдер\n  19:05 — Error rate в норме\n  19:45 — Hotfix задеплоен (circuit breaker, timeout)\n  20:00 — Инцидент закрыт\n\nRoot Cause: Внешний платёжный провайдер (PaymentCorp) испытывал\n  outage. Наш circuit breaker не сработал из-за слишком\n  высокого порога (50 ошибок за 5 мин, а нужно 5 за 30 сек).\n\nAction Items:\n  1. [P1] Уменьшить таймаут до 5 сек — DONE\n  2. [P1] Исправить порог circuit breaker — DONE\n  3. [P2] Добавить автоматическое переключение на fallback — 2 недели\n  4. [P2] Нагрузочное тестирование fallback сценария — 1 неделя\n  5. [P3] Alarm при деградации внешних провайдеров — 2 недели' },
        { type: 'tip', value: 'Главное правило on-call: сначала МИТИГИРУЙ, потом разбирайся. Не тратьте 30 минут на поиск root cause, пока пользователи страдают. Откатите, включите fallback, покажите заглушку — а потом спокойно ищите причину.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Полная симуляция рабочего дня разработчика',
      type: 'practice',
      difficulty: 'hard',
      description: 'Смоделируйте полный рабочий день middle-разработчика в продуктовой компании: от утреннего стендапа до вечернего PR. Создайте реалистичный таймлайн дня с конкретными задачами, сообщениями в Slack, Jira-тикетами, code review и неожиданными событиями.',
      requirements: [
        'Создайте объект developer с полями: name, role, team, currentSprint, jiraBoard',
        'Создайте массив dayTimeline с 10+ событиями рабочего дня, каждое с полями: time, type (standup/coding/review/meeting/slack/incident/break), title, description, duration (минуты)',
        'Создайте массив slackMessages с 5+ реалистичными сообщениями (от коллег, ботов, менеджера)',
        'Создайте функцию simulateDay(), которая выводит весь день по порядку с временными метками',
        'Создайте функцию calculateTimeBreakdown(), которая считает, сколько времени ушло на кодинг, митинги, ревью и т.д.',
        'Создайте функцию getDayProductivity(), которая оценивает продуктивность дня по метрикам'
      ],
      hint: 'Реалистичный день содержит не только кодинг: стендап, code review, неожиданный баг, вопрос от junior, обеденный перерыв, встреча с PM, разбор Slack-уведомлений. Продуктивность можно оценить по: количеству завершённых задач, строк написанного кода, времени на deep work vs interruptions.',
      expectedOutput: '=== РАБОЧИЙ ДЕНЬ: Арсен Ким, Middle Backend Developer ===\nКоманда: Platform Payments | Sprint 42 | Доска: PAY-board\n\n09:00 [standup] Daily Standup (15 мин)\n  Вчера: закончил API для адресов доставки (SHOP-1234)\n  Сегодня: начну интеграцию с SMS-провайдером (SHOP-1301)\n  Блокеры: жду API ключи от DevOps\n\n09:15 [slack] Сообщение от QA Сергея:\n  \"Арсен, в SHOP-1234 нашёл баг: при пустом индексе 500 ошибка\"\n\n09:20 [coding] Баг-фикс SHOP-1234 (40 мин)\n  Добавил валидацию zip_code, написал тест, создал PR\n...\n\n=== BREAKDOWN ВРЕМЕНИ ===\nКодинг: 4ч 20мин (54%)\nМитинги: 1ч 30мин (19%)\nCode Review: 45мин (9%)\n...\n\n=== ПРОДУКТИВНОСТЬ ===\nЗавершённые задачи: 2\nPR создано: 3\nPR отревьюено: 2\nDeep Work время: 3ч 15мин\nОценка: Хороший продуктивный день',
      solution: `const developer = {
  name: 'Арсен Ким',
  role: 'Middle Backend Developer',
  team: 'Platform Payments',
  currentSprint: 'Sprint 42',
  jiraBoard: 'PAY-board'
};

const dayTimeline = [
  {
    time: '09:00',
    type: 'standup',
    title: 'Daily Standup',
    description: 'Вчера: закончил API для адресов доставки (SHOP-1234). Сегодня: начну интеграцию с SMS-провайдером (SHOP-1301). Блокеры: жду API ключи от DevOps.',
    duration: 15
  },
  {
    time: '09:15',
    type: 'slack',
    title: 'Баг от QA',
    description: 'QA Сергей нашёл баг в SHOP-1234: при пустом индексе возвращается 500 вместо 400. Нужно добавить валидацию.',
    duration: 5
  },
  {
    time: '09:20',
    type: 'coding',
    title: 'Баг-фикс SHOP-1234: валидация zip_code',
    description: 'Добавил валидацию поля zip_code в AddressService: проверка на null, пустую строку и формат (6 цифр). Написал 3 unit-теста. Создал PR fix/SHOP-1234-zip-validation.',
    duration: 40
  },
  {
    time: '10:00',
    type: 'review',
    title: 'Code Review: PR от Дамира (SHOP-1298)',
    description: 'Ревью PR для новой фичи корзины. Нашёл: отсутствие обработки concurrent modification (два пользователя редактируют одну корзину), неоптимальный SQL запрос (N+1). Оставил 4 комментария с предложениями.',
    duration: 30
  },
  {
    time: '10:30',
    type: 'coding',
    title: 'Интеграция SMS-провайдера (SHOP-1301)',
    description: 'Начал реализацию: создал интерфейс SmsProvider, реализацию TwilioSmsProvider. Настроил adapter pattern. Написал конфигурацию для sandbox окружения.',
    duration: 90
  },
  {
    time: '12:00',
    type: 'break',
    title: 'Обед',
    description: 'Обед с командой в столовой. Обсудили с техлидом архитектуру notification service.',
    duration: 45
  },
  {
    time: '12:45',
    type: 'slack',
    title: 'Вопрос от Junior Маши',
    description: 'Маша спрашивает: \"Как правильно обработать ситуацию, когда external API возвращает 429 (rate limit)?\" Объяснил exponential backoff, скинул ссылку на реализацию в нашем коде.',
    duration: 15
  },
  {
    time: '13:00',
    type: 'meeting',
    title: 'Backlog Refinement с PM',
    description: 'Обсуждение задач на Sprint 43: интеграция с CRM, рефакторинг order service, новый dashboard. Оценили 8 тикетов. Обсудили технический долг.',
    duration: 60
  },
  {
    time: '14:00',
    type: 'coding',
    title: 'Продолжение SHOP-1301: error handling и retry',
    description: 'Реализовал retry logic с exponential backoff (3 попытки, 1s/2s/4s). Circuit breaker: если 5 ошибок за 30 сек — circuit open на 60 сек. Написал unit-тесты для retry и circuit breaker.',
    duration: 105
  },
  {
    time: '15:45',
    type: 'incident',
    title: 'Алерт: Staging Environment Down',
    description: 'Получили алерт: staging недоступен. Проверили — оказалось, DevOps обновлял Kubernetes кластер. Написал в #devops: \"Предупреждайте заранее!\". Потеряли 10 минут на разбор.',
    duration: 15
  },
  {
    time: '16:00',
    type: 'review',
    title: 'Ревью своего PR после замечаний',
    description: 'Техлид оставил 2 замечания на PR по баг-фиксу: предложил использовать @Valid аннотацию вместо ручной валидации. Переделал, запушил, получил approve.',
    duration: 15
  },
  {
    time: '16:15',
    type: 'coding',
    title: 'Финализация SHOP-1301: integration tests',
    description: 'Написал integration тесты с WireMock (мок внешнего API). Тесты: успешная отправка, timeout, rate limit, невалидный номер. Создал PR feature/SHOP-1301-sms-integration.',
    duration: 60
  },
  {
    time: '17:15',
    type: 'slack',
    title: 'Дневной wrap-up',
    description: 'Написал в #platform-payments: \"Сегодня: пофиксил баг zip-валидации (PR merged), начал SMS интеграцию (PR на ревью). Завтра: доделаю SMS + настрою мониторинг.\" Обновил Jira.',
    duration: 15
  },
  {
    time: '17:30',
    type: 'break',
    title: 'Конец рабочего дня',
    description: 'Закрыл ноутбук. Впереди вечер.',
    duration: 0
  }
];

const slackMessages = [
  {
    time: '09:15',
    from: 'QA Сергей',
    channel: '#platform-payments',
    message: 'Арсен, в SHOP-1234 баг: POST /addresses с пустым zip_code возвращает 500 вместо 400. Приложил скриншот.'
  },
  {
    time: '10:45',
    from: 'CI Bot',
    channel: '#deployments',
    message: '✅ Build passed: fix/SHOP-1234-zip-validation (3m 42s). Coverage: 82.4% (+0.3%)'
  },
  {
    time: '12:47',
    from: 'Junior Маша',
    channel: 'DM',
    message: 'Привет! У меня вопрос: когда внешний API возвращает 429, мне просто ретраить или нужно что-то специальное?'
  },
  {
    time: '14:30',
    from: 'PM Алия',
    channel: '#platform-payments',
    message: 'Ребята, клиент просит ускорить фичу уведомлений. Можем обсудить на refinement приоритеты?'
  },
  {
    time: '15:45',
    from: 'PagerDuty Bot',
    channel: '#alerts',
    message: '⚠️ STAGING: health check failed for payment-service. Triggered 2 min ago.'
  },
  {
    time: '16:10',
    from: 'Tech Lead Дмитрий',
    channel: 'PR #342',
    message: 'Хороший фикс! Два предложения: 1) используй @Valid для валидации DTO, 2) добавь тест на граничное значение (ровно 6 цифр).'
  }
];

function simulateDay() {
  console.log('=== РАБОЧИЙ ДЕНЬ: ' + developer.name + ', ' + developer.role + ' ===');
  console.log('Команда: ' + developer.team + ' | ' + developer.currentSprint + ' | Доска: ' + developer.jiraBoard);
  console.log('');

  dayTimeline.forEach(event => {
    const icon = {
      standup: '🧍',
      coding: '💻',
      review: '👀',
      meeting: '📅',
      slack: '💬',
      incident: '🚨',
      break: '☕'
    }[event.type] || '📌';

    console.log(event.time + ' [' + event.type + '] ' + icon + ' ' + event.title + (event.duration > 0 ? ' (' + event.duration + ' мин)' : ''));
    console.log('  ' + event.description);
    console.log('');
  });

  console.log('--- Slack-сообщения дня ---');
  slackMessages.forEach(msg => {
    console.log(msg.time + ' ' + msg.from + ' (' + msg.channel + '): ' + msg.message);
  });
}

function calculateTimeBreakdown() {
  const breakdown = {};
  let totalMinutes = 0;

  dayTimeline.forEach(event => {
    if (!breakdown[event.type]) breakdown[event.type] = 0;
    breakdown[event.type] += event.duration;
    totalMinutes += event.duration;
  });

  const labels = {
    standup: 'Стендап',
    coding: 'Кодинг',
    review: 'Code Review',
    meeting: 'Митинги',
    slack: 'Коммуникация (Slack)',
    incident: 'Инциденты',
    break: 'Перерывы'
  };

  console.log('\\n=== BREAKDOWN ВРЕМЕНИ ===');
  for (const [type, minutes] of Object.entries(breakdown)) {
    if (minutes > 0) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeStr = hours > 0 ? hours + 'ч ' + mins + 'мин' : mins + 'мин';
      const percent = Math.round((minutes / totalMinutes) * 100);
      const label = labels[type] || type;
      console.log(label + ': ' + timeStr + ' (' + percent + '%)');
    }
  }
  console.log('Итого рабочий день: ' + Math.floor(totalMinutes / 60) + 'ч ' + (totalMinutes % 60) + 'мин');

  return breakdown;
}

function getDayProductivity() {
  const breakdown = {};
  dayTimeline.forEach(event => {
    if (!breakdown[event.type]) breakdown[event.type] = 0;
    breakdown[event.type] += event.duration;
  });

  const codingTime = breakdown['coding'] || 0;
  const reviewTime = breakdown['review'] || 0;
  const meetingTime = (breakdown['meeting'] || 0) + (breakdown['standup'] || 0);
  const interruptionTime = (breakdown['slack'] || 0) + (breakdown['incident'] || 0);

  const deepWorkTime = codingTime;
  const prsCreated = 3;
  const prsReviewed = 2;
  const tasksCompleted = 2;
  const bugsFixed = 1;

  console.log('\\n=== ПРОДУКТИВНОСТЬ ===');
  console.log('Завершённые задачи: ' + tasksCompleted);
  console.log('Баги исправлены: ' + bugsFixed);
  console.log('PR создано: ' + prsCreated);
  console.log('PR отревьюено: ' + prsReviewed);
  console.log('Deep Work время: ' + Math.floor(deepWorkTime / 60) + 'ч ' + (deepWorkTime % 60) + 'мин');
  console.log('Время на митинги: ' + Math.floor(meetingTime / 60) + 'ч ' + (meetingTime % 60) + 'мин');
  console.log('Прерывания: ' + interruptionTime + 'мин');

  const deepWorkPercent = Math.round((deepWorkTime / (deepWorkTime + meetingTime + interruptionTime + reviewTime)) * 100);

  let rating;
  if (deepWorkPercent >= 50 && tasksCompleted >= 2) {
    rating = 'Отличный продуктивный день! Deep work > 50%, завершены задачи.';
  } else if (deepWorkPercent >= 30) {
    rating = 'Хороший день. Можно улучшить: сократить митинги или объединить.';
  } else {
    rating = 'День с высокой фрагментацией. Много прерываний, мало deep work.';
  }

  console.log('\\nDeep Work доля: ' + deepWorkPercent + '%');
  console.log('Оценка: ' + rating);
}

simulateDay();
calculateTimeBreakdown();
getDayProductivity();`,
      explanation: 'В этой практике мы смоделировали реалистичный рабочий день разработчика. Ключевые наблюдения: разработчик тратит на кодинг только 50-60% рабочего дня — остальное это коммуникация, митинги, ревью и прерывания. Deep work (непрерывный кодинг) — самый ценный ресурс, и его нужно защищать. Рабочий день включает незапланированные события (баги от QA, вопросы от junior, алерты), и умение переключаться между контекстами — важный навык. Ежедневный wrap-up в Slack и обновление Jira — не бюрократия, а профессиональная коммуникация, которая делает вашу работу видимой для команды.'
    }
  ]
}
