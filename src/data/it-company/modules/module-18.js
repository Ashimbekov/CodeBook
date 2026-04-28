export default {
  id: 18,
  title: 'Деплой и релизы',
  description: 'Как код превращается в работающий сервис: стратегии деплоя, версионирование, hotfix, rollback и релиз-менеджмент.',
  lessons: [
    {
      id: 1,
      title: 'Что такое деплой — от кода до работающего сервиса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деплой (deployment) — процесс доставки нового кода на серверы, где его увидят пользователи. Звучит просто, но за этим стоит цепочка действий: сборка, тестирование, публикация артефактов, обновление серверов, проверка здоровья, переключение трафика.' },
        { type: 'heading', value: 'Что происходит при деплое' },
        { type: 'code', language: 'bash', value: '# Полный путь кода от коммита до пользователя:\n#\n# 1. Разработчик мержит PR в main\n# 2. CI pipeline:\n#    └── lint → test → build\n# 3. Build создаёт артефакт:\n#    └── Docker image: myapp:v1.5.2\n# 4. Артефакт публикуется в registry:\n#    └── docker push registry.company.com/myapp:v1.5.2\n# 5. Деплой на серверы:\n#    └── Kubernetes: kubectl set image deployment/myapp app=myapp:v1.5.2\n# 6. Kubernetes поднимает новые контейнеры:\n#    └── Проверяет health check (readinessProbe)\n# 7. Трафик переключается на новые контейнеры\n# 8. Старые контейнеры останавливаются\n# 9. Мониторинг: проверяем error rate, latency\n# 10. Готово! Пользователи видят новую версию' },
        { type: 'heading', value: 'Артефакты деплоя' },
        { type: 'list', value: [
          'Docker image — самый распространённый формат, содержит код + зависимости + runtime',
          'JAR/WAR файл — для Java-приложений (Spring Boot → fat JAR)',
          'Static files — для фронтенда (build → index.html + JS/CSS → CDN)',
          'Lambda package — ZIP с кодом для serverless (AWS Lambda, GCP Functions)',
          'Mobile build — APK/IPA для мобильных приложений (через App Store/Play Store)'
        ] },
        { type: 'heading', value: 'Даунтайм при деплое' },
        { type: 'text', value: 'Главный вопрос деплоя — будет ли даунтайм? Простейший деплой: остановить сервер → обновить код → запустить сервер. Это даёт даунтайм от 10 секунд до нескольких минут. Современные стратегии деплоя позволяют обновляться с нулевым даунтаймом.' },
        { type: 'code', language: 'bash', value: '# Наивный деплой (с даунтаймом):\nssh production-server\ncd /app\ngit pull origin main\nnpm install\nnpm run build\npm2 restart all\n# Даунтайм: 30 секунд - 2 минуты\n# Пользователи видят: "502 Bad Gateway"\n\n# Деплой без даунтайма (zero-downtime):\n# Нужно минимум 2 сервера\n# 1. Поднять новую версию на сервере 2\n# 2. Проверить health check\n# 3. Переключить трафик на сервер 2\n# 4. Остановить старую версию на сервере 1\n# Пользователи: ничего не заметили' },
        { type: 'tip', value: 'Для фронтенд-приложений деплой проще: собрать статику (npm run build), загрузить на CDN (Cloudflare, AWS CloudFront), обновить ссылки. CDN сам раздаёт файлы по всему миру. Это занимает секунды и не имеет даунтайма.' },
        { type: 'note', value: 'В крупных компаниях деплой полностью автоматизирован. В Netflix деплой одного микросервиса занимает 16 минут от мёржа до продакшена. Человеку нужно только нажать Approve.' }
      ]
    },
    {
      id: 2,
      title: 'Стратегии деплоя — Blue-Green, Canary, Rolling',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько стратегий деплоя, каждая с разным балансом между скоростью, безопасностью и стоимостью инфраструктуры. Выбор зависит от требований к даунтайму, количества серверов и уровня риска.' },
        { type: 'heading', value: 'Rolling Update — постепенная замена' },
        { type: 'code', language: 'bash', value: '# Rolling Update: обновляем серверы по одному\n# У нас 4 сервера с версией v1\n#\n# Шаг 1: [v2] [v1] [v1] [v1]  — обновили 1-й сервер\n# Шаг 2: [v2] [v2] [v1] [v1]  — обновили 2-й\n# Шаг 3: [v2] [v2] [v2] [v1]  — обновили 3-й\n# Шаг 4: [v2] [v2] [v2] [v2]  — все обновлены\n#\n# Плюсы:\n#   + Нет даунтайма\n#   + Не нужны дополнительные серверы\n#   + Стандарт в Kubernetes\n# Минусы:\n#   - Во время обновления работают 2 версии одновременно\n#   - Если v2 сломана — нужно откатывать серверы обратно\n#   - Пользователи могут видеть разное поведение\n\n# Kubernetes Rolling Update:\napiVersion: apps/v1\nkind: Deployment\nspec:\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1          # Макс. 1 дополнительный pod\n      maxUnavailable: 0    # Все текущие должны работать' },
        { type: 'heading', value: 'Blue-Green Deployment — два идентичных окружения' },
        { type: 'code', language: 'bash', value: '# Blue-Green: два полных окружения, трафик переключается мгновенно\n#\n# Blue (текущий, v1):  [v1] [v1] [v1] [v1]  ← трафик идёт сюда\n# Green (новый, v2):   [v2] [v2] [v2] [v2]  ← подготовлен, протестирован\n#\n# Переключение: Load Balancer переключает трафик Blue → Green\n#\n# Blue (старый, v1):   [v1] [v1] [v1] [v1]  ← остаётся для rollback\n# Green (текущий, v2): [v2] [v2] [v2] [v2]  ← трафик идёт сюда\n#\n# Плюсы:\n#   + Мгновенное переключение (секунды)\n#   + Мгновенный rollback (переключить обратно на Blue)\n#   + Нет смешивания версий\n# Минусы:\n#   - Двойная стоимость инфраструктуры\n#   - Сложность с БД (обе версии должны работать с одной схемой)\n#\n# Пример переключения через nginx:\n# upstream backend { server green-cluster:8080; }\n# nginx -s reload' },
        { type: 'heading', value: 'Canary Deployment — осторожное раскатывание' },
        { type: 'code', language: 'bash', value: '# Canary: новая версия сначала получает малый % трафика\n# Как канарейка в шахте — первая почувствует опасность\n#\n# Этап 1: 5% трафика на v2\n#   [v1] [v1] [v1] [v1] ← 95% трафика\n#   [v2]                ← 5% трафика (canary)\n#   Наблюдаем 15 минут: error rate, latency, CPU\n#\n# Этап 2: 25% трафика на v2\n#   [v1] [v1] [v1] ← 75% трафика\n#   [v2]           ← 25% трафика\n#   Наблюдаем 30 минут\n#\n# Этап 3: 100% трафика на v2\n#   [v2] [v2] [v2] [v2] ← 100% трафика\n#\n# Если на любом этапе проблемы → откат на v1\n#\n# Плюсы:\n#   + Минимальный риск (только 5% пользователей затронуты)\n#   + Можно сравнить метрики v1 и v2\n#   + Автоматический откат при проблемах\n# Минусы:\n#   - Медленный (полный rollout может занять часы)\n#   - Сложная инфраструктура (нужен умный load balancer)\n\n# Пример: Istio canary в Kubernetes\n# apiVersion: networking.istio.io/v1alpha3\n# kind: VirtualService\n# spec:\n#   http:\n#   - route:\n#     - destination: { host: myapp, subset: v1 }\n#       weight: 95\n#     - destination: { host: myapp, subset: v2 }\n#       weight: 5' },
        { type: 'heading', value: 'Какую стратегию выбрать' },
        { type: 'list', value: [
          'Rolling Update — стандарт для большинства проектов, бесплатно в Kubernetes',
          'Blue-Green — когда нужен мгновенный rollback и бюджет позволяет двойную инфраструктуру',
          'Canary — для высоконагруженных сервисов, где ошибка стоит дорого (платежи, поиск)',
          'Recreate (остановить всё → обновить → запустить) — только для dev-окружений или batch-сервисов'
        ] },
        { type: 'tip', value: 'В реальности компании комбинируют стратегии. Например: Canary для backend API (важно проверить под нагрузкой) и Blue-Green для фронтенда (быстрое переключение через CDN).' }
      ]
    },
    {
      id: 3,
      title: 'Релиз-менеджмент — версионирование (SemVer), changelog',
      type: 'theory',
      content: [
        { type: 'text', value: 'Релиз — это не просто деплой. Это пакет изменений с версией, описанием и историей. Релиз-менеджмент — процесс подготовки, координации и доставки релиза. Для библиотек и API версионирование критично, для веб-приложений — желательно.' },
        { type: 'heading', value: 'Semantic Versioning (SemVer)' },
        { type: 'code', language: 'bash', value: '# SemVer: MAJOR.MINOR.PATCH\n# Пример: 2.4.1\n#\n# MAJOR (2) — несовместимые изменения API\n#   Пример: убрали endpoint, изменили формат ответа\n#   1.9.0 → 2.0.0\n#\n# MINOR (4) — новая функциональность, обратно совместима\n#   Пример: добавили новый endpoint, новый параметр\n#   2.3.0 → 2.4.0\n#\n# PATCH (1) — исправления багов, обратно совместимо\n#   Пример: починили null pointer, исправили опечатку\n#   2.4.0 → 2.4.1\n#\n# Примеры из реальной жизни:\n# React 17.0.2 → 18.0.0 — major (новый concurrent mode)\n# Node.js 20.10.0 → 20.11.0 — minor (новые API)\n# Express 4.18.1 → 4.18.2 — patch (баг-фикс)\n\n# Pre-release версии:\n# 2.0.0-alpha.1    — ранняя версия для тестирования\n# 2.0.0-beta.3     — более стабильная, для внешних тестеров\n# 2.0.0-rc.1       — release candidate, почти готов' },
        { type: 'heading', value: 'Git tags и GitHub Releases' },
        { type: 'code', language: 'bash', value: '# Создание тега для релиза:\ngit tag -a v2.4.1 -m "Release 2.4.1: fix payment timeout"\ngit push origin v2.4.1\n\n# Создание GitHub Release через CLI:\ngh release create v2.4.1 \\\n  --title "v2.4.1" \\\n  --notes "## Bug Fixes\n- Fixed payment timeout on slow connections (#234)\n- Fixed incorrect tax calculation for EU countries (#241)\n\n## Internal\n- Upgraded stripe-sdk from 12.0 to 12.1"\n\n# Автоматический release из CI:\n# При пуше тега v* → CI собирает и деплоит\non:\n  push:\n    tags:\n      - "v*"' },
        { type: 'heading', value: 'Changelog — история изменений' },
        { type: 'code', language: 'bash', value: '# CHANGELOG.md — документ с историей всех релизов\n# Формат: Keep a Changelog (keepachangelog.com)\n\n# ## [2.4.1] - 2024-03-15\n# ### Fixed\n# - Payment timeout на медленных соединениях (#234)\n# - Неправильный расчёт налога для стран ЕС (#241)\n#\n# ## [2.4.0] - 2024-03-01\n# ### Added\n# - Экспорт заказов в CSV (#220)\n# - Фильтр по дате в списке заказов (#218)\n# ### Changed\n# - Обновлён дизайн страницы профиля (#225)\n# ### Deprecated\n# - API endpoint /api/v1/users (используйте /api/v2/users)\n\n# Автоматическая генерация changelog из коммитов:\n# Conventional Commits: feat:, fix:, docs:, chore:\n# Инструменты: standard-version, release-please, semantic-release\nnpx standard-version            # Автоматически обновляет CHANGELOG.md\nnpx standard-version --dry-run  # Показать что будет, без изменений' },
        { type: 'tip', value: 'Используйте Conventional Commits (feat:, fix:, chore:) для коммитов. Тогда инструменты типа semantic-release автоматически определят номер версии и сгенерируют changelog. Никакой ручной работы.' },
        { type: 'note', value: 'Для внутренних веб-приложений (не библиотек) многие команды используют дату вместо SemVer: 2024.03.15.1 — первый релиз 15 марта. Это проще и понятнее для бизнеса.' }
      ]
    },
    {
      id: 4,
      title: 'Hotfix — экстренные исправления в продакшене',
      type: 'theory',
      content: [
        { type: 'text', value: 'Hotfix — срочное исправление критического бага в продакшене, минуя обычный процесс релиза. Когда пользователи не могут платить, регистрироваться или видят чужие данные — нет времени ждать следующий релиз. Нужен hotfix.' },
        { type: 'heading', value: 'Когда нужен hotfix' },
        { type: 'list', value: [
          'Пользователи не могут войти в систему (сломана авторизация)',
          'Платежи не проходят (потеря денег каждую минуту)',
          'Утечка данных (пользователь видит чужие данные)',
          'Сервис полностью недоступен (500 ошибки)',
          'Критическая уязвимость безопасности (CVE)',
          'НЕ hotfix: кнопка не того цвета, опечатка в тексте, медленная загрузка (если не критично)'
        ] },
        { type: 'heading', value: 'Процесс hotfix' },
        { type: 'code', language: 'bash', value: '# 1. Создаём ветку от main (не от develop!)\ngit checkout main\ngit pull origin main\ngit checkout -b hotfix/fix-payment-crash\n\n# 2. Минимальное исправление\n# Не рефакторим, не добавляем фичи\n# Чиним только конкретный баг\n# Чем меньше изменений — тем меньше риск\n\n# 3. Тестируем локально\nnpm test\n# Проверяем конкретный сценарий вручную\n\n# 4. Создаём PR с пометкой HOTFIX\n# PR title: "[HOTFIX] Fix payment crash on null address"\n# Reviewer: тимлид или senior (один человек, не двое)\n# Review за 5-10 минут, не за день\n\n# 5. Мёрж и деплой\ngit checkout main\ngit merge hotfix/fix-payment-crash\ngit tag -a v2.4.2 -m "Hotfix: fix payment crash"\ngit push origin main --tags\n# CI/CD: lint → test → build → deploy (ускоренный pipeline)\n\n# 6. Бэкпорт в develop\ngit checkout develop\ngit merge hotfix/fix-payment-crash\ngit push origin develop\n\n# 7. Постмортем\n# Через 1-2 дня: почему это случилось? Как предотвратить?' },
        { type: 'heading', value: 'Правила hotfix' },
        { type: 'list', value: [
          'Минимальные изменения — только исправление бага, ничего больше',
          'Быстрый review — один ревьюер, приоритет над другими PR',
          'Обязательное тестирование — даже в спешке, прогнать CI',
          'Уведомить команду — Slack: "Деплоим hotfix для payment crash"',
          'Бэкпорт в develop — иначе при следующем релизе баг вернётся',
          'Постмортем — через 1-2 дня разобрать причину и добавить тесты'
        ] },
        { type: 'warning', value: 'Hotfix в пятницу вечером — двойной риск. Если можно подождать до понедельника (баг не критичный) — подождите. Если нельзя — убедитесь, что кто-то будет мониторить систему после деплоя.' },
        { type: 'tip', value: 'Заранее создайте шаблон PR для hotfix с чек-листом: причина, затронутые пользователи, тест-план, план отката. В стрессовой ситуации чек-лист спасает от ошибок.' }
      ]
    },
    {
      id: 5,
      title: 'Rollback — откат при проблемах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rollback (откат) — возврат к предыдущей рабочей версии приложения. Это план Б на случай, если деплой пошёл не так. Хороший rollback занимает секунды-минуты. Плохой — часы с ручным вмешательством.' },
        { type: 'heading', value: 'Когда делать rollback' },
        { type: 'list', value: [
          'Резкий рост ошибок (error rate вырос с 0.1% до 5%)',
          'Значительное увеличение времени ответа (latency с 200ms до 2s)',
          'Пользователи жалуются массово (поток обращений в поддержку)',
          'Критический баг, который нельзя починить за 15 минут',
          'Правило: если через 15 минут после деплоя проблема не решена — откатывай'
        ] },
        { type: 'heading', value: 'Способы отката' },
        { type: 'code', language: 'bash', value: '# 1. Kubernetes rollback (самый быстрый — секунды)\nkubectl rollout undo deployment/myapp\n# Kubernetes вернёт предыдущий ReplicaSet\n# Трафик переключится на старые pods\n\n# Откат к конкретной версии:\nkubectl rollout history deployment/myapp\nkubectl rollout undo deployment/myapp --to-revision=3\n\n# 2. Docker: запуск предыдущего образа\n# Текущий: myapp:v2.5.0 (сломан)\n# Предыдущий: myapp:v2.4.1 (рабочий)\nkubectl set image deployment/myapp app=myapp:v2.4.1\n\n# 3. Blue-Green: переключить трафик обратно\n# Green (v2.5.0, сломан) ← трафик\n# Blue (v2.4.1, рабочий)\n# Переключаем: трафик → Blue\n# Время: 5 секунд\n\n# 4. Git revert (для следующего деплоя)\ngit revert HEAD    # Создаёт коммит, отменяющий последний\ngit push origin main\n# CI/CD пересоберёт и задеплоит' },
        { type: 'heading', value: 'Проблемы при откате' },
        { type: 'code', language: 'bash', value: '# Главная проблема: миграции базы данных\n#\n# Сценарий:\n# v2.4.1: таблица users (id, name, email)\n# v2.5.0: миграция ADD COLUMN phone\n#         таблица users (id, name, email, phone)\n#\n# Деплой v2.5.0: ✅ миграция применена, phone добавлен\n# Проблема обнаружена → rollback к v2.4.1\n# Код v2.4.1 не знает про phone → но phone в БД есть\n#\n# Решения:\n# 1. Forward-compatible код: v2.4.1 должен работать с лишними полями\n#    → SELECT id, name, email FROM users (не SELECT *)\n#\n# 2. Миграции отдельно от кода:\n#    → Сначала миграция (добавить phone)\n#    → Через день: код, который использует phone\n#    → Rollback кода не затрагивает БД\n#\n# 3. Down-миграции (откат схемы):\n#    → npx prisma migrate resolve (пометить как откаченную)\n#    → Но! Если в phone уже есть данные — потеряем их\n\n# ВАЖНО: не все миграции можно откатить\n# DROP COLUMN — данные потеряны навсегда\n# Поэтому: expand-and-contract, не удаляй сразу' },
        { type: 'heading', value: 'Чек-лист перед деплоем' },
        { type: 'list', value: [
          'Есть ли рабочий образ предыдущей версии для отката?',
          'Совместима ли миграция с предыдущей версией кода?',
          'Кто будет мониторить после деплоя (10-15 минут)?',
          'Есть ли время для отката (не деплоить за 5 минут до конца дня)?',
          'Оповещена ли команда поддержки о деплое?'
        ] },
        { type: 'tip', value: 'Практикуйте rollback заранее! Раз в месяц делайте учебный откат на staging. Если вы ни разу не откатывались — в реальной аварии вы потеряете драгоценные минуты.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Выбрать стратегию деплоя и план отката',
      type: 'practice',
      difficulty: 'hard',
      description: 'Вы — senior-разработчик в финтех-компании. Ваше приложение обрабатывает платежи (10 000 транзакций в день). Нужно выбрать стратегию деплоя и составить план отката для следующего релиза, который включает миграцию базы данных.',
      requirements: [
        'Выбрать и обосновать стратегию деплоя для финтех-приложения',
        'Описать пошаговый процесс деплоя нового релиза',
        'Описать миграцию БД (добавление новой таблицы и колонки)',
        'Составить план отката с учётом миграции',
        'Определить критерии для принятия решения об откате',
        'Описать процесс hotfix для платёжного сервиса'
      ],
      hint: 'Для финтех-приложения важна безопасность: Canary deployment (5% → 25% → 100%), миграции в стиле expand-and-contract, мониторинг error rate и success rate платежей, автоматический rollback при росте ошибок.',
      expectedOutput: 'Стратегия: Canary Deployment (5% → 25% → 50% → 100%)\nОбоснование: минимальный риск для платёжного сервиса\n\nПроцесс деплоя:\n1. Миграция БД (expand): ADD TABLE payment_methods, ADD COLUMN\n2. Canary 5%: 15 минут мониторинг\n3. Canary 25%: 30 минут мониторинг\n4. Full rollout: 100%\n5. Через 2 недели: cleanup (удалить старые колонки)\n\nКритерии отката:\n- Error rate > 1% (обычно 0.1%)\n- Payment success rate < 98% (обычно 99.5%)\n- Latency p99 > 3s (обычно 500ms)\n\nОткат: kubectl rollout undo (код), БД не откатываем (expand-only)',
      solution: '# Стратегия деплоя для финтех-приложения\n\n# 1. СТРАТЕГИЯ: Canary Deployment\n# Обоснование:\n#   - Платежи = деньги пользователей, ошибка стоит дорого\n#   - Canary минимизирует blast radius (5% пользователей)\n#   - Позволяет сравнить метрики v1 vs v2 в реальном трафике\n#   - Автоматический rollback при аномалиях\n\n# 2. ПРОЦЕСС ДЕПЛОЯ\n# День 0 (подготовка):\n#   - Code freeze: никаких мёржей в main за 2 часа до деплоя\n#   - Оповестить команду поддержки\n#   - Проверить, что staging прошёл QA\n#\n# Шаг 1: Миграция БД (отдельно от кода)\n#   - CREATE TABLE payment_methods (...)\n#   - ALTER TABLE payments ADD COLUMN method_id INTEGER\n#   - Миграция forward-compatible: старый код работает без method_id\n#\n# Шаг 2: Canary 5% (15 минут)\n#   - kubectl apply -f canary-5-percent.yaml\n#   - Мониторинг: error rate, payment success rate, latency\n#   - Если OK → шаг 3. Если нет → rollback\n#\n# Шаг 3: Canary 25% (30 минут)\n#   - kubectl apply -f canary-25-percent.yaml\n#   - Мониторинг те же метрики\n#\n# Шаг 4: Canary 50% (30 минут)\n#   - kubectl apply -f canary-50-percent.yaml\n#\n# Шаг 5: Full rollout 100%\n#   - kubectl apply -f production-v2.yaml\n#   - Мониторинг ещё 1 час\n\n# 3. КРИТЕРИИ ОТКАТА (автоматические)\n# - Error rate > 1% (baseline: 0.1%)\n# - Payment success rate < 98% (baseline: 99.5%)\n# - Latency p99 > 3 секунды (baseline: 500ms)\n# - Любой 5xx на /api/payments\n# → Автоматический rollback через Argo Rollouts\n\n# 4. ПЛАН ОТКАТА\n# Код: kubectl rollout undo deployment/payment-service\n# БД: НЕ откатываем! Миграция expand-only:\n#   - Новая таблица payment_methods останется\n#   - Колонка method_id останется (nullable)\n#   - Старый код их просто не использует\n# Через 2 недели после успешного релиза:\n#   - Cleanup миграция: удалить неиспользуемые колонки\n\n# 5. HOTFIX ПРОЦЕСС\n# 1. Инцидент: "Платежи не проходят"\n# 2. On-call получает PagerDuty алерт\n# 3. Решение за 5 минут: rollback или hotfix?\n#    - Если причина ясна и fix < 15 минут → hotfix\n#    - Если непонятно → rollback немедленно\n# 4. Hotfix: ветка от main, один ревьюер, ускоренный pipeline\n# 5. Деплой hotfix через canary 25% → 100% (сокращённый)\n# 6. Постмортем через 48 часов',
      explanation: 'Canary Deployment — лучший выбор для финтех-приложения, потому что позволяет проверить новую версию на малом проценте трафика и автоматически откатиться при проблемах. Expand-and-contract для миграций БД гарантирует, что откат кода не сломает базу данных. Автоматические критерии отката (error rate, success rate, latency) убирают человеческий фактор — система сама решает, когда откатывать.'
    }
  ]
}
