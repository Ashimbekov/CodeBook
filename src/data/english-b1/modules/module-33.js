export default {
  id: 33,
  title: 'Practice: Technical Writing',
  description: 'Практика технического письма: commit messages, PR descriptions, bug reports, email и документация.',
  lessons: [
    {
      id: 1,
      title: 'Writing commit messages',
      type: 'practice',
      description: 'Напиши правильный commit message по стандарту Conventional Commits.',
      solution: 'Примеры правильных commit messages:\n1. feat(auth): add user registration endpoint\n2. fix(api): correct pagination offset calculation (Fixes #342)\n3. chore(deps): upgrade axios from 0.27 to 1.4\n\nФормат: <type>(<scope>): <description>\nТипы: feat, fix, refactor, docs, test, chore',
      content: [
        { type: 'text', value: 'Хорошие commit messages — часть профессиональной разработки. Conventional Commits — популярный стандарт.' },
        { type: 'list', items: [
          'Format: <type>(<scope>): <description>',
          'feat: новая функциональность',
          'fix: исправление бага',
          'refactor: рефакторинг без изменения функциональности',
          'docs: изменения в документации',
          'test: добавление/изменение тестов',
          'chore: технические задачи (обновление зависимостей и т.д.)'
        ]}
      ],
      tasks: [
        {
          situation: 'Ты добавил функцию регистрации пользователя.',
          badExample: 'fixed stuff',
          goodExample: 'feat(auth): add user registration endpoint\n\nAdd POST /api/users endpoint that:\n- Validates email and password format\n- Checks for duplicate email addresses\n- Hashes password with bcrypt\n- Returns JWT token on success',
          explanation: 'Хороший commit: тип, скоуп, описание в повелительном наклонении + тело с деталями.'
        },
        {
          situation: 'Исправил баг с пагинацией в API.',
          badExample: 'bug fix',
          goodExample: 'fix(api): correct pagination offset calculation\n\nThe page offset was calculated as page * limit instead of\n(page - 1) * limit, causing the first page to be skipped.\n\nFixes #342',
          explanation: 'Описывает ЧТО и ПОЧЕМУ. Ссылается на issue номер.'
        },
        {
          situation: 'Обновил версию библиотеки axios с 0.27 до 1.4.',
          goodExample: 'chore(deps): upgrade axios from 0.27 to 1.4\n\nAxios 1.x introduces breaking changes in error handling.\nUpdated error handling code in api/client.js accordingly.\n\nSee: https://axios-http.com/docs/migration_to_1_0_0',
          explanation: 'chore для обновления зависимостей. Упоминает breaking changes и ссылку на документацию по миграции.'
        }
      ]
    },
    {
      id: 2,
      title: 'Writing PR descriptions',
      type: 'practice',
      description: 'Напиши подробное описание Pull Request.',
      solution: 'Структура хорошего PR description:\n## Summary — что изменилось и зачем\n## Changes — bullet points с изменениями\n## Testing — чеклист тестирования\n## Notes — важные решения и контекст\n\nПример для Redis caching: опиши проблему (300ms→15ms), изменения (middleware, TTL), тесты, причину выбора TTL.',
      content: [
        { type: 'text', value: 'PR description — первое, что читает ревьюер. Хорошее описание ускоряет ревью и снижает количество вопросов.' }
      ],
      template: '## Summary\n[Что изменилось и зачем]\n\n## Changes\n- [Изменение 1]\n- [Изменение 2]\n\n## Testing\n- [ ] Unit tests pass\n- [ ] Manual testing done\n- [ ] [Конкретный сценарий протестирован]\n\n## Screenshots (if applicable)\n[Скриншоты UI изменений]\n\n## Notes\n[Всё, что ревьюер должен знать]',
      tasks: [
        {
          context: 'Задача: добавить кэширование Redis для user profile endpoint',
          badDescription: 'Added caching',
          goodDescription: '## Summary\nAdd Redis caching for the GET /api/users/:id endpoint to reduce database load and improve response times.\n\nCurrently, each profile request hits the database. With 50K DAU this creates unnecessary load. Caching popular profiles reduces p99 latency from 300ms to ~15ms.\n\n## Changes\n- Add Redis client configuration in config/redis.js\n- Add cache middleware in middleware/cache.js (TTL: 5 minutes)\n- Apply middleware to GET /api/users/:id route\n- Add cache invalidation on profile update (PATCH /api/users/:id)\n\n## Testing\n- [x] Unit tests for cache middleware\n- [x] Integration tests for cache hit/miss scenarios\n- [x] Manual testing: confirmed cached responses in Redis\n- [x] Tested cache invalidation on profile update\n\n## Notes\nCache TTL is set to 5 minutes based on discussion with product team. Users can tolerate slightly stale profile data for this duration.',
          explanation: 'Хорошее описание: контекст, почему это нужно, что изменилось, как протестировано, важные решения.'
        }
      ]
    },
    {
      id: 3,
      title: 'Writing bug reports',
      type: 'practice',
      description: 'Напиши профессиональный bug report.',
      solution: 'Структура bug report:\nTitle — конкретный и описательный\nSteps to reproduce — пронумерованные шаги\nExpected behavior — что должно происходить\nActual behavior — что происходит на самом деле\nEnvironment — OS, browser, версия\nSeverity — критичность\nAttachments — скриншоты, логи',
      content: [
        { type: 'text', value: 'Хороший баг-репорт позволяет разработчику воспроизвести и исправить баг быстрее. Это искусство краткости и точности.' }
      ],
      template: '**Title**: [Action] causes [unexpected behavior] in [context]\n\n**Summary**: One-sentence description.\n\n**Steps to reproduce**:\n1. Step 1\n2. Step 2\n3. ...\n\n**Expected behavior**: What should happen.\n\n**Actual behavior**: What actually happens.\n\n**Environment**:\n- Browser/OS:\n- App version:\n\n**Additional context**: Logs, screenshots, related issues.',
      tasks: [
        {
          badReport: 'Login broken',
          goodReport: 'Title: Login with Google fails when popup is blocked\n\nSummary: Clicking "Sign in with Google" shows an error if the browser blocks the OAuth popup.\n\nSteps to reproduce:\n1. Open app in Chrome with popup blocker enabled\n2. Click "Sign in with Google" on the login page\n3. Chrome blocks the popup window\n\nExpected behavior: System detects blocked popup and shows message: "Please allow popups for this site"\n\nActual behavior: Error toast shows "Authentication failed. Please try again." with no explanation.\n\nEnvironment:\n- Chrome 119, Windows 11\n- App version: 2.4.1\n\nAdditional context: Works correctly in Firefox (shows popup warning natively). Issue reported by 3 users in the past week.',
          explanation: 'Хороший репорт: конкретный заголовок, точные шаги, четкое ожидаемое vs фактическое поведение, окружение.'
        }
      ]
    },
    {
      id: 4,
      title: 'Writing technical emails',
      type: 'practice',
      description: 'Напиши профессиональное техническое письмо (email).',
      solution: 'Структура технического email:\nSubject — конкретный и информативный\nOpening — контекст в 1-2 предложениях\nBody — основная информация\nAction items — что нужно сделать\nClosing — вежливое завершение\n\nТон: профессиональный, без жаргона для нетехнических получателей.',
      content: [
        { type: 'text', value: 'Технические email-сообщения должны быть структурированными и лаконичными. Используй структуру: context → findings → recommendation → action.' }
      ],
      tasks: [
        {
          scenario: 'Ты обнаружил критическую уязвимость безопасности. Напиши email команде.',
          sampleEmail: 'Subject: [URGENT] Security vulnerability found in authentication module\n\nHi team,\n\nI\'ve identified a critical security vulnerability in our authentication system that needs immediate attention.\n\nThe Issue:\nThe password reset endpoint (/api/auth/reset-password) accepts expired tokens without validating the expiration timestamp. This allows attackers to reuse old password reset links indefinitely.\n\nImpact:\n- Any user\'s password could be reset using a captured old reset link\n- This bypasses our intended 1-hour token expiration\n\nRecommendation:\nWe need to fix this before the next deployment. I can have a patch ready within 2 hours.\n\nTemporary mitigation: I recommend invalidating all existing reset tokens immediately.\n\nI\'ll share the fix in a PR shortly. Please let me know if you have questions.\n\nBest,\n[Your name]'
        },
        {
          scenario: 'Напиши email менеджеру, объясняя почему деплой займёт больше времени, чем планировалось.',
          sampleEmail: 'Subject: Deployment timeline update — additional 2 days needed\n\nHi [Manager name],\n\nI wanted to give you an update on the v2.5 deployment timeline.\n\nDuring final testing, we discovered a compatibility issue with the new authentication library and our legacy SSO integration. This wasn\'t caught earlier because the SSO environment wasn\'t available in staging.\n\nCurrent status:\n- Root cause identified: library version conflict\n- Solution in progress: updating integration adapter\n- Estimated fix time: 1 day\n\nRevised timeline:\n- Fix ready: Wednesday EOD\n- Testing: Thursday\n- Deployment: Friday (instead of Wednesday as originally planned)\n\nI\'ll keep you updated on progress. If you need to communicate this to stakeholders, I\'m happy to join a call.\n\nRegards,\n[Your name]'
        }
      ]
    },
    {
      id: 5,
      title: 'Writing inline code comments',
      type: 'practice',
      description: 'Напиши полезные inline комментарии к коду.',
      solution: 'Правила хороших комментариев:\n1. Объясняй ПОЧЕМУ, не ЧТО (код сам показывает что)\n2. TODO/FIXME с контекстом и именем\n3. Предупреждай о неочевидном поведении\n4. Документируй сложную логику\nПлохо: // increment i\nХорошо: // Skip first element — it\'s always the header',
      content: [
        { type: 'text', value: 'Хорошие комментарии в коде объясняют ПОЧЕМУ, а не ЧТО (код сам объясняет что). Плохой комментарий описывает очевидное.' }
      ],
      tasks: [
        {
          bad: '// increment i\ni++;',
          good: '// Track the number of retry attempts to enforce the max retry limit\nretryCount++;',
          explanation: 'Плохой комментарий: говорит то же, что и код. Хороший: объясняет назначение.'
        },
        {
          bad: '// sleep for 1 second\nawait sleep(1000);',
          good: '// Wait 1 second before retrying to avoid hammering the API\n// and respect the rate limit of 60 requests/minute\nawait sleep(1000);',
          explanation: 'Хороший комментарий объясняет почему нужна задержка и какое ограничение она учитывает.'
        },
        {
          bad: '// check if user exists\nif (user) {',
          good: '// User might be null if the session expired or was invalidated by an admin.\n// We handle both cases to avoid a NullPointerException downstream.\nif (user) {',
          explanation: 'Объясняет нетривиальный случай: почему user может быть null.'
        }
      ]
    },
    {
      id: 6,
      title: 'Writing runbook / incident response',
      type: 'practice',
      description: 'Напиши runbook для обработки production инцидента.',
      solution: 'Структура runbook:\n# Service Name — Incident Type\n## Symptoms — что видит пользователь и какие алерты\n## Diagnosis — пошаговые команды для диагностики\n## Resolution — опции A, B, C в зависимости от причины\n## Escalation — когда и к кому обращаться\n\nКлюч: конкретные команды, не абстрактные инструкции.',
      content: [
        { type: 'text', value: 'Runbook — документ с инструкциями для дежурного инженера. Он должен быть чётким и пошаговым.' }
      ],
      template: '# [Service Name] — [Incident Type] Runbook\n\n## Symptoms\n- What alerts fire?\n- What do users experience?\n\n## Diagnosis\nStep 1: Check [what]\nStep 2: Look at [what]\n\n## Resolution\nOption A: [Steps if root cause is X]\nOption B: [Steps if root cause is Y]\n\n## Escalation\nIf unresolved after 30 minutes, contact [person/team]',
      tasks: [
        {
          scenario: 'Напиши мини-runbook для случая когда база данных не отвечает.',
          sampleRunbook: '# Database — Connection Failure Runbook\n\n## Symptoms\n- Alert: "Database connection pool exhausted"\n- Users see 503 errors on data-heavy endpoints\n- Application logs show: "Connection timeout after 5000ms"\n\n## Diagnosis\nStep 1: Check database server status\n  - SSH to db-primary and run: systemctl status postgresql\nStep 2: Check connection pool metrics in Grafana dashboard\nStep 3: Check for long-running queries: SELECT * FROM pg_stat_activity WHERE duration > interval \'5 minutes\';\n\n## Resolution\nOption A: If PostgreSQL is down — restart service: systemctl restart postgresql\nOption B: If pool is exhausted — increase max_connections in postgresql.conf and reload\nOption C: If long queries detected — identify and kill problematic queries\n\n## Escalation\nIf unresolved after 20 minutes, contact DBA team via PagerDuty or Slack #on-call'
        }
      ]
    },
    {
      id: 7,
      title: 'Improve weak technical writing',
      type: 'practice',
      description: 'Улучши слабо написанные технические тексты.',
      solution: 'Критерии хорошего технического текста:\n1. Конкретность — цифры и факты вместо "плохо/хорошо"\n2. Активный залог где возможно\n3. Короткие предложения\n4. Структура: проблема → решение → результат\n5. Избегай жаргона без объяснения',
      content: [
        { type: 'text', value: 'Перепиши слабые примеры технического письма, делая их более профессиональными и конкретными.' }
      ],
      tasks: [
        {
          weak: 'The system is slow when there are many users.',
          improved: 'API response time for the /search endpoint degrades to over 3 seconds when concurrent user count exceeds 500, compared to the target SLA of 300ms.',
          tip: 'Добавь конкретные числа, укажи конкретный компонент и сравни с целевым показателем.'
        },
        {
          weak: 'We need to fix the database.',
          improved: 'We need to add an index on the users.email column to fix the full table scan that is causing the login query to take 2.3 seconds.',
          tip: 'Конкретная таблица, конкретная проблема, конкретное решение и числа.'
        },
        {
          weak: 'Don\'t use this function because it doesn\'t work properly.',
          improved: 'Avoid using parseUserInput() — it does not handle Unicode characters above U+FFFF, which causes data corruption for users with emoji in their names. Use sanitizeUserInput() instead, which correctly handles the full Unicode range.',
          tip: 'Объясни конкретно что не работает, при каких условиях и что использовать вместо этого.'
        }
      ]
    },
    {
      id: 8,
      title: 'Writing API endpoint documentation',
      type: 'practice',
      description: 'Напиши документацию для API endpoint.',
      solution: 'Структура API endpoint документации:\nМетод и путь: POST /api/v1/resource\nDescription — что делает endpoint\nRequest — headers, body с типами и обязательностью\nResponse — коды статуса с примерами\nNotes — ограничения, rate limiting, особенности\n\nПример: POST /api/users → 201 с токеном, 409 если email занят.',
      content: [
        { type: 'text', value: 'Документирование API-эндпоинта — важный навык. Используй структуру: Description, Parameters, Request, Response, Errors.' }
      ],
      tasks: [
        {
          endpoint: 'POST /api/users',
          purpose: 'Создание нового пользователя',
          sampleDoc: 'POST /api/users\n\nCreate a new user account.\n\nRequest Body:\n{\n  "email": "string (required) — Valid email address",\n  "password": "string (required) — Min 8 chars, must contain uppercase and number",\n  "name": "string (required) — Display name, 2-50 characters",\n  "role": "string (optional) — Defaults to \'user\'. Values: user | admin"\n}\n\nResponse 201 Created:\n{\n  "id": "uuid",\n  "email": "string",\n  "name": "string",\n  "createdAt": "ISO 8601 timestamp"\n}\n\nErrors:\n400 Bad Request — Validation failed (e.g., invalid email format)\n409 Conflict — Email already registered\n500 Internal Server Error — Server error\n\nExample:\nPOST /api/users\nContent-Type: application/json\n\n{\n  "email": "alex@example.com",\n  "password": "SecurePass1",\n  "name": "Alex"\n}'
        }
      ]
    },
    {
      id: 9,
      title: 'Slack and chat messages in IT',
      type: 'practice',
      description: 'Напиши профессиональное Slack/chat сообщение для IT команды.',
      solution: 'Правила IT-коммуникации в чате:\n1. Конкретная тема в начале\n2. Контекст — почему пишешь\n3. Вопрос или запрос — что нужно\n4. Дедлайн если важно\n5. @mention нужных людей\n\nПример: "@alex Hey! I\'m working on the auth flow (#234) and ran into a question about the token expiry. Should refresh tokens expire after 30 days or never? Need to know before EOD to finalize the implementation."',
      content: [
        { type: 'text', value: 'В Slack/Teams/Discord важен профессиональный но не формальный стиль. Кратко, по делу, с контекстом.' }
      ],
      tasks: [
        {
          situation: 'Хочешь попросить коллегу проверить твой PR',
          bad: 'check my pr',
          good: 'Hey @Sarah, could you take a look at PR #247 when you have a moment? It adds caching for the profile endpoint. Should be a quick review — no architecture changes, just added middleware. Thanks!',
          explanation: 'Указал номер PR, что делает, примерный объём работы для ревьюера.'
        },
        {
          situation: 'Сервис упал, ты первым заметил',
          bad: 'server down',
          good: '@oncall ALERT: Payment service is returning 503 errors since ~14:32 UTC. Affects checkout flow. Error rate: 100%. I\'m looking into it now.',
          explanation: 'Тег @oncall, конкретный сервис, время начала, влияние, кто расследует.'
        }
      ]
    },
    {
      id: 10,
      title: 'Writing a post-mortem',
      type: 'practice',
      description: 'Напиши post-mortem после production инцидента.',
      solution: 'Структура post-mortem:\n## Summary — инцидент в 2-3 предложениях\n## Timeline — хронология с временными метками\n## Root Cause — первопричина (не симптом)\n## Impact — кто пострадал, сколько времени\n## What Went Well — что сработало\n## What Went Wrong — что нужно улучшить\n## Action Items — конкретные задачи с ответственными и дедлайнами\n\nТон: blameless (без обвинений людей).',
      content: [
        { type: 'text', value: 'Post-mortem (retrospective analysis) — анализ инцидента. Фокус на системных проблемах, не на виновных.' }
      ],
      template: '# Post-mortem: [Incident Title]\nDate: [Date]\nSeverity: [P1/P2/P3]\nDuration: [Duration]\n\n## Summary\n[1-2 sentences what happened and impact]\n\n## Timeline\n[time] - [event]\n\n## Root Cause\n[What was the underlying cause?]\n\n## Contributing Factors\n- [Factor 1]\n- [Factor 2]\n\n## Impact\n- Users affected:\n- Revenue impact (if applicable):\n\n## Action Items\n| Action | Owner | Due Date |\n|--------|-------|----------|\n| [Fix] | [Name] | [Date] |',
      samplePostMortem: '# Post-mortem: Payment Service Outage\nDate: 2024-01-15\nSeverity: P1\nDuration: 47 minutes (14:32 - 15:19 UTC)\n\n## Summary\nA misconfigured database connection pool caused the payment service to stop processing transactions for 47 minutes, affecting ~2,300 users.\n\n## Timeline\n14:32 - Spike in 503 errors detected by monitoring\n14:38 - On-call engineer paged\n14:45 - Root cause identified: DB pool exhausted\n14:52 - Temporary fix applied (increased pool size)\n15:19 - Service fully recovered\n\n## Root Cause\nA config file change deployed at 14:30 accidentally set max_connections to 5 (down from 50). This caused the pool to exhaust under normal load.\n\n## Contributing Factors\n- Config change was not reviewed in PR (bypassed review for "minor config update")\n- No automated validation of DB pool configuration values\n\n## Action Items\n| Action | Owner | Due Date |\n|--------|-------|----------|\n| Add config value validation to CI | DevOps | Jan 22 |\n| Require PR review for all config changes | Team Lead | Jan 17 |\n| Add DB pool metrics to monitoring | SRE | Jan 22 |'
    }
  ]
}
